import { globalIgnores } from 'eslint/config';
import {
  configureVueProject,
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import parserVue from 'vue-eslint-parser';
import prettierConfig from '@vue/eslint-config-prettier';

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
configureVueProject({ scriptLangs: ['ts', 'tsx'] });
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    extends: [...pluginVue.configs['flat/recommended']],
    name: 'app/vue-files',
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
  },
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
    rules: {
      'vue/no-v-html': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    'auto-imports.d.ts',
    'components.d.ts',
  ]),

  vueTsConfigs.recommended,

  prettierConfig,
);
