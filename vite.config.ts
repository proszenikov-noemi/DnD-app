import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // 🔹 FONTOS! A Vercel helyes útvonalkezeléséhez kell
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
});
