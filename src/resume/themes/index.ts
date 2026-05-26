import type { CSSProperties } from 'react';
import type { ThemeId, ThemeTokens } from './tokens';
import { vercel } from './vercel';
import { linear } from './linear';
import { monospace } from './monospace';

export const themes: Record<ThemeId, ThemeTokens> = {
  vercel,
  linear,
  monospace,
};

export const themeList: ThemeTokens[] = [vercel, linear, monospace];

export function cssVarsFor(theme: ThemeTokens): CSSProperties {
  return {
    ['--theme-bg' as string]: theme.colors.bg,
    ['--theme-text-primary' as string]: theme.colors.textPrimary,
    ['--theme-text-muted' as string]: theme.colors.textMuted,
    ['--theme-accent' as string]: theme.colors.accent,
    ['--theme-rule' as string]: theme.colors.rule,
    ['--theme-chip-bg' as string]: theme.colors.chipBg,
    ['--theme-chip-text' as string]: theme.colors.chipText,
    ['--theme-font-heading' as string]: `'${theme.fonts.heading}'`,
    ['--theme-font-body' as string]: `'${theme.fonts.body}'`,
    ['--theme-font-mono' as string]: `'${theme.fonts.mono}'`,
  };
}

/** Section labels are uppercase across all current themes. */
export function formatSectionTitle(_theme: ThemeTokens, label: string): string {
  return label.toUpperCase();
}

export type { ThemeId, ThemeTokens } from './tokens';
