import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Builder.io compatible server configuration
    host: '::',  // IPv6 - allows both IPv4 and IPv6 connections
    port: 8080,  // Builder.io default port
    // Completely disable auto-open to prevent xdg-open errors
    open: false
  },
  build: {
    // Builder.io expects output in dist/spa
    outDir: 'dist',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'radix-vendor': ['@radix-ui/react-select', '@radix-ui/react-slot', '@radix-ui/react-tabs'],
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority']
        }
      }
    },
    // Optimize assets
    assetsInlineLimit: 4096,
    // Source maps for debugging (disable in production)
    sourcemap: false,
    // Use default minification (esbuild)
    minify: 'esbuild'
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})