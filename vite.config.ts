import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

const PORT = 3000;

export default defineConfig({
  plugins: [
    react(),
    // checker({
    //   typescript: true,
    //   overlay: {
    //     position: 'tl',
    //     initialIsOpen: false,
    //   },
    // }),
  ],
  define: {
    // Exposes the package version as a global constant __APP_VERSION__
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    // You can add other package.json fields here as needed
    // __APP_NAME__: JSON.stringify(process.env.npm_package_name),
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },
  build: { target: 'es2022' },
  optimizeDeps: { esbuildOptions: { target: 'es2022' } },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'src': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
});