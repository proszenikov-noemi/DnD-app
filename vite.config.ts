import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ez fontos a Vercel helyes működéséhez
  build: {
    outDir: 'dist'
  }
});
