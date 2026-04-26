import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'script-defer',
      strategies: 'generateSW',
      manifest: false,
      workbox: {
        skipWaiting: false,
        clientsClaim: true,
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,woff2}',
          'manifest.json',
          'splash/**/*.jpg',
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
})
