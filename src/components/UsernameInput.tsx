import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/format';

const VALID = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;

/**
 * Command palette pattern — Raycast-style. Strict shadow-cmd, rounded-xl
 * shell. Mono prefix on the left (`github.com/`), borderless mono input,
 * sharp ink button.
 */
export function UsernameInput() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const v = value.trim().replace(/^@/, '');

    if (v.length === 0) {
      setError('Enter a GitHub username.');
      return;
    }

    if (!VALID.test(v)) {
      setError('Invalid GitHub username.');
      return;
    }

    setError(null);
    setBusy(true);

    await new Promise((r) => setTimeout(r, 500));

    navigate(`/u/${encodeURIComponent(v)}`);
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={cn(
          'flex w-full items-center rounded-xl bg-white p-1.5 shadow-cmd transition-shadow hover:shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_8px_28px_rgba(0,0,0,0.06)]',
          error && 'ring-2 ring-red-200',
        )}
      >
        <span className="select-none whitespace-nowrap pl-3 pr-1 font-mono text-base text-muted">
          github.com/
        </span>

        <input
          type="text"
          inputMode="text"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="off"
          autoFocus
          placeholder="username"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          aria-label="GitHub username"
          className="h-11 flex-1 bg-transparent px-1 font-mono text-lg text-ink outline-none placeholder:text-muted/50"
        />

        <button
          type="submit"
          disabled={busy}
          className={cn(
            'inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-ink px-5 text-sm font-medium text-white transition-colors',
            'hover:bg-black disabled:opacity-90',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          )}
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating
            </>
          ) : (
            <>
              Generate <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-center text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}