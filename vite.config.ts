import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export const PORT = 3000;

export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // 'wcp': ["@wcp/wario-ux-shared", "@wcp/wcpshared"],
          }
        }
      },
      outDir: 'build',
    },
    plugins: [react(),
    checker({
      typescript: true, // Enable TypeScript checking
      // Add other checkers if needed, e.g., eslint: true
    }),
    ],
    server: {
      port: PORT,
    },
  };
});