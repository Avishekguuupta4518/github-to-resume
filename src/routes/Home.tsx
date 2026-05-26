import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Sparkles } from 'lucide-react';
import { UsernameInput } from '@/components/UsernameInput';
import { TokenDialog } from '@/components/TokenDialog';
import { useTokenStore } from '@/store/tokenStore';
import { usePrefsStore } from '@/store/prefsStore';

export default function Home() {
  const [open, setOpen] = useState(false);
  const { token } = useTokenStore();
  const { recent, clearRecent } = usePrefsStore();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-12">
      <main className="flex w-full max-w-xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:shadow-black/10"
        >
          <Sparkles className="h-3.5 w-3.5 text-black" />

          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-700">
            AI POWERED RESUME ENGINE
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
          className="mt-8 max-w-2xl text-balance text-center text-4xl font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl"
          style={{ letterSpacing: '-0.02em' }}
        >
          Turn Your GitHub
          <br />
          Into a Stunning Developer Résume
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mt-5 max-w-lg text-center text-base leading-relaxed text-muted"
        >
          Generate beautiful ATS-friendly vector PDFs directly from your GitHub
          profile. No backend. No tracking. Fully client-side and lightning fast.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="relative z-10 mt-10 w-full"
        >
          <div className="rounded-3xl border border-black/10 bg-white ">
            <UsernameInput />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3"
        >
          {[
            'VECTOR PDF',
            'SEARCHABLE',
            'ATS FRIENDLY',
            'REACT PDF',
          ].map((item) => (
            <div
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:shadow-black/10"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-700 transition-colors duration-300 group-hover:text-white">
                {item}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Token Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-5 flex items-center gap-4"
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-2 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:shadow-black/10 cursor-pointer"
          >
            <KeyRound className="h-3.5 w-3.5 text-black" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-700">
              {token ? 'TOKEN CONFIGURED' : 'CONFIGURE GITHUB TOKEN'}
            </span>
          </button>
        </motion.div>

        {/* Recent */}
        {recent.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-16 w-full max-w-3xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                Recent Profiles..
              </span>

              <button
                type="button"
                onClick={clearRecent}
                className="text-sm text-neutral-500 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {recent.map((u) => (
                <Link
                  key={u}
                  to={`/u/${encodeURIComponent(u)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:shadow-black/10"
                >
                  <span className="font-mono text-sm text-neutral-700">@{u}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

      </main>

      <TokenDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
