import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const repoName = 'vue_dynamic-list-of-posts';

export default defineConfig({
  plugins: [vue()],
  base: `/${repoName}/`,
});
