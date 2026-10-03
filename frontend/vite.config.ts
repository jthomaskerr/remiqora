import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        // REMIQORA_BACKEND_URL points the dev server at a backend on another machine.
        target: process.env.REMIQORA_BACKEND_URL || 'http://127.0.0.1:9000',
        changeOrigin: true,
      },
    },
  },
})
