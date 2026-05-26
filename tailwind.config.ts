import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: '#FAFAFA',
        border: '#EAEAEA',
        ink: '#111111',
        muted: '#888888',
        // résumé canvas tokens (driven by CSS variables)
        theme: {
          bg: 'var(--theme-bg)',
          text: 'var(--theme-text-primary)',
          muted: 'var(--theme-text-muted)',
          accent: 'var(--theme-accent)',
          rule: 'var(--theme-rule)',
          chip: 'var(--theme-chip-bg)',
          'chip-text': 'var(--theme-chip-text)',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
        'theme-heading': ['var(--theme-font-heading)', 'sans-serif'],
        'theme-body': ['var(--theme-font-body)', 'sans-serif'],
        'theme-mono': ['var(--theme-font-mono)', 'monospace'],
      },
      boxShadow: {
        cmd: '0 0 0 1px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
        pdf: '0 0 0 1px rgba(0,0,0,0.05), 0 20px 40px -10px rgba(0,0,0,0.1)',
      },
      letterSpacing: {
        crisp: '-0.01em',
        tight: '-0.02em',
      },
    },
  },
  plugins: [],
};

export default config;
