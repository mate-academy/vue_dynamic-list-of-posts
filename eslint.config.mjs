import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    plugins: ['vue'],
    extends: ['js/recommended', 'plugin:vue/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: { globals: globals.browser },
    rules: {
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['Sidebar', 'Loader', 'Login'],
        },
      ],
      'max-len': [
        'error',
        {
          code: 85,
          ignoreComments: true, // ігнорувати довгі коментарі
          ignoreStrings: true, // ігнорувати довгі рядки у лапках
          ignoreUrls: true, // ігнорувати довгі URL
        },
      ],
      semi: ['error', 'always'],
    },
  },

  pluginVue.configs['flat/essential'],
]);
