const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const defaultTheme = require('tailwindcss/defaultTheme');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
      zIndex: {
        cover: 9_998,
        absolute: 9_999,
        'cover-overlays': 1_100, // CDK overlays open at 1 000 z-index
      },
    },
  },
  plugins: [],
};
