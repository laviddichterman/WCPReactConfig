import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

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
    plugins: [react()],
    server: {
      port: PORT,
    },
  };
});