import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
  ? '/vue_dynamic-list-of-posts/'
  : '/',

  plugins: [
    vue(),
  ],
})
