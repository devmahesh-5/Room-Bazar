import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
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
      noExternal: ['@mapbox/node-pre-gyp'],
    },
    plugins: [react()],
    server: {
      watch: {
        usePolling: true,
        interval: 1000
      },
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:5000',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
      }
    },
    cacheDir: './.vite'
  }
})
