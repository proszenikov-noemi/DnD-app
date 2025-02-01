import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // 🔹 Biztosítja, hogy a helyes útvonalak legyenek beállítva
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
});
