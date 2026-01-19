<template>
  <div class="code-container overflow-auto">
    <div ref="codeWrapper" class="code-wrapper nline-block min-w-full">
      <div class="rounded-lg overflow-hidden shadow-lg">
        <!-- 窗口标题栏 -->
        <div class="window-header flex items-center gap-2 px-4 py-3 bg-[#1e1e1e]">
          <div class="flex gap-2">
            <span class="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
            <span class="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
            <span class="w-3 h-3 rounded-full bg-[#27c93f]"></span>
          </div>
          <span class="ml-2 text-xs text-gray-400">{{ displayFileName }}</span>
        </div>
        <!-- 代码区域 -->
        <div class="code-content" v-html="highlightedCode"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { codeToHtml } from 'shiki';
  import { langMap, getShikiTheme } from '@/utils/shikiTheme';

  // Props
  export interface EditorConfig {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    fontLigatures: boolean;
    colorTheme: string;
  }

  const props = defineProps<{
    code: string;
    fileName: string;
    languageId: string;
    startLine: number;
    editorConfig: EditorConfig;
    containerBackground: string;
    containerPadding: string;
  }>();

  // 暴露 codeWrapper 给父组件
  const codeWrapperRef = useTemplateRef('codeWrapper');
  defineExpose({
    codeWrapper: codeWrapperRef,
  });

  // 高亮后的 HTML
  const highlightedCode = ref('');

  // 显示的文件名（只显示文件名，不显示完整路径）
  const displayFileName = computed(() => {
    if (!props.fileName) return 'Untitled';
    const parts = props.fileName.replace(/\\/g, '/').split('/');
    return parts[parts.length - 1];
  });

  // 高亮代码
  async function highlightCode() {
    try {
      const lang = langMap[props.languageId] || props.languageId;
      const theme = getShikiTheme(props.editorConfig.colorTheme);

      highlightedCode.value = await codeToHtml(props.code, {
        lang,
        theme,
        transformers: [
          {
            // 添加行号
            line(node, line) {
              node.properties['data-line'] = props.startLine + line - 1;
            },
          },
        ],
      });
    } catch {
      // 如果语言不支持，回退到纯文本
      console.warn(`Language "${props.languageId}" not supported, falling back to text`);
      highlightedCode.value = await codeToHtml(props.code, {
        lang: 'text',
        theme: 'dark-plus',
      });
    }
  }

  // 监听代码和主题变化
  watch(() => [props.code, props.languageId, props.editorConfig.colorTheme], highlightCode, {
    immediate: true,
  });
</script>

<style>
  /* 代码包装器样式 */
  .code-wrapper {
    width: fit-content;
    background: v-bind('props.containerBackground');
    padding: v-bind('props.containerPadding');
  }

  /* Shiki 代码块样式 */
  .code-content pre {
    padding: 1rem;
    margin: 0;
  }

  .code-content code {
    font-family: v-bind('props.editorConfig.fontFamily');
    font-size: v-bind('props.editorConfig.fontSize + "px"');
    line-height: v-bind('props.editorConfig.lineHeight || 1.6');
    font-variant-ligatures: v-bind('props.editorConfig.fontLigatures ? "normal" : "none"');
    background: none !important;
    display: block;
  }

  /* 行号样式 */
  .code-content .line::before {
    content: attr(data-line);
    display: inline-block;
    width: 3em;
    margin-right: 1em;
    text-align: right;
    color: #6e7681;
    user-select: none;
  }
</style>
