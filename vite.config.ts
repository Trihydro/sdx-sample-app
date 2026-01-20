import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
  define: {
    'process.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY),
    'process.env.VITE_URL': JSON.stringify(process.env.VITE_URL),
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
