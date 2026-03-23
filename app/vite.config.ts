/// <reference types="vitest" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import tailwindcss from '@tailwindcss/vite'

// Read the single-source-of-truth version from the workspace Cargo.toml.
// The line looks like: version = "0.1.3"
const cargoToml = readFileSync(resolve(import.meta.dirname!, '..', 'Cargo.toml'), 'utf-8')
const versionMatch = cargoToml.match(/\[workspace\.package\][^[]*version\s*=\s*"([^"]+)"/)
if (!versionMatch) throw new Error('Could not read version from workspace Cargo.toml')
const workspaceVersion = versionMatch[1]

// Tauri expects a fixed port; detect via env var set by `tauri dev`
const isTauri = !!process.env.TAURI_ENV_PLATFORM

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(workspaceVersion),
  },
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
