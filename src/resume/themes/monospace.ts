import type { ThemeTokens } from './tokens';

/** "Monospace" — Geist Mono everywhere. */
export const monospace: ThemeTokens = {
  id: 'monospace',
  label: 'Monospace',
  description: 'Geist Mono everywhere — terminal-clean.',
  colors: {
    bg: '#FFFFFF',
    textPrimary: '#111111',
    textMuted: '#888888',
    accent: '#111111',
    rule: '#EAEAEA',
    chipBg: '#F5F5F5',
    chipText: '#111111',
  },
  fonts: {
    heading: 'Geist Mono',
    body: 'Geist Mono',
    mono: 'Geist Mono',
  },
  spacing: { page: 40, section: 16, block: 9, inline: 5 },
  type: { name: 22, section: 9, body: 8.5, small: 7.5 },
  rules: { weight: 0.5 },
  variant: { allMono: true, tightHeadings: false },
};
