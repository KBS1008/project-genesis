import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Ignore generated files
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      'apps/api/dist/**',
      'apps/web/.next/**',
      'apps/web/next-env.d.ts',
    ],
  },

  // Base JavaScript rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.node,
      },

      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      /* =====================================================
       * Code Quality
       * ===================================================== */

      'no-console': 'warn',

      'no-debugger': 'error',

      eqeqeq: ['error', 'always'],

      curly: ['error', 'all'],

      /* =====================================================
       * Variables
       * ===================================================== */

      'no-var': 'error',

      'prefer-const': ['error', { ignoreReadBeforeAssign: true }],

      /* =====================================================
       * Imports
       * ===================================================== */

      'no-duplicate-imports': 'error',

      /* =====================================================
       * TypeScript
       * ===================================================== */

      '@typescript-eslint/no-explicit-any': 'error',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],

      '@typescript-eslint/no-floating-promises': 'error',

      '@typescript-eslint/no-misused-promises': 'error',

      /* =====================================================
       * Style
       * ===================================================== */

      'object-shorthand': 'error',

      'prefer-template': 'error',
    },
  },

  // Let Prettier handle formatting
  eslintConfigPrettier,
];
