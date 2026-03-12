import js from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['**/._*', '**/.next/**', '**/node_modules/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextVitals,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  }
];
