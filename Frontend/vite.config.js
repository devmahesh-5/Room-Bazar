import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: [
      '@mapbox/node-pre-gyp',
      'aws-sdk', 
      'mock-aws-s3',
      'nock',
      'bcrypt'
    ]
  },
  ssr: {
    noExternal: ['@mapbox/node-pre-gyp'], // Prevents SSR bundling issues
  },
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 1000
    },
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  cacheDir: './.vite'
})

