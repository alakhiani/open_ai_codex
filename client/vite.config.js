import { defineConfig } from 'vite';

export default defineConfig(() => {
    return {
        define: {
            __APP_ENV__: process.env.VITE_VERCEL_ENV,
            __BACKEND_URL__: process.env.VITE_VERCEL_BACKEND_URL,
        },
    };
});