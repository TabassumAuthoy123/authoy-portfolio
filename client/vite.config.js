import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting — separate vendor chunks
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          editor: ['react-quill-new'],
          icons: ['react-icons'],
        },
      },
    },
    // Minification and tree-shaking
    minify: 'esbuild',
    target: 'es2020',
    cssMinify: true,
    // Source maps for debugging (disable in production if sensitive)
    sourcemap: false,
    // Chunk size warning threshold
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
