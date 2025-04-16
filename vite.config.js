import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/vue_dynamic-list-of-posts/', // правильний базовий шлях для GitHub Pages
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // налаштування псевдоніму для шляху
    },
  },
})
