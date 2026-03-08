/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import tailwindcss from '@tailwindcss/vite'

// Tauri expects a fixed port; detect via env var set by `tauri dev`
const isTauri = !!process.env.TAURI_ENV_PLATFORM

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Ensure WASM files are served correctly
  assetsInclude: ['**/*.wasm'],
  // Tauri dev server configuration
  clearScreen: !isTauri,
  server: {
    // Use port 1420 for Tauri, default for regular web dev
    port: isTauri ? 1420 : undefined,
    strictPort: isTauri,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
