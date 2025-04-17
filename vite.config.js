import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/front_5th_chapter2-1/' : '/',
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.advanced.html'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
});
