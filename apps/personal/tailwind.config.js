const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const defaultTheme = require('tailwindcss/defaultTheme');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    join(__dirname, '../../libs/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inconsolata', ...defaultTheme.fontFamily.sans],
      },
      zIndex: {
        cover: 9_998,
        absolute: 9_999,
        'cover-overlays': 1_100, // CDK overlays open at 1 000 z-index
      },
      backgroundImage: {
        'vintage-gradient': 'linear-gradient(to right, #C3A5E6, #F1A1B4)',
      },
      height: {
        dscreen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh'],
      },
      colors: {
        background: '#f7ecda',
        folder: '#fece7b',
        window: {
          light: '#F1EDE6',
          border: '#4e402d',
        },
        primary: {
          yellow: '#FFD25A',
          red: '#F26A6A',
          blue: '#57A4FF',
          orange: '#FFA552',
        },
        secondary: {
          lightYellow: '#FFE3A1',
          lightRed: '#F2B8B8',
          mutedBlue: '#80BFFF',
        },
        accent: {
          green: '#79D16B',
          softPink: '#F8C3C3',
          gray: '#B8B8C3',
        },
      },
      boxShadow: {
        dark: '0 4px 12px rgba(0, 0, 0, 0.6)', // Dark, deep shadow for windows
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '50.01%, 100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
