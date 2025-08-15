// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './src/__test__/setup.ts',
    globals: true,
    css: true,
    testTimeout: 15000,
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});

