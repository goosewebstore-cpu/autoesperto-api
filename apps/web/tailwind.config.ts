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
        background: '#F8F9FA',
        surface: '#FFFFFF',
        'surface-2': '#F1F3F5',
        border: '#E9ECEF',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        'text-tertiary': '#9CA3AF',
        accent: '#2563EB',
        'accent-hover': '#1D4ED8',
        'accent-light': '#EFF6FF',
        success: '#22C55E',
        'success-light': '#F0FDF4',
        warning: '#F59E0B',
        'warning-light': '#FFFBEB',
        danger: '#EF4444',
        'danger-light': '#FEF2F2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.04)',
        'card-hover': '0 1px 3px rgba(0,0,0,0.04), 0 20px 40px rgba(0,0,0,0.08)',
        'premium': '0 4px 6px -1px rgba(37,99,235,0.1), 0 12px 24px -4px rgba(37,99,235,0.15)',
        'premium-lg': '0 8px 16px -4px rgba(37,99,235,0.12), 0 24px 48px -8px rgba(37,99,235,0.2)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.1)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
