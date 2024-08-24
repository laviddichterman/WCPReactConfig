import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export const PORT = 3000;


export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    server: {
      port: PORT,
    },
  };
});