import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue() /*, vueDevTools()*/],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        host: true, // listen on 0.0.0.0 — required for tunneling tools
        proxy: {
            // Browser hits /api/* → Vite forwards to Laravel container on host:8000.
            // Lets colleagues reach both frontend and API through a single tunnel URL.
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
        },
    },
})
