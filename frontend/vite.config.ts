import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      'process.env.REACT_APP_API_BASE_URL': JSON.stringify(env.REACT_APP_API_BASE_URL),
    },
    plugins: [react()],
    server: {
      port: 8081 // Specify your desired port here
    },
    preview: {
      port: 8081 // Specify your desired port here
    }
  }
})
