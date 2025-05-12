import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss()],

  /** For live updates */
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    }
  }
})
