import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import tailwindcss from '@tailwindcss/vite';
import vscode from '@tomjs/vite-plugin-vscode';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag: string) => tag.startsWith('vscode-'),
        },
      },
    }),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
    }),
    Components(),
    tailwindcss(),
    vscode(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
