# 代码截图 (Code Screenshot)

一个用 [Shiki](https://shiki.style/) 作为核心的，用于在 VSCode 中快速生成高质量代码截图的扩展。它能够将你选中的代码片段转化为精美的图片，支持丰富的外观自定义设置，无论是用于分享代码片段、撰写技术文章还是制作演示文稿，都能轻松应对。本项目参考了优秀项目 [snipped](https://github.com/jeffersonlicet/snipped) 。

## ✨ 主要特性

- 📸 **快速预览**：选中代码即可快速生成预览，所见即所得。
- 📋 **便捷分享**：支持一键 **复制** 图片到剪贴板，或 **下载** 到本地，由 [snapdom](https://github.com/zumerlab/snapdom) 支持。
- 🎨 **高度可定制**：
  - **主题**：多种精美代码高亮主题，并可匹配大多数 VSCode 主题插件，由 [Shiki](https://shiki.style/themes) 内置主题支持。
  - **字体**：支持自定义字体家族、字号大小。
  - **排版**：支持调整行高、开启/关闭字体连字 (Font Ligatures)。
  - **容器**：支持调整容器内边距、容器背景。
- 💾 **多种格式支持**：
  - 支持导出为 **PNG**、**JPEG**、**WebP** 和 **SVG** 格式。
  - 支持针对 JPEG/WebP 调整图片质量。
- 🔄 **智能默认值**：自动读取你当前的 VSCode 编辑器配置（字体、主题等）作为默认设置。

## 🚀 使用指南

1. **选择代码**：在 VSCode 编辑器中，选中你想要截图的代码片段。
2. **打开面板**：
   - **方式一（右键菜单）**：在选区上点击鼠标右键，选择菜单中的 **"打开代码截图"** (Open Code Screenshot)。
   - **方式二（命令面板）**：按下 `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) 打开命令面板，输入并执行 `打开代码截图` 命令。
3. **调整样式**：在右侧打开的预览面板中，你可以通过顶部的设置项实时调整外观。
4. **获取图片**：
   - 点击 **"复制"** 按钮：将图片直接复制到系统剪贴板（通常用于直接粘贴到文档或聊天软件）。
   - 点击 **"下载"** 按钮：将图片保存为文件。

## ⚙️ 设置说明

在扩展面板中，提供以下配置选项：

- **主题 (Theme)**：代码语法高亮配色方案。
- **字体家族 (Font Family)**：CSS 字体列表，例如 `'Fira Code', Consolas, monospace`。
- **字体大小 (Font Size)**：代码文字的大小 (px)。
- **行高 (Line Height)**：代码行间距倍数。设置为 0 时根据字体自动调整。
- **字体连字 (Font Ligatures)**：是否启用编程字体的连字特性（需要字体本身支持）。
- **图片格式**：导出图片的格式设置。
- **图片质量**：仅在格式为 JPEG 或 WebP 时可用，范围 0-100。
- **容器背景**：容器背景颜色，CSS [background](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/background) 的有效值
- **容器内边距**：容器内边距用于衬托容器背景，带单位的值

## 🛠️ 开发与构建

本项目是一个基于 Webview 的 VSCode 扩展，前端界面使用 Vue 3 + Vite + [vite-plugin-vscode](https://github.com/tomjs/vite-plugin-vscode) 构建，插件使用 [reactive-vscode](https://github.com/kermanx/reactive-vscode) 简化开发。

### 环境要求

- Node.js `>=24.0.0`
- pnpm (建议使用)

### 安装依赖

```bash
pnpm install
```

### 开发调试

在 VSCode 中，按下 `F5` 启动扩展宿主环境进行调试。

### 构建发布

```bash
pnpm build
```

该命令会执行类型检查 (`vue-tsc`) 并构建前端资源及扩展入口文件。

## ❓已知问题

### 1. 代码不能语义化高亮问题

原因是项目使用 `Shiki` 作为代码高亮引擎。 `Shiki` 虽然脱胎于 VSCode 代码高亮引擎，不过因为需要语言服务器，所以暂时不支持语义化高亮，相关 [Issue](https://github.com/shikijs/shiki/issues/68) 。不过插件本身就是运行在 VSCode 中，所以理论上可以搞，不过暂时没有时间去研究，有需要的可以自己研究提PR。

### 2. 复制和下载卡顿问题

原因可能是 `snapdom` 会获取根元素全部的 CSS 变量后再筛选，而 VSCode 环境中有高达800+的 CSS 变量，相关 [Issue](https://github.com/zumerlab/snapdom/issues/348) 。暂时先用着，后面实在太卡了再说 ~~（感觉上其实还行）~~。

## 📄 许可证

[MIT](./LICENSE)
