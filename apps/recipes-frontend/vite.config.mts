/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/recipes-frontend',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Recipes',
        short_name: 'Recipes',
        description: 'Recepthantering och inköpslistor',
        theme_color: '#0D1117',
        background_color: '#0D1117',
        display: 'standalone',
        icons: [
          { src: "/icon-48x48.png",  sizes: "48x48",   type: "image/png" },
          { src: "/icon-96x96.png",  sizes: "96x96",   type: "image/png" },
          { src: "/icon-192x192.png",sizes: "192x192", type: "image/png", purpose: "any maskable" },
          { src: "/icon-512x512.png",sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache' },
          },
        ],
      },
    }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
