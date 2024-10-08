import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss"
// https://vitejs.dev/config/
const liveUrl = 'http://ec2-18-194-232-215.eu-central-1.compute.amazonaws.com:9000/api/';
const localUrl = 'http://localhost:9000/api/'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: liveUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    host: 'localhost',
    port: 3000,
    "cors": { allowedHeaders: "*" },
  },
})