import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '/vue_dynamic-list-of-posts/',
  plugins: [vue()],
});