import { defineConfig } from 'vitest/config';

export default defineConfig( {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: [ '**/*.{test,spec}.{ts,tsx,js,jsx}' ],
  },
} );

