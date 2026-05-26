import { motion } from 'framer-motion';
import { themeList, type ThemeId } from '@/resume/themes';
import { usePrefsStore } from '@/store/prefsStore';
import { cn } from '@/lib/format';
import { springSnap } from '@/lib/motion';

export function ThemeSwitcher() {
  const { theme, setTheme } = usePrefsStore();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white p-1 shadow-sm">
      {themeList.map((t) => {
        const active = theme === (t.id as ThemeId);

        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              'relative rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
              active
                ? 'text-black'
                : 'text-neutral-500 hover:text-black hover:bg-neutral-100'
            )}
          >
            {active && (
              <motion.span
                layoutId="theme-active"
                transition={springSnap}
                className="absolute inset-0 rounded-full bg-neutral-100 ring-1 ring-black/10 shadow-sm"
              />
            )}

            <span className="relative z-10">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}