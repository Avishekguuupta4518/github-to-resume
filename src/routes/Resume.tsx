import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, KeyRound, Github } from 'lucide-react';
import { fetchResume, ResumeError } from '@/github/client';
import { useTokenStore } from '@/store/tokenStore';
import { usePrefsStore } from '@/store/prefsStore';
import { themes } from '@/resume/themes';
import type { ResumeData, RateLimit } from '@/resume/types';
import { ResumePreview } from '@/components/ResumePreview';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ExportBar } from '@/components/ExportBar';
import { RateLimitChip } from '@/components/RateLimitChip';
import { ErrorState } from '@/components/ErrorState';
import { TokenDialog } from '@/components/TokenDialog';

export default function ResumeRoute() {
  const { username = '' } = useParams<{ username: string }>();
  const { token } = useTokenStore();
  const { theme: themeId, pushRecent } = usePrefsStore();
  const theme = themes[themeId];
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);

  const envToken = import.meta.env.VITE_GITHUB_TOKEN ?? null;
  const effectiveToken = envToken && envToken.length > 0 ? envToken : token;

  const query = useQuery({
    queryKey: ['resume', username.toLowerCase(), Boolean(effectiveToken)],
    queryFn: () => fetchResume(username, effectiveToken),
    enabled: username.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: (count, err) => {
      if (err instanceof ResumeError) {
        if (err.kind === 'user-not-found' || err.kind === 'unauthorized') return false;
      }
      return count < 1;
    },
  });

  useEffect(() => {
    if (query.data) pushRecent(username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  const data: ResumeData | null = query.data?.data ?? null;
  const rateLimit: RateLimit | undefined = query.data?.rateLimit;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopBar
        username={username}
        avatarUrl={data?.profile.avatarUrl}
        rateLimit={rateLimit}
        data={data}
        onOpenToken={() => setTokenDialogOpen(true)}
      />

      <main className="flex-1 px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        {query.isError && query.error instanceof ResumeError ? (
          <ErrorState
            kind={query.error.kind}
            message={query.error.message}
            username={username}
            onRetry={() => query.refetch()}
            onOpenToken={() => setTokenDialogOpen(true)}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mx-auto max-w-[820px]"
          >
            <ResumePreview
              data={data}
              theme={theme}
              loading={query.isLoading || query.isFetching}
            />
          </motion.div>
        )}

        {!effectiveToken && (
          <div className="no-print mx-auto mt-6 max-w-md rounded-md border border-border bg-white px-3.5 py-2.5 text-center font-mono text-[11px] uppercase tracking-widest text-muted">
            <span className="font-semibold text-ink">TIP ·</span> ANONYMOUS LIMIT 60/HR ·{' '}
            <button
              onClick={() => setTokenDialogOpen(true)}
              className="text-ink underline-offset-2 hover:underline"
            >
              ADD TOKEN
            </button>
          </div>
        )}
      </main>

      <TokenDialog open={tokenDialogOpen} onClose={() => setTokenDialogOpen(false)} />
    </div>
  );
}

interface TopBarProps {
  username: string;
  avatarUrl?: string;
  rateLimit?: RateLimit;
  data: ResumeData | null;
  onOpenToken: () => void;
}

function TopBar({ username, avatarUrl, rateLimit, data, onOpenToken }: TopBarProps) {
  const { theme: themeId } = usePrefsStore();
  const theme = themes[themeId];
  return (
    <header className="no-print fixed inset-x-0 top-0 z-40 border-b border-border bg-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-white px-2 text-muted hover:bg-surface hover:text-ink"
            aria-label="Home"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-white pl-1 pr-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                aria-hidden="true"
                className="h-7 w-7 rounded-md object-cover"
              />
            ) : (
              <Github className="ml-1.5 h-4 w-4 text-muted" />
            )}
            <span className="font-mono text-sm font-medium text-ink">@{username}</span>
          </div>
          <RateLimitChip rateLimit={rateLimit} />
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeSwitcher />
          <button
            onClick={onOpenToken}
            className="hidden h-9 items-center gap-1.5 rounded-md border border-border bg-white px-3 text-xs text-muted hover:bg-surface hover:text-ink md:inline-flex"
            aria-label="Token settings"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Token</span>
          </button>
          <ExportBar data={data} theme={theme} />
        </div>
      </div>
    </header>
  );
}
