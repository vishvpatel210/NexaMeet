import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.join(__dirname, 'src/renderer'),
  publicDir: path.join(__dirname, 'public'),
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared')
    }
  },
  build: {
    outDir: path.join(__dirname, 'dist/renderer'),
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
});
