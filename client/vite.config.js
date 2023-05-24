import { defineConfig } from 'vite';

export default defineConfig({
    define: {
        'process.env': {
            '__LOCAL_BACKEND_URL__': "http://localhost:5174",
            '__BACKEND_URL__': process.env.NEXT_PUBLIC_BACKEND_URL,
        }
    }
});