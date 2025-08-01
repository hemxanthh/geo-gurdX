import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/geo-gurdX/', // GitHub Pages base path
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lucide-react', 'clsx'],
          supabase: ['@supabase/supabase-js', '@supabase/auth-helpers-react'],
          maps: ['leaflet', 'react-leaflet']
        }
      }
    },
    // Optimize for production
    target: 'es2015',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    port: 4173,
    host: true
  },
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  // Resolve aliases for better imports
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@contexts': '/src/contexts',
      '@lib': '/src/lib',
      '@types': '/src/types'
    }
  }
});
