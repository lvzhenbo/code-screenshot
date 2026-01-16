<template>
  <div class="min-h-screen bg-(--vscode-editor-background) p-4">
    <!-- 操作按钮 -->
    <div class="mb-4 flex gap-2">
      <vscode-button :disabled="isCapturing" @click="captureAndCopy"> 复制 </vscode-button>
      <vscode-button :disabled="isCapturing" appearance="secondary" @click="downloadScreenshot">
        下载
      </vscode-button>
    </div>

    <!-- 设置面板 -->
    <SettingsPanel
      v-model:editor-config="editorConfig"
      v-model:image-format="selectedImageFormat"
      v-model:image-quality="imageQuality"
      class="mb-4"
    />

    <CodeContainer
      ref="codeContainerRef"
      :code
      :file-name
      :language-id
      :start-line
      :editor-config
    />
  </div>
</template>

<script setup lang="ts">
  import { snapdom } from '@zumer/snapdom';
  import { VscodeButton } from '@vscode-elements/elements';
  import { useWebviewApi } from './composables/useWebviewApi';
  import { delay } from 'es-toolkit';

  // 初始化 VSCode Webview API
  const { post, on } = useWebviewApi();

  // 截图状态
  const isCapturing = ref(false);

  // 代码容器组件引用
  const codeContainerRef = useTemplateRef('codeContainerRef');

  // 代码数据
  const code = ref('// 选中代码后打开此面板');
  const fileName = ref('');
  const languageId = ref('plaintext');
  const startLine = ref(1);

  // 编辑器配置
  const editorConfig = ref({
    fontFamily: 'Consolas, monospace',
    fontSize: 14,
    lineHeight: 0,
    fontLigatures: false,
    colorTheme: 'Default Dark+',
  });

  // 当前选择的图片格式
  const selectedImageFormat = ref<ImageFormat>('png');

  // 图片质量 (仅对 JPEG 和 WebP 有效)
  const imageQuality = ref(90);

  // 获取 MIME 类型
  function getMimeType(format: ImageFormat): string {
    const mimeTypes: Record<ImageFormat, string> = {
      svg: 'image/svg+xml',
      png: 'image/png',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
    };
    return mimeTypes[format];
  }

  // 生成截图 Blob
  async function generateScreenshot(): Promise<Blob> {
    const codeWrapper = codeContainerRef.value?.codeWrapper;
    if (!codeWrapper) {
      throw new Error('找不到代码容器');
    }

    const format = selectedImageFormat.value;
    const options: { type: 'svg' | 'png' | 'jpeg' | 'webp'; quality?: number } = {
      type: format,
    };

    // JPEG 和 WebP 支持质量设置
    if (format === 'jpeg' || format === 'webp') {
      options.quality = imageQuality.value / 100;
    }

    // 统一使用 toBlob 处理所有格式（包括 SVG）
    return await snapdom.toBlob(codeWrapper, options);
  }

  // 截图并复制到剪贴板
  async function captureAndCopy() {
    const codeWrapper = codeContainerRef.value?.codeWrapper;
    if (!codeWrapper) {
      console.error('找不到代码容器');
      return;
    }
    isCapturing.value = true;
    await delay(100);
    try {
      const format = selectedImageFormat.value;
      const mimeType = getMimeType(format);
      const blob = await generateScreenshot();

      try {
        // 先尝试在 webview 中直接复制
        await navigator.clipboard.write([
          new ClipboardItem({
            [mimeType]: blob,
          }),
        ]);
        post('showMessage', { message: '截图已复制到剪贴板' });
      } catch (clipboardError) {
        // 如果 webview 中复制失败，则通过扩展处理
        console.log('Webview clipboard failed, using extension method', clipboardError);
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          post('copyImage', { dataUrl, format, mimeType });
        };
        reader.readAsDataURL(blob);
      }
    } catch (error) {
      console.error('截图失败:', error);
      post('showMessage', { message: '截图失败: ' + error, isError: true });
    } finally {
      isCapturing.value = false;
    }
  }

  // 下载截图
  async function downloadScreenshot() {
    const codeWrapper = codeContainerRef.value?.codeWrapper;
    if (!codeWrapper) {
      console.error('找不到代码容器');
      return;
    }
    isCapturing.value = true;
    await delay(100);
    try {
      // 生成文件名
      const format = selectedImageFormat.value;
      const extension = format === 'jpeg' ? 'jpg' : format;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const baseFilename = fileName.value
        ? fileName.value
            .split(/[\\\/]/)
            .pop()
            ?.replace(/\.[^.]+$/, '')
        : 'screenshot';
      const filename = `code-${baseFilename}-${timestamp}`;

      // 使用统一的 generateScreenshot 生成 blob
      const blob = await generateScreenshot();

      // 转换为 base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        post('downloadImage', { dataUrl, filename, format, extension });
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('下载失败:', error);
      post('showMessage', { message: '下载失败: ' + error, isError: true });
    } finally {
      isCapturing.value = false;
    }
  }

  // 接收来自扩展的消息
  onMounted(() => {
    // 监听 updateCode 消息
    on<{
      code: string;
      fileName: string;
      languageId: string;
      startLine: number;
      editorConfig?: typeof editorConfig.value;
    }>('updateCode', (data) => {
      code.value = data.code;
      fileName.value = data.fileName || '';
      languageId.value = data.languageId || 'plaintext';
      startLine.value = data.startLine || 1;
      if (data.editorConfig) {
        editorConfig.value = data.editorConfig;
      }
    });

    // 通知扩展 webview 已准备好
    post('ready');
  });
</script>
