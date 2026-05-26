import type { ThemeTokens } from './tokens';

/** "Linear" — Geist, tight tracking, slightly denser. */
export const linear: ThemeTokens = {
  id: 'linear',
  label: 'Linear',
  description: 'Geist — tight tracking, dense product UI feel.',
  colors: {
    bg: '#FFFFFF',
    textPrimary: '#111111',
    textMuted: '#6F6F6F',
    accent: '#111111',
    rule: '#E5E5E5',
    chipBg: '#FAFAFA',
    chipText: '#111111',
  },
  fonts: {
    heading: 'Geist',
    body: 'Geist',
    mono: 'Geist Mono',
  },
  spacing: { page: 40, section: 16, block: 9, inline: 6 },
  type: { name: 26, section: 9.5, body: 9.5, small: 8 },
  rules: { weight: 0.5 },
  variant: { allMono: false, tightHeadings: true },
};
