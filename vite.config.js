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
        // New deploys activate immediately so users (especially installed PWA / mobile) pick up
        // fresh JS/CSS instead of staying on an old precached bundle until all tabs are closed.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,woff2,jpg,jpeg,webp}',
          'manifest.json',
          'splash/**/*.jpg',
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            /* Same-origin images are already precached (public + build assets); intercepting them
             * with SWR can cause rare blank tiles on mobile after revalidate or long sessions. */
            urlPattern: ({ request, url }) =>
              request.destination === "image" &&
              url.origin !== self.location.origin,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "mdrs-images",
              expiration: { maxEntries: 96, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
