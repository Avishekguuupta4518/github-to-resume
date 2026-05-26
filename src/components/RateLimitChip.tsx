import type { RateLimit } from '@/resume/types';
import { formatResetTime, rateLimitPercent } from '@/github/rateLimit';
import { cn } from '@/lib/format';

interface Props {
  rateLimit: RateLimit | undefined;
}

export function RateLimitChip({ rateLimit }: Props) {
  if (!rateLimit) return null;

  const pct = rateLimitPercent(rateLimit);
  const reset = formatResetTime(rateLimit);

  const tone =
    pct < 10
      ? 'text-red-600 border-red-200 bg-red-50'
      : pct < 30
        ? 'text-amber-700 border-amber-200 bg-amber-50'
        : 'text-emerald-700 border-emerald-200 bg-emerald-50';

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        `
        hidden lg:inline-flex
        items-center gap-2
        rounded-full border
        px-3 py-1
        font-mono text-[10.5px] tabular-nums
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md
        `,
        tone
      )}
      title={`${rateLimit.remaining} of ${rateLimit.limit} GraphQL requests remaining`}
    >
      {/* Left indicator dot */}
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          pct < 10 ? 'bg-red-600' : pct < 30 ? 'bg-amber-600' : 'bg-emerald-600'
        )}
      />

      <span className="font-semibold">
        {rateLimit.remaining}/{rateLimit.limit}
      </span>

      {reset && <span className="opacity-70">· {reset}</span>}
    </div>
  );
}