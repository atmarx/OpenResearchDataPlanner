import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  server: {
    port: 4000,
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:4001'
    }
  },
  build: {
    outDir: 'dist',
    // 'hidden' still emits maps to dist for manual debugging but omits the
    // //# sourceMappingURL comment — so browsers don't fetch the multi-MB maps
    // on load (the first-load stall when devtools was open against the deploy),
    // and we don't expose full source publicly.
    sourcemap: 'hidden'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
