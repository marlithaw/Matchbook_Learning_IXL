import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static, backend-free family site. Set `base` if deploying under a sub-path.
export default defineConfig({
  plugins: [react()],
  base: './',
})
