import { useEffect, useRef, useState } from 'react';
import type { ResumeData } from '@/resume/types';
import type { ThemeTokens } from '@/resume/themes';
import { ResumeView, PAGE_WIDTH, PAGE_HEIGHT } from '@/resume/ResumeView';
import { LoadingSkeleton } from './LoadingSkeleton';

interface Props {
  data: ResumeData | null;
  theme: ThemeTokens;
  loading?: boolean;
}

export function ResumePreview({ data, theme, loading = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const updateScale = () => {
      const w = el.getBoundingClientRect().width;
      setScale(Math.min(1, w / PAGE_WIDTH));
    };

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(updateScale);
    });

    ro.observe(el);
    updateScale();

    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full">
      <div
        className="relative mx-auto transition-transform duration-300 ease-out"
        style={{
          width: PAGE_WIDTH * scale,
          height: PAGE_HEIGHT * scale,
        }}
      >
        <div
          className="origin-top-left rounded-lg bg-white shadow-xl ring-1 ring-black/5 print:shadow-none"
          style={{
            width: PAGE_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {loading || !data ? (
            <LoadingSkeleton theme={theme} />
          ) : (
            <ResumeView data={data} theme={theme} />
          )}
        </div>
      </div>
    </div>
  );
}