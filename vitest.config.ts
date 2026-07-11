import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // ------------------------------------------------------------
    // Test Discovery
    // ------------------------------------------------------------

    include: [
      'tests/**/*.test.ts',
      'tests/**/*.spec.ts',
      'src/**/*.test.ts',
      'src/**/*.spec.ts'
    ],

    exclude: [
      'node_modules',
      'dist',
      'coverage'
    ],

    // ------------------------------------------------------------
    // Environment
    // ------------------------------------------------------------

    environment: 'node',

    globals: true,

    // ------------------------------------------------------------
    // Coverage
    // ------------------------------------------------------------

    coverage: {
      enabled: false,

      provider: 'v8',

      reporter: [
        'text',
        'html'
      ],

      reportsDirectory: './coverage',

      include: [
        'src/**/*.ts'
      ],

      exclude: [
        'src/**/*.d.ts'
      ]
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

    mockReset: true
  }
});