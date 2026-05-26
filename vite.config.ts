import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    // @react-pdf/renderer expects a Node `process.env.NODE_ENV` and a global `Buffer`.
    // Vite already provides import.meta.env equivalents, but the runtime guards
    // inside react-pdf's font/image pipelines reference these directly.
    global: 'globalThis',
  },
  base: process.env.VITE_BASE ?? '/',
  optimizeDeps: {
    include: ['buffer'],
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query', 'graphql-request', 'graphql'],
        },
      },
    },
  },
});
