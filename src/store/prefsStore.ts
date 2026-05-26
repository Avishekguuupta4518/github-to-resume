import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ThemeId } from '@/resume/themes';

export type PaperSize = 'a4' | 'letter';

interface PrefsState {
  theme: ThemeId;
  paperSize: PaperSize;
  recent: string[];
  setTheme: (t: ThemeId) => void;
  setPaperSize: (p: PaperSize) => void;
  pushRecent: (login: string) => void;
  clearRecent: () => void;
}

const MAX_RECENT = 6;

const LEGACY_THEME_MAP: Record<string, ThemeId> = {
  // v1
  'modern-serif': 'vercel',
  'swiss-minimal': 'linear',
  'dev-terminal': 'monospace',
  // v2
  minimal: 'vercel',
  editorial: 'linear',
  mono: 'monospace',
  // v3 (Swiss)
  grid: 'vercel',
  terminal: 'monospace',
  // v4 (Soft Light)
  executive: 'linear',
  developer: 'monospace',
};

function isThemeId(v: unknown): v is ThemeId {
  return v === 'vercel' || v === 'linear' || v === 'monospace';
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set, get) => ({
      theme: 'vercel',
      paperSize: 'a4',
      recent: [],
      setTheme: (t) => set({ theme: t }),
      setPaperSize: (p) => set({ paperSize: p }),
      pushRecent: (login) => {
        const trimmed = login.trim();
        if (!trimmed) return;
        const lower = trimmed.toLowerCase();
        const next = [trimmed, ...get().recent.filter((r) => r.toLowerCase() !== lower)].slice(
          0,
          MAX_RECENT,
        );
        set({ recent: next });
      },
      clearRecent: () => set({ recent: [] }),
    }),
    {
      name: 'gh_prefs_v1',
      storage: createJSONStorage(() => localStorage),
      version: 5,
      migrate: (persisted, _version) => {
        if (!persisted || typeof persisted !== 'object') return persisted as PrefsState;
        const obj = persisted as Record<string, unknown>;
        const t = obj.theme;
        if (typeof t === 'string' && t in LEGACY_THEME_MAP) {
          obj.theme = LEGACY_THEME_MAP[t];
        } else if (!isThemeId(t)) {
          obj.theme = 'vercel';
        }
        return obj as unknown as PrefsState;
      },
    },
  ),
);
