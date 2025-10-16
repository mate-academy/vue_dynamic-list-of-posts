import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// ✅ Configuração padrão para projetos Vue da Mate Academy
export default defineConfig({
  plugins: [vue()],
  server: {
    port: Number(process.env.VITE_PORT) || 5173,
    open: true, // abre o navegador automaticamente
  },
  build: {
    outDir: 'dist',
  },
});
