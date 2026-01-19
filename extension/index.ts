import {
  computed,
  defineExtension,
  shallowRef,
  useActiveTextEditor,
  useCommand,
  useDocumentText,
  useTextEditorSelection,
} from 'reactive-vscode';
import { Uri, ViewColumn, window, workspace } from 'vscode';
import type { WebviewPanel } from 'vscode';
import { getWebviewHtml } from 'virtual:vscode';

const { activate, deactivate } = defineExtension((ctx) => {
  // 存储当前打开的 panel
  const currentPanel = shallowRef<WebviewPanel | null>(null);

  // 使用 reactive-vscode 获取当前活动编辑器
  const editor = useActiveTextEditor();

  // 获取当前选中的内容
  const selection = useTextEditorSelection(editor);

  // 获取文档文本
  const documentText = useDocumentText(() => editor.value?.document);

  // 获取编辑器配置（字体、主题等）
  const getEditorConfig = () => {
    const editorConfig = workspace.getConfiguration('editor');
    const workbenchConfig = workspace.getConfiguration('workbench');

    return {
      fontFamily: editorConfig.get<string>('fontFamily') || 'Consolas, monospace',
      fontSize: editorConfig.get<number>('fontSize') || 14,
      lineHeight: editorConfig.get<number>('lineHeight') || 0,
      fontLigatures: editorConfig.get<boolean>('fontLigatures') || false,
      colorTheme: workbenchConfig.get<string>('colorTheme') || 'Default Dark+',
    };
  };

  // 计算选中的代码信息
  const codeInfo = computed(() => {
    const editorValue = editor.value;
    const selectionValue = selection.value;
    const docText = documentText.value;

    if (!editorValue) {
      return {
        text: '',
        fileName: '',
        languageId: 'plaintext',
        startLine: 0,
        endLine: 0,
      };
    }

    const fileName = editorValue.document.fileName;
    const hasSelection = selectionValue && !selectionValue.isEmpty;

    const languageId = editorValue.document.languageId;

    if (hasSelection) {
      // 有选中的代码
      return {
        text: editorValue.document.getText(selectionValue),
        fileName,
        languageId,
        startLine: selectionValue.start.line + 1,
        endLine: selectionValue.end.line + 1,
      };
    } else {
      // 没有选中代码，获取整个文件
      return {
        text: docText || '',
        fileName,
        languageId,
        startLine: 1,
        endLine: editorValue.document.lineCount,
      };
    }
  });

  // 注册打开 webview 的命令
  useCommand('code-screenshot.openWebview', () => {
    const { text: selectedText, fileName, languageId, startLine, endLine } = codeInfo.value;

    if (currentPanel.value) {
      currentPanel.value.reveal(ViewColumn.Beside);
      // 发送选中的代码到 webview
      if (selectedText) {
        currentPanel.value.webview.postMessage({
          type: 'updateCode',
          data: {
            code: selectedText,
            fileName,
            languageId,
            startLine,
            endLine,
            editorConfig: getEditorConfig(),
          },
        });
      }
      return;
    }

    // 创建并显示 webview
    const panel = window.createWebviewPanel('codeScreenshot', '代码截图', ViewColumn.Beside, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });

    // 设置 panel 图标
    panel.iconPath = Uri.joinPath(ctx.extensionUri, 'public', 'favicon.png');

    currentPanel.value = panel;

    // 设置 webview HTML 内容
    panel.webview.html = getWebviewHtml({
      serverUrl: process.env.VITE_DEV_SERVER_URL,
      webview: panel.webview,
      context: ctx,
    });

    // 处理来自 webview 的消息
    panel.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'ready':
          // webview 加载完成后发送选中的代码
          if (selectedText) {
            panel.webview.postMessage({
              type: 'updateCode',
              data: {
                code: selectedText,
                fileName,
                languageId,
                startLine,
                endLine,
                editorConfig: getEditorConfig(),
              },
            });
          }
          break;
        case 'alert':
          window.showInformationMessage(message.data);
          break;
        case 'showMessage':
          // 显示消息
          const { message: msg, isError } = message.data;
          if (isError) {
            window.showErrorMessage(msg);
          } else {
            window.showInformationMessage(msg);
          }
          break;
        case 'copyImage':
          // 复制图片到剪贴板
          try {
            const { dataUrl, format = 'png', mimeType = 'image/png' } = message.data;
            // 将 base64 转换为 Buffer
            const base64Data = dataUrl.replace(/^data:[^;]+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');

            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);
            const fs = await import('fs');
            const os = await import('os');
            const path = await import('path');

            // 获取文件扩展名
            const extMap: Record<string, string> = {
              svg: 'svg',
              png: 'png',
              jpeg: 'jpg',
              webp: 'webp',
            };
            const ext = extMap[format] || 'png';

            // 创建临时文件
            const tmpFile = path.join(os.tmpdir(), `vscode-screenshot-${Date.now()}.${ext}`);
            fs.writeFileSync(tmpFile, buffer);

            // 根据操作系统复制到剪贴板
            if (process.platform === 'win32') {
              if (format === 'svg') {
                // SVG 作为文本复制
                const svgContent = buffer.toString('utf-8');
                await import('vscode').then((vscode) => {
                  vscode.env.clipboard.writeText(svgContent);
                });
              } else {
                // Windows: 使用 PowerShell 复制图片
                await execAsync(
                  `powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetImage([System.Drawing.Image]::FromFile('${tmpFile}'))"`,
                );
              }
            } else if (process.platform === 'darwin') {
              if (format === 'svg') {
                // SVG 作为文本复制
                const svgContent = buffer.toString('utf-8');
                await import('vscode').then((vscode) => {
                  vscode.env.clipboard.writeText(svgContent);
                });
              } else {
                // macOS: 使用 osascript
                await execAsync(
                  `osascript -e 'set the clipboard to (read (POSIX file "${tmpFile}") as JPEG picture)'`,
                );
              }
            } else {
              // Linux: 使用 xclip
              if (format === 'svg') {
                await execAsync(`xclip -selection clipboard -t text/plain -i "${tmpFile}"`);
              } else {
                await execAsync(`xclip -selection clipboard -t ${mimeType} -i "${tmpFile}"`);
              }
            }

            // 删除临时文件
            fs.unlinkSync(tmpFile);

            window.showInformationMessage('截图已复制到剪贴板');
          } catch (error) {
            window.showErrorMessage(`复制失败: ${error}`);
          }
          break;
        case 'downloadImage':
          // 下载图片
          try {
            const { dataUrl, filename, format = 'png', extension = 'png' } = message.data;
            const base64Data = dataUrl.replace(/^data:[^;]+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');

            // 根据格式设置文件过滤器
            const filterLabels: Record<string, string> = {
              svg: 'SVG Images',
              png: 'PNG Images',
              jpeg: 'JPEG Images',
              webp: 'WebP Images',
            };

            // 显示保存对话框
            const uri = await window.showSaveDialog({
              defaultUri: workspace.workspaceFolders?.[0]?.uri.with({
                path: `${workspace.workspaceFolders?.[0]?.uri.path}/${filename}.${extension}`,
              }),
              filters: {
                [filterLabels[format] || 'Images']: [extension],
              },
              saveLabel: '保存截图',
              title: '保存代码截图',
            });

            if (uri) {
              const fs = await import('fs');
              fs.writeFileSync(uri.fsPath, buffer);
              window.showInformationMessage('截图已保存');
            }
          } catch (error) {
            window.showErrorMessage(`保存失败: ${error}`);
          }
          break;
      }
    });

    // 当 panel 被销毁时，清除引用
    panel.onDidDispose(() => {
      currentPanel.value = null;
    });
  });
});

export { activate, deactivate };
