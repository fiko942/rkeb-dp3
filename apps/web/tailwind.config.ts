import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        excel: {
          dark: '#0f3d2e',
          primary: '#107c41',
          soft: '#3ba776',
          mint: '#d9f2e4',
          neutral: '#f5f7f6'
        }
      }
    }
  },
  plugins: [forms]
};

export default config;
