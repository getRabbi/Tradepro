import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff', 100: '#d9e5ff', 200: '#bcd2ff', 300: '#8eb4ff',
          400: '#5989ff', 500: '#3361ff', 600: '#1b3cf5', 700: '#142ae1',
          800: '#1724b6', 900: '#19248f', 950: '#111757',
        },
        accent: {
          cyan: '#00d4ff', blue: '#3361ff', purple: '#7c3aed',
          green: '#10b981', red: '#ef4444', orange: '#f59e0b',
        },
        surface: {
          900: '#0a0e1a', 800: '#0f1423', 700: '#151b2e',
          600: '#1c2438', 500: '#242d44', 400: '#2e3a52', 300: '#3d4b66',
        },
        text: {
          primary: '#f1f5f9', secondary: '#94a3b8', muted: '#64748b',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(51, 97, 255, 0.15), transparent)',
        'grid-pattern': 'linear-gradient(rgba(51, 97, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(51, 97, 255, 0.03) 1px, transparent 1px)',
      },
      backgroundSize: { 'grid': '60px 60px' },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'ticker': 'ticker 40s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        ticker: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(51, 97, 255, 0.15)',
        'glow-md': '0 0 30px rgba(51, 97, 255, 0.2)',
        'glow-lg': '0 0 60px rgba(51, 97, 255, 0.25)',
        'card': '0 4px 30px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config
