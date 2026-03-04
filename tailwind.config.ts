import type { Config } from 'tailwindcss'
import { siteConfig } from './site.config'

export default {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: siteConfig.fonts.sans,
        heading: siteConfig.fonts.heading,
        mono: siteConfig.fonts.mono,
      },
    },
  },
} satisfies Config
