import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['var(--inter-font)'],
      },
      colors: {
        primary_black: '#2e2c2c',
      },
    },
  },
  plugins: [],
};
export default config;
