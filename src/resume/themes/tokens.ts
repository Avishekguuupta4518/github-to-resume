export type ThemeId = 'vercel' | 'linear' | 'monospace';

export interface ThemeTokens {
  id: ThemeId;
  label: string;
  description: string;
  colors: {
    bg: string;
    textPrimary: string;
    textMuted: string;
    accent: string;
    rule: string;
    chipBg: string;
    chipText: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  /** PDF-only spacing scale (points). 1pt = 1/72 inch. */
  spacing: {
    page: number;
    section: number;
    block: number;
    inline: number;
  };
  /** PDF type scale (points). */
  type: {
    name: number;
    section: number;
    body: number;
    small: number;
  };
  rules: { weight: number };
  variant: {
    /** Mono fonts everywhere (monospace theme). */
    allMono: boolean;
    /** Tighter heading tracking (linear). */
    tightHeadings: boolean;
  };
}
