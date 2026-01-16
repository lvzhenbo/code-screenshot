/**
 * 获取webview API的实例。
 *
 * 这只能在 webview 的上下文中调用一次。尝试在已经调用过 `acquireVsCodeApi` 后再次调用将抛出异常。
 *
 * @template StateType 持久化存储的状态类型。
 */
declare function acquireVsCodeApi<StateType = unknown>(): VsCodeWebviewApi<StateType>;

/**
 * 图片格式类型
 */
type ImageFormat = 'svg' | 'png' | 'jpeg' | 'webp';

/**
 * 编辑器配置类型
 */
interface EditorConfig {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontLigatures: boolean;
  colorTheme: string;
}
