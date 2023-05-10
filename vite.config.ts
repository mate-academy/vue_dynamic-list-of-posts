import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/vue_dynamic-list-of-posts",
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "./index.html",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, "./src/components"),
      api: path.resolve(__dirname, "./src/api"),
      utils: path.resolve(__dirname, "./src/utils"),
      routes: path.resolve(__dirname, "./src/routes"),
      shared: path.resolve(__dirname, "./src/shared"),
    },
  },
});
