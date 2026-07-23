import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'apps/web/src'),
    },
  },
  test: {
    // ------------------------------------------------------------
    // Test Discovery
    // ------------------------------------------------------------

    include: [
      'tests/**/*.test.ts',
      'tests/**/*.spec.ts',
      'src/**/*.test.ts',
      'src/**/*.spec.ts',
      'apps/**/*.test.ts',
      'apps/**/*.spec.ts',
      'apps/**/*.test.tsx',
      'apps/**/*.spec.tsx',
    ],

    exclude: ['node_modules', 'dist', 'coverage'],

    // ------------------------------------------------------------
    // Environment
    // ------------------------------------------------------------

    environment: 'node',

    environmentMatchGlobs: [['apps/web/**', 'jsdom']],

    setupFiles: ['apps/web/src/presentation/testing/vitest.setup.ts'],

    globals: true,

    // ------------------------------------------------------------
    // Coverage
    // ------------------------------------------------------------

    coverage: {
      enabled: false,

      provider: 'v8',

      reporter: ['text', 'html'],

      reportsDirectory: './coverage',

      include: ['src/**/*.ts'],

      exclude: ['src/**/*.d.ts'],
    },

    // ------------------------------------------------------------
    // Watch
    // ------------------------------------------------------------

    watch: false,

    // ------------------------------------------------------------
    // Timeouts
    // ------------------------------------------------------------

    testTimeout: 10000,

    hookTimeout: 10000,

    // ------------------------------------------------------------
    // Clear Mocks
    // ------------------------------------------------------------

    clearMocks: true,

    restoreMocks: true,

    mockReset: true,
  },
});
