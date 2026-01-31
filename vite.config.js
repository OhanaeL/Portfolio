import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  root: 'static',
  build: {
    outDir: resolve(__dirname, 'static/dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'static/js/main.js')
      },
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    minify: 'terser',
    sourcemap: false
  },
  server: {
    port: 5173,
    proxy: {
      '/': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
};
