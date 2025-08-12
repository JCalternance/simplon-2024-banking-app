import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
            manifest: {
                name: 'Banking App PWA',
                short_name: 'BankingApp',
                start_url: '/',
                display: 'standalone',
                description: 'A simple PWA banking application built with React and Vite.',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                icons: [
                    {
                        src: '/android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/maskable_icon.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    }
                ]
            },
            workbox: {
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                skipWaiting: true,
                offlineGoogleAnalytics: true,
                runtimeCaching: [
                    {
                        urlPattern: ({ request }) =>
                            request.destination === 'document' ||
                            request.destination === 'script' ||
                            request.destination === 'style' ||
                            request.destination === 'image' ||
                            request.destination === 'font',
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'app-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
                            },
                        },
                    },
                ],
                navigateFallback: '/offline.html',
            },
        })
    ],
})
