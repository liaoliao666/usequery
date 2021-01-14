import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    hmr: process.env.DEV_REMOTE && {
      protocol: 'wss',
    },
  },
})
