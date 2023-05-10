import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // alias: {
    //   components: path.resolve(__dirname, "./src/components"),
    //   api: path.resolve(__dirname, "./src/api"),
    //   utils: path.resolve(__dirname, "./src/utils"),
    //   routes: path.resolve(__dirname, "./src/routes"),
    //   shared: path.resolve(__dirname, "./src/shared"),
    // },
  },
  base: "/react_dynamic-lists-of-posts-v1/",
});
