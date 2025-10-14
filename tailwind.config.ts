import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fira Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Saira', 'Fira Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Mono', 'ui-monospace', 'SFMono-Regular', 'SF Mono', 'monospace'],
      },
    },
  },
} satisfies Config
