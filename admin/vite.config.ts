import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@ds": path.resolve(__dirname, "../desgin_system"),
    },
  },
  server: {
    port: 5173,
    host: "127.0.0.1",
    strictPort: false,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    target: "es2022",
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png"],
      manifest: {
        name: "easysite 어드민",
        short_name: "easysite",
        lang: "ko-KR",
        theme_color: "#4F46E5",
        background_color: "#FFFFFF",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/,
            handler: "NetworkFirst",
            options: { cacheName: "firestore" },
          },
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "storage",
              expiration: { maxAgeSeconds: 7 * 24 * 3600 },
            },
          },
        ],
      },
    }),
  ],
});
