import { defineConfig } from 'vite';
import dotenv from 'dotenv';

export default defineConfig(() => {
    dotenv.config();
    return {
        define: {
            __APP_ENV__: process.env.VITE_VERCEL_ENV,
            __BACKEND_URL__: process.env.BACKEND_URL,
        },
    };
});