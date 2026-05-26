import { clsx as clsxBase } from 'clsx';
import type { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsxBase(inputs);
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

export function relativeTime(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const days = Math.round(diffMs / 86_400_000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.round(days / 30)}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat().format(n);
}

export function compactNumber(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, '')}k`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
}
