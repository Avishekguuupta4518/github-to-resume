import type { ThemeTokens } from '@/resume/themes';
import { formatSectionTitle } from '@/resume/themes';
import { cn } from '@/lib/format';

export function SectionHeading({
  theme,
  label,
  className,
}: {
  theme: ThemeTokens;
  label: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        'text-[10.5px] font-semibold uppercase tracking-[0.16em]',
        className,
      )}
      style={{
        color: 'var(--theme-text-primary)',
        fontFamily: 'var(--theme-font-heading)',
      }}
    >
      {formatSectionTitle(theme, label)}
    </h2>
  );
}
