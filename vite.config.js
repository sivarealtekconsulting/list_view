import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  cacheDir: '/tmp/vite-cache',
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/testcomponent/setup.js',
    transformMode: { web: [/\.[jt]sx$/] },
    reporters: ['default', 'html'],
    outputFile: './test-results/index.html',
  },
})
