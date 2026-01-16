<template>
  <vscode-collapsible v-model="settingsOpen" heading="设置" class="mb-4 w-full">
    <div class="settings-panel p-1 overflow-auto">
      <div class="inline-flex flex-col">
        <!-- 主题设置 -->
        <vscode-form-group>
          <vscode-label for="theme-select">主题</vscode-label>
          <vscode-single-select id="theme-select" v-model="selectedTheme">
            <vscode-option v-for="theme in availableThemes" :key="theme.value" :value="theme.value">
              {{ theme.label }}
            </vscode-option>
          </vscode-single-select>
          <vscode-form-helper>
            <p>选择代码高亮主题</p>
          </vscode-form-helper>
        </vscode-form-group>

        <!-- 字体家族 -->
        <vscode-form-group>
          <vscode-label for="font-family">字体家族</vscode-label>
          <vscode-textfield
            id="font-family"
            v-model="editorConfig.fontFamily"
            placeholder="例如: Consolas, 'Courier New', monospace"
          ></vscode-textfield>
          <vscode-form-helper>
            <p>设置代码字体，支持字体列表，例如: <code>Consolas, 'Courier New', monospace</code></p>
          </vscode-form-helper>
        </vscode-form-group>

        <!-- 字体大小 -->
        <vscode-form-group>
          <vscode-label for="font-size">字体大小</vscode-label>
          <vscode-textfield
            id="font-size"
            v-model.number="editorConfig.fontSize"
            type="number"
            :min="8"
            :max="48"
          ></vscode-textfield>
          <vscode-form-helper>
            <p>设置字体大小，单位为像素 (px)，范围: 8-48</p>
          </vscode-form-helper>
        </vscode-form-group>

        <!-- 行高 -->
        <vscode-form-group>
          <vscode-label for="line-height">行高</vscode-label>
          <vscode-textfield
            id="line-height"
            v-model.number="editorConfig.lineHeight"
            type="number"
            :min="0"
            :max="3"
            step="0.1"
            placeholder="0"
          ></vscode-textfield>
          <vscode-form-helper>
            <p>设置行高倍数，范围: 1-3，设置为 0 使用自动行高</p>
          </vscode-form-helper>
        </vscode-form-group>

        <!-- 字体连字 -->
        <vscode-form-group>
          <vscode-label for="font-ligatures">字体连字</vscode-label>
          <vscode-checkbox
            id="font-ligatures"
            :checked="editorConfig.fontLigatures"
            @change="
              (e: Event) => {
                const target = e.target as HTMLInputElement;
                if (target) {
                  editorConfig.fontLigatures = target.checked;
                }
              }
            "
          >
            启用字体连字
          </vscode-checkbox>
          <vscode-form-helper>
            <p>启用编程字体的连字功能（如 Fira Code, JetBrains Mono）</p>
          </vscode-form-helper>
        </vscode-form-group>

        <!-- 图片格式 -->
        <vscode-form-group>
          <vscode-label for="image-format">图片格式</vscode-label>
          <vscode-single-select id="image-format" v-model="imageFormat">
            <vscode-option v-for="format in imageFormats" :key="format.value" :value="format.value">
              {{ format.label }}
            </vscode-option>
          </vscode-single-select>
          <vscode-form-helper>
            <p>选择截图导出格式</p>
          </vscode-form-helper>
        </vscode-form-group>

        <!-- 图片质量 (仅 JPEG/WebP) -->
        <vscode-form-group v-if="imageFormat === 'jpeg' || imageFormat === 'webp'">
          <vscode-label for="image-quality">图片质量</vscode-label>
          <vscode-textfield
            id="image-quality"
            v-model.number="imageQuality"
            type="number"
            :min="1"
            :max="100"
          ></vscode-textfield>
          <vscode-form-helper>
            <p>设置图片压缩质量，范围: 1-100，数值越大质量越高</p>
          </vscode-form-helper>
        </vscode-form-group>
      </div>
    </div>
  </vscode-collapsible>
</template>

<script setup lang="ts">
  import {
    VscodeSingleSelect,
    VscodeOption,
    VscodeLabel,
    VscodeTextfield,
    VscodeCheckbox,
    VscodeFormGroup,
    VscodeFormHelper,
    VscodeCollapsible,
  } from '@vscode-elements/elements';
  import { availableThemes, vscodeThemeNormalizeMap } from '../utils/shikiTheme';

  // 使用 defineModel 实现双向绑定
  const editorConfig = defineModel<EditorConfig>('editorConfig', { required: true });
  const imageFormat = defineModel<ImageFormat>('imageFormat', { required: true });
  const imageQuality = defineModel<number>('imageQuality', { required: true });

  // 设置面板折叠状态
  const settingsOpen = ref(false);

  // 可选的图片格式
  const imageFormats: { label: string; value: ImageFormat }[] = [
    { label: 'SVG (矢量图)', value: 'svg' },
    { label: 'PNG (无损)', value: 'png' },
    { label: 'JPG (有损压缩)', value: 'jpeg' },
    { label: 'WebP (高效压缩)', value: 'webp' },
  ];

  // 创建计算属性，用于下拉框的双向绑定
  // 将任何 VSCode 主题别名标准化为第一个名称
  const selectedTheme = computed({
    get: () => {
      const currentTheme = editorConfig.value.colorTheme;
      return vscodeThemeNormalizeMap[currentTheme] || currentTheme;
    },
    set: (value: string) => {
      editorConfig.value.colorTheme = value;
    },
  });
</script>

<style scoped>
  /* 设置面板样式 */
  .settings-panel {
    background: var(--vscode-sideBar-background, #252526);
    border: 1px solid var(--vscode-panel-border, #3e3e42);
  }

  /* 表单辅助文字不换行 */
  :deep(vscode-form-helper p),
  :deep(vscode-form-helper code) {
    white-space: nowrap;
  }
</style>
