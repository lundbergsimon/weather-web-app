import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  /** For live updates */
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    }
  }
})
