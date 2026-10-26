import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    // The bundled Psalms text is ~1 MB on its own; keep it in a separate,
    // long-cacheable chunk so app updates don't re-download scripture.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('psalms.json')) return 'psalms';
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  }
});
