import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  base: "/vue_dynamic-list-of-posts/",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
