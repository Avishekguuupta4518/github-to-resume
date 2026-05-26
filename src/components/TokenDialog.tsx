import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Trash2,
  X,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from 'lucide-react';

import { useTokenStore } from '@/store/tokenStore';
import { validateToken } from '@/github/client';
import { cn } from '@/lib/format';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TokenDialog({ open, onClose }: Props) {
  const { token, setToken, clearToken } = useTokenStore();
  const [draft, setDraft] = useState(token ?? '');
  const [show, setShow] = useState(false);
  const [validating, setValidating] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setDraft(token ?? '');
      setWarning(null);
      setInfo(null);
      setShow(false);
      setTimeout(() => closeRef.current?.focus(), 0);
    }
  }, [open, token]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  async function save() {
    const trimmed = draft.trim();

    if (!trimmed) {
      clearToken();
      onClose();
      return;
    }

    setValidating(true);
    setWarning(null);
    setInfo(null);

    try {
      const result = await validateToken(trimmed);

      if (!result.ok) {
        setWarning('Token is invalid or expired (401 Unauthorized).');
        return;
      }

      const hasFullRepo = result.scopes.includes('repo');

      if (hasFullRepo) {
        setWarning(
          '⚠️ This token has full repo access. Prefer public_repo + read:user for safety.',
        );
      } else {
        setInfo(
          `Verified: ${result.login ?? 'unknown'} · Scopes: ${
            result.scopes.join(', ') || 'none'
          }`,
        );
      }

      setToken(trimmed);
    } finally {
      setValidating(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="token-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* BACKDROP */}
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-white shadow-2xl"
          >
            {/* HEADER */}
            <div className="flex items-start justify-between border-b border-border px-5 py-4">
              <div>
                <h2
                  id="token-dialog-title"
                  className="text-base font-semibold tracking-tight text-ink"
                >
                  GitHub Access Token
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Boost API limit: 60 → 5000 requests/hour
                </p>
              </div>

              <button
                ref={closeRef}
                onClick={onClose}
                className="rounded-md p-1 text-muted transition hover:bg-surface hover:text-ink hover:rotate-90"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* BODY */}
            <div className="space-y-4 p-5">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-widest text-muted">
                  Personal Access Token
                </label>

                <div className="relative mt-2">
                  <input
                    type={show ? 'text' : 'password'}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="ghp_••••••••••••••••••"
                    className="w-full rounded-md border border-border bg-surface px-3 py-2 pr-10 font-mono text-sm text-ink transition focus:border-ink focus:bg-white focus:outline-none"
                    autoComplete="off"
                    spellCheck={false}
                  />

                  {/* show/hide */}
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted transition hover:bg-white hover:text-ink"
                  >
                    {show ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* INFO */}
              <ul className="space-y-1 text-xs text-muted">
                <li>
                  Required: <code className="text-ink">public_repo</code>,{' '}
                  <code className="text-ink">read:user</code>
                </li>

                <li>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=public_repo,read:user&description=GitHub%20Résumé"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-ink underline-offset-2 hover:underline"
                  >
                    Generate token on GitHub
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>

              {/* WARNING */}
              {warning && (
                <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>{warning}</span>
                </div>
              )}

              {/* INFO */}
              {info && (
                <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>{info}</span>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between border-t border-border bg-surface/40 px-5 py-3">
              <button
                onClick={() => {
                  clearToken();
                  setDraft('');
                  setWarning(null);
                  setInfo('Token cleared');
                }}
                className="flex items-center gap-1 text-sm text-muted transition hover:text-ink"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="rounded-md border border-border bg-white px-3 py-1.5 text-sm text-ink transition hover:bg-surface"
                >
                  Cancel
                </button>

                <button
                  onClick={save}
                  disabled={validating}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-md bg-ink px-4 py-1.5 text-sm font-medium text-white transition hover:bg-black',
                    validating && 'opacity-70',
                  )}
                >
                  {validating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}