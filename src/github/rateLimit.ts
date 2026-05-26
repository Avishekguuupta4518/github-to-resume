import type { RateLimit } from '@/resume/types';

export function formatResetTime(rl: RateLimit | undefined): string {
  if (!rl) return '';
  try {
    const d = new Date(rl.resetAt);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function rateLimitPercent(rl: RateLimit | undefined): number {
  if (!rl || rl.limit === 0) return 0;
  return Math.round((rl.remaining / rl.limit) * 100);
}
