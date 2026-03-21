import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Tether — Mood Tracker',
        short_name: 'Tether',
        description: 'Track how you feel, day by day',
        theme_color: '#7c3aed',
        background_color: '#f9fafb',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/Tether/',
        start_url: '/Tether/',
        icons: [
          {
            src: '/Tether/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/Tether/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fndrmvayxsegjgfataop\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
    }),
  ],
  base: '/Tether/',
})
