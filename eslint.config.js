import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs["flat/recommended"],

  {
    rules: {
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
    },
  },

  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },

  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
