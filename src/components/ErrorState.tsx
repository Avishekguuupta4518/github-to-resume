import { AlertCircle, Github, RefreshCw, Key, Home } from 'lucide-react';
import type { ResumeErrorKind } from '@/github/client';
import { Link } from 'react-router-dom';

interface Props {
  kind: ResumeErrorKind;
  message: string;
  username?: string;
  onRetry?: () => void;
  onOpenToken?: () => void;
}

export function ErrorState({
  kind,
  message,
  username,
  onRetry,
  onOpenToken,
}: Props) {
  const title = TITLES[kind];

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-white p-8 text-center shadow-lg transition">

       {/* ICON  */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-600">
        <AlertCircle className="h-5 w-5" />
      </div>

      {/* TITLE */}
      <h2 className="text-lg font-semibold tracking-tight text-ink">
        {title}
      </h2>

      {/* MESSAGE */}
      <p className="text-sm leading-relaxed text-muted">
        {message}
      </p>

      {/* GITHUB LINK */}
      {kind === 'user-not-found' && username && (
        <a
          href={`https://github.com/${encodeURIComponent(username)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink underline-offset-2 transition hover:underline hover:opacity-80"
        >
          <Github className="h-3.5 w-3.5" />
          View on GitHub
        </a>
      )}

      {/* ACTIONS */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-sm text-ink transition hover:-translate-y-0.5 hover:bg-surface hover:shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        )}

        {(kind === 'rate-limited' || kind === 'unauthorized') && onOpenToken && (
          <button
            onClick={onOpenToken}
            className="inline-flex items-center gap-1.5 rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-black hover:shadow-md"
          >
            <Key className="h-3.5 w-3.5" />
            Add token
          </button>
        )}

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-sm text-ink transition hover:-translate-y-0.5 hover:bg-surface hover:shadow-sm"
        >
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
      </div>
    </div>
  );
}

const TITLES: Record<ResumeErrorKind, string> = {
  'user-not-found': 'User not found',
  unauthorized: 'Token rejected',
  'rate-limited': 'Rate limit exceeded',
  network: 'Network error',
  unknown: 'Something went wrong',
};