import { useState } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Download, Loader2, Printer } from 'lucide-react';
import type { ResumeData } from '@/resume/types';
import type { ThemeTokens } from '@/resume/themes';
import { usePrefsStore } from '@/store/prefsStore';
import { downloadResumePdf } from '@/lib/pdfDownload';
import { cn } from '@/lib/format';

interface Props {
  data: ResumeData | null;
  theme: ThemeTokens;
}

type Phase = 'idle' | 'busy' | 'done' | 'error';

export function ExportBar({ data, theme }: Props) {
  const { paperSize, setPaperSize } = usePrefsStore();
  const [phase, setPhase] = useState<Phase>('idle');
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function onDownload() {
    if (!data) return;
    setPhase('busy');
    setErrMsg(null);

    try {
      await downloadResumePdf({ data, theme, paperSize });
      setPhase('done');
      setTimeout(() => setPhase('idle'), 1800);
    } catch (err) {
      console.error('[GitHub Résumé] PDF download failed:', err);
      setPhase('error');
      setErrMsg(err instanceof Error ? err.message : 'Download failed');
      setTimeout(() => setPhase('idle'), 5000);
    }
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { }
  }

  return (
    <div className="relative flex items-center gap-1.5">

      {phase === 'error' && errMsg && (
        <div
          role="alert"
          className="absolute right-0 top-full z-50 mt-2 max-w-xs rounded-md border border-red-200 bg-red-50 px-3 py-2 font-mono text-[11px] text-red-700 shadow-cmd"
        >
          {errMsg}
        </div>
      )}

      {/* PAPER TOGGLE (PILL STYLE) */}
      <div className="hidden lg:flex items-center gap-1 rounded-full border border-black/10 bg-white p-1 shadow-sm">
        {(['a4', 'letter'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPaperSize(p)}
            className={cn(
              'rounded-full px-3 py-1 text-[10px] uppercase tracking-wider transition',
              paperSize === p
                ? 'bg-black text-white'
                : 'text-neutral-500 hover:text-black hover:bg-neutral-100'
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* SHARE (PILL) */}
      <button
        onClick={onCopy}
        className="hidden md:flex items-center gap-1 rounded-full border border-black/10 bg-white px-3 py-2 text-xs hover:shadow-sm transition"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Share'}
      </button>

      {/* PRINT (PILL) */}
      <button
        onClick={() => window.print()}
        className="hidden md:flex items-center gap-1 rounded-full border border-black/10 bg-white px-3 py-2 text-xs hover:shadow-sm transition"
      >
        <Printer className="h-3.5 w-3.5" />
        Print
      </button>

      {/* DOWNLOAD (PRIMARY PILL) */}
      <button
        onClick={onDownload}
        disabled={!data || phase === 'busy'}
        className={cn(
          'flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition',
          phase === 'done'
            ? 'bg-emerald-600 text-white'
            : phase === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-black text-white hover:bg-neutral-800'
        )}
      >
        {phase === 'busy' ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        Download
      </button>
    </div>
  );
}