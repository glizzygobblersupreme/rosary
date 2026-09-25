import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Hosted on GitHub Pages at https://glizzygobblersupreme.github.io/rosary/
// (change BASE if the repo is renamed or a custom domain is used). The service
// worker precaches everything, so after the first visit the app opens and runs
// without the network; a new version is picked up on a later visit.
const BASE = '/rosary/';

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      // A new version waits until you choose to update (a line on the start
      // screen), so nothing ever reloads under you mid-prayer.
      registerType: 'prompt',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        id: BASE,
        start_url: BASE,
        scope: BASE,
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
  test: { environment: 'node' },
});
