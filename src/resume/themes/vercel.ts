import type { ThemeTokens } from './tokens';

/** "Vercel" — Inter, generous whitespace, strict black/white. */
export const vercel: ThemeTokens = {
  id: 'vercel',
  label: 'Vercel',
  description: 'Inter — generous whitespace, strict black & white.',
  colors: {
    bg: '#FFFFFF',
    textPrimary: '#111111',
    textMuted: '#888888',
    accent: '#111111',
    rule: '#EAEAEA',
    chipBg: '#FAFAFA',
    chipText: '#111111',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
    mono: 'Geist Mono',
  },
  spacing: { page: 44, section: 18, block: 10, inline: 6 },
  type: { name: 26, section: 9.5, body: 9.5, small: 8 },
  rules: { weight: 0.5 },
  variant: { allMono: false, tightHeadings: false },
};
