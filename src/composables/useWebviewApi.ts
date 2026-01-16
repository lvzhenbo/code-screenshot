import { promiseTimeout } from '@vueuse/core';
import { isNil, noop } from 'es-toolkit';

/**
 * VS Code Webview API 接口定义
 * 这是对 VS Code 原生 acquireVsCodeApi() 返回对象的类型定义
 * 提供了 webview 与扩展主进程之间的通信能力
 */
export interface WebviewApi<StateType> {
  /**
   * 向 webview 的所有者（扩展主进程）发送消息
   * 这是一个单向通信方法，不会等待响应
   *
   * @param message 要发送的数据，必须是可 JSON 序列化的对象
   */
  postMessage(message: unknown): void;

  /**
   * 获取为此 webview 存储的持久化状态
   * 状态会在 webview 隐藏后保留，重新显示时可以恢复
   *
   * @return 当前状态，如果没有设置过状态则返回 `undefined`
   */
  getState(): StateType | undefined;

  /**
   * 设置为此 webview 存储的持久化状态
   * 状态会被序列化并持久保存，即使 webview 被隐藏也不会丢失
   *
   * @param newState 新的持久化状态，必须是可 JSON 序列化的对象
   *                 可以通过 {@link getState} 方法重新获取
   *
   * @return 返回设置的新状态
   */
  setState<T extends StateType | undefined>(newState: T): T;
}

export type PostMessageOptions = PostMessageAsyncOptions & PostMessageDataOptions;

/**
 * 异步消息发送配置选项
 * 用于控制 postAndReceive 方法的重试和超时行为
 */
export interface PostMessageAsyncOptions {
  /**
   * 重试发送消息的时间间隔（毫秒）
   * 在等待响应期间，会按此间隔重复发送消息，直到收到响应或超时
   * @default 200
   */
  interval?: number;
  /**
   * 等待响应的超时时间（毫秒）
   * 如果在此时间内没有收到响应，Promise 将被 reject
   * @default 10000
   */
  timeout?: number;
}

/**
 * 消息数据结构配置选项
 * 用于自定义消息对象中的键名，以适配不同的消息格式
 */
export interface PostMessageDataOptions {
  /**
   * 消息对象中表示消息类型的键名
   * 用于标识消息的类型，以便正确路由到对应的处理器
   * @default 'type'
   */
  typeKey?: string;
  /**
   * 消息对象中表示消息数据的键名
   * 用于存放实际的消息内容/负载数据
   * @default 'data'
   */
  dataKey?: string;
}

/**
 * 消息监听器函数类型
 * 用于处理接收到的特定类型的消息
 * @template T 消息数据的类型
 */
export type PostMessageListener<T> = (data: T) => void | Promise<void>;

// ==================== 常量定义 ====================

const INTERVAL = 200;
const TIMEOUT = 10000;
const TYPE_KEY = 'type';
const DATA_KEY = 'data';

/** 全局默认的消息发送配置 */
const defaultOptions: PostMessageOptions = {
  interval: INTERVAL,
  timeout: TIMEOUT,
  typeKey: TYPE_KEY,
  dataKey: DATA_KEY,
};

// ==================== 单例 API 管理 ====================

let webviewApiInstance: WebviewApi<unknown> | null = null;

function getWebviewApi<StateType>(): WebviewApi<StateType> | null {
  if (webviewApiInstance) {
    return webviewApiInstance as WebviewApi<StateType>;
  }

  if (typeof acquireVsCodeApi !== 'function') {
    console.error('acquireVsCodeApi is not a function');
    return null;
  }

  webviewApiInstance = acquireVsCodeApi();
  return webviewApiInstance as WebviewApi<StateType>;
}

// ==================== 类型定义 ====================

/** 消息事件类型 */
export interface WebviewMessage<T = unknown> {
  type: string | number;
  data: T;
  timestamp: number;
}

/** useWebviewApi 返回类型 */
export interface UseWebviewApiReturn<StateType> {
  /** 当前持久化状态 */
  state: ReturnType<typeof shallowRef<StateType | undefined>>;
  /** API 是否就绪 */
  isReady: ReturnType<typeof shallowRef<boolean>>;
  /** 最后接收到的消息 */
  lastMessage: ReturnType<typeof shallowRef<WebviewMessage | null>>;
  /** 已注册的监听器类型列表 */
  listenerTypes: ReturnType<typeof computed<(string | number)[]>>;
  /** 监听器数量 */
  listenerCount: ReturnType<typeof computed<number>>;
  /** 配置选项（响应式） */
  options: PostMessageOptions;
  /** 发送单向消息 */
  post: (type: string | number, data?: unknown) => void;
  /** 发送消息并等待响应 */
  postAndReceive: <T>(
    type: string | number,
    data?: unknown,
    asyncOptions?: PostMessageAsyncOptions,
  ) => Promise<T>;
  /** 注册消息监听器 */
  on: <T>(
    type: string | number,
    success: PostMessageListener<T>,
    fail?: PostMessageListener<unknown>,
  ) => () => void;
  /** 移除消息监听器 */
  off: (type: string | number) => boolean;
  /** 发送原始消息 */
  postMessage: <T = unknown>(message: T) => void;
  /** 设置持久化状态 */
  setState: <T extends StateType | undefined>(newState: T) => T;
}

// ==================== 核心实现 ====================

/**
 * 创建 Webview API 核心逻辑（内部使用）
 */
function createWebviewApiCore<StateType = unknown>(initialOptions?: PostMessageOptions) {
  const webviewApi = getWebviewApi<StateType>();

  // ========== 响应式状态 ==========
  const state = shallowRef<StateType | undefined>(webviewApi?.getState());
  const isReady = shallowRef(!!webviewApi);
  const lastMessage = shallowRef<WebviewMessage | null>(null);

  // 响应式配置选项
  const options = reactive<PostMessageOptions>({
    ...defaultOptions,
    ...initialOptions,
  });

  // 响应式监听器 Map
  const listenersMap = shallowRef(new Map<string | number, PostMessageListener<unknown>[]>());

  // ========== 计算属性 ==========
  const listenerTypes = computed(() => [...listenersMap.value.keys()]);
  const listenerCount = computed(() => listenersMap.value.size);

  // ========== 内部方法 ==========
  const getTypeKey = () => options.typeKey ?? TYPE_KEY;
  const getDataKey = () => options.dataKey ?? DATA_KEY;

  function _postMessage(type: string | number, data: unknown) {
    webviewApi?.postMessage({
      [getTypeKey()]: type,
      [getDataKey()]: data,
    });
  }

  function _runListener(type: string | number, result?: unknown, error?: unknown) {
    if (isNil(type) || listenersMap.value.size === 0) return;

    const listenerArr = listenersMap.value.get(type);
    if (!listenerArr) return;

    if (!isNil(result)) listenerArr[0]?.(result);
    if (!isNil(error)) listenerArr[1]?.(error);
  }

  function _updateListenersMap(
    updater: (map: Map<string | number, PostMessageListener<unknown>[]>) => void,
  ) {
    const newMap = new Map(listenersMap.value);
    updater(newMap);
    listenersMap.value = newMap;
    triggerRef(listenersMap);
  }

  // ========== 消息处理 ==========
  function handleMessage(event: MessageEvent) {
    const message = event.data || {};
    const type = message[getTypeKey()];
    const data = message[getDataKey()];

    lastMessage.value = { type, data, timestamp: Date.now() };
    _runListener(type, data);
  }

  // ========== 公开方法 ==========

  /** 发送单向消息 */
  const post = (type: string | number, data?: unknown) => _postMessage(type, data);

  /** 发送消息并等待响应（请求-响应模式） */
  async function postAndReceive<T>(
    type: string | number,
    data?: unknown,
    asyncOptions?: PostMessageAsyncOptions,
  ): Promise<T> {
    if (!webviewApi) {
      throw new Error('acquireVsCodeApi is not available');
    }

    const interval = asyncOptions?.interval ?? options.interval ?? INTERVAL;
    const timeout = asyncOptions?.timeout ?? options.timeout ?? TIMEOUT;

    return new Promise<T>((resolve, reject) => {
      const sendMessage = () => _postMessage(type, data);

      // 使用 useIntervalFn 进行重试
      const { pause: stopInterval } = useIntervalFn(sendMessage, interval, {
        immediate: false,
        immediateCallback: true,
      });

      // 清理函数
      let stopMessageListener = noop;
      const cleanup = () => {
        stopInterval();
        stopMessageListener();
      };

      // 使用 promiseTimeout 进行超时控制
      promiseTimeout(timeout).then(() => {
        cleanup();
        _runListener(type, undefined, new Error('Timeout'));
        reject(new Error('Timeout'));
      });

      // 使用 useEventListener 监听消息
      stopMessageListener = useEventListener(window, 'message', (e: MessageEvent) => {
        if (!e.origin.startsWith('vscode-webview://') || !e.data || e.data[getTypeKey()] !== type) {
          return;
        }

        cleanup();
        const res = e.data[getDataKey()];
        _runListener(type, res);
        resolve(res as T);
      });
    });
  }

  /** 注册消息监听器 */
  function on<T>(
    type: string | number,
    success: PostMessageListener<T>,
    fail?: PostMessageListener<unknown>,
  ): () => void {
    _updateListenersMap((map) => {
      map.set(
        type,
        fail
          ? [success as PostMessageListener<unknown>, fail]
          : [success as PostMessageListener<unknown>],
      );
    });

    const stop = () => off(type);

    // 使用 tryOnScopeDispose 在作用域销毁时自动清理
    tryOnScopeDispose(stop);

    return stop;
  }

  /** 移除消息监听器 */
  function off(type: string | number): boolean {
    if (!listenersMap.value.has(type)) return false;

    _updateListenersMap((map) => map.delete(type));
    return true;
  }

  /** 发送原始消息 */
  const postMessage = <T = unknown>(message: T) => webviewApi?.postMessage(message);

  /** 设置持久化状态 */
  function setState<T extends StateType | undefined>(newState: T): T {
    webviewApi?.setState(newState);
    state.value = newState;
    return newState;
  }

  return {
    // 内部使用
    webviewApi,
    handleMessage,
    // 响应式状态
    state,
    isReady,
    lastMessage,
    listenerTypes,
    listenerCount,
    options,
    // 方法
    post,
    postAndReceive,
    on,
    off,
    postMessage,
    setState,
  };
}

// ==================== 导出的组合式函数 ====================

/**
 * VS Code Webview API 的 Vue 3 组合式函数封装（单例模式）
 *
 * 使用 `createSharedComposable` 确保整个应用只创建一个实例，
 * 所有组件共享同一份状态和监听器。
 *
 * 特性：
 * - 使用 `shallowRef` + `reactive` 管理响应式状态
 * - 使用 `useEventListener` 自动清理事件监听器
 * - 使用 `useIntervalFn` + `promiseTimeout` 管理重试和超时
 * - 使用 `tryOnScopeDispose` 自动清理监听器
 * - 使用 `createSharedComposable` 确保单例
 *
 * @template StateType webview 持久化状态的类型
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useWebviewApi } from '@/composables/useWebviewApi';
 *
 * const {
 *   post,
 *   postAndReceive,
 *   on,
 *   state,
 *   isReady,
 *   lastMessage,
 * } = useWebviewApi<MyState>();
 *
 * // 监听消息（自动在组件卸载时清理）
 * on('update', (data) => {
 *   console.log('收到更新:', data);
 * });
 *
 * // 发送并等待响应
 * const result = await postAndReceive<Result>('getData', { id: 1 });
 * </script>
 * ```
 */
export const useWebviewApi = createSharedComposable(<StateType = unknown>() => {
  const core = createWebviewApiCore<StateType>();

  // 初始化全局消息监听
  if (core.webviewApi) {
    useEventListener(window, 'message', core.handleMessage);
  }

  // 解构返回，排除内部属性
  const { webviewApi: _, handleMessage: __, ...publicApi } = core;
  return publicApi as UseWebviewApiReturn<StateType>;
});

/**
 * 创建全局状态的 Webview API（适用于非组件场景）
 *
 * 使用 `createGlobalState` 创建可在任何地方使用的全局响应式状态，
 * 适用于 Pinia store、工具函数等场景。
 *
 * @template StateType webview 持久化状态的类型
 *
 * @example
 * ```typescript
 * // 在 Pinia store 中
 * import { useGlobalWebviewApi } from '@/composables/useWebviewApi';
 *
 * export const useMyStore = defineStore('my', () => {
 *   const api = useGlobalWebviewApi<MyState>();
 *
 *   // 监听状态变化
 *   watch(api.lastMessage, (msg) => {
 *     if (msg?.type === 'stateUpdate') {
 *       // 处理状态更新
 *     }
 *   });
 *
 *   return { api };
 * });
 * ```
 */
export const useGlobalWebviewApi = createGlobalState(<StateType = unknown>() => {
  const core = createWebviewApiCore<StateType>();

  // 初始化全局消息监听（在非组件环境中使用原生 API）
  if (core.webviewApi) {
    window.addEventListener('message', core.handleMessage);
  }

  const { webviewApi: _, handleMessage: __, ...publicApi } = core;
  return publicApi as UseWebviewApiReturn<StateType>;
});
