import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        surface: '#FFFFFF',
        'surface-2': '#F1F5F9',
        border: '#E2E8F0',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-tertiary': '#94A3B8',
        accent: '#2563EB',
        'accent-hover': '#1D4ED8',
        'accent-light': '#EFF6FF',
        'accent-glow': 'rgba(37, 99, 235, 0.15)',
        success: '#16A34A',
        'success-light': '#F0FDF4',
        warning: '#D97706',
        'warning-light': '#FFFBEB',
        danger: '#DC2626',
        'danger-light': '#FEF2F2',
        brand: '#2563EB',
        'brand-light': '#1D4ED8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,23,42,0.03), 0 4px 14px rgba(15,23,42,0.04)',
        'card-hover': '0 4px 12px rgba(37,99,235,0.06), 0 12px 28px rgba(15,23,42,0.08)',
        'premium': '0 2px 6px rgba(15,23,42,0.04), 0 10px 20px rgba(15,23,42,0.06)',
        'premium-lg': '0 8px 16px rgba(15,23,42,0.06), 0 20px 40px rgba(15,23,42,0.1)',
        'glow-accent': '0 0 25px rgba(37,99,235,0.25)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.1)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
