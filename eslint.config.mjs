// eslint.config.mjs

import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import parserTs from "@typescript-eslint/parser";
import pluginTs from "@typescript-eslint/eslint-plugin";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default [
  // 1. Рекомендовані правила для JavaScript
  pluginJs.configs.recommended,

  // 2. Рекомендовані правила для Vue (Vue 3 + Flat Config)
  ...pluginVue.configs['flat/recommended'],

  // 3. Правила для TypeScript
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...pluginTs.configs["eslint-recommended"].rules,
      ...pluginTs.configs.recommended.rules,

      // Власні правила TS
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // 4. Додаткові правила для .vue файлів
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: parserTs, // для <script lang="ts">
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        defineProps: "readonly",
        defineEmits: "readonly",
        defineExpose: "readonly",
        withDefaults: "readonly",
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },

  // 5. Загальні правила, включаючи Prettier
  {
    files: ["src/**/*.{js,ts,vue}"],
    languageOptions: { // <--- ДОДАЙТЕ ЦЕЙ БЛОК
      globals: {
        ...globals.browser, // <--- Ось де це потрібно для ваших JS утиліт!
      },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
  },

  // 6. Вимкнення конфліктуючих правил ESLint з Prettier
  configPrettier,

  // 7. Ігноровані файли
  {
    ignores: ["node_modules/", "dist/", ".env", ".env.*"],
  },
];