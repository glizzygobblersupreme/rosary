import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// base './' keeps every asset path relative, so dist/ works from the LAN
// server root and from a sub-path on static hosting alike. The service worker
// only registers on HTTPS/localhost; over plain-http LAN it is simply inert.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Rosary',
        short_name: 'Rosary',
        description: 'Pray and learn the Rosary for each day',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#111111',
        theme_color: '#111111',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // the text is English; other scripts still load on demand if ever needed
        globIgnores: ['**/literata-{cyrillic,greek,vietnamese}*'],
      },
    }),
  ],
  server: { port: 5173, proxy: { '/api': 'http://localhost:5180' } },
  test: { environment: 'node' },
});
