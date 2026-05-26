import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TokenState {
  token: string | null;
  /** Hydrated from localStorage on first read; useful to gate UI hints. */
  setToken: (t: string) => void;
  clearToken: () => void;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (t) => set({ token: t.trim() || null }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: 'gh_pat_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ token: s.token }),
    },
  ),
);

/**
 * Resolves the runtime token. The dev-only `VITE_GITHUB_TOKEN` env override
 * takes priority over the user-provided token if present.
 */
export function getEffectiveToken(): string | null {
  const envToken = import.meta.env.VITE_GITHUB_TOKEN?.trim();
  if (envToken && envToken.length > 0) return envToken;
  return useTokenStore.getState().token;
}
