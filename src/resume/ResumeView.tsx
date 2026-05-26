import type { ResumeData } from '@/resume/types';
import type { ThemeTokens } from '@/resume/themes';
import { cssVarsFor } from '@/resume/themes';

import { HeaderSection } from './sections/Header';
import { SummarySection } from './sections/Summary';
import { StatsSection } from './sections/Stats';
import { LanguagesSection } from './sections/Languages';
import { PinnedSection } from './sections/Pinned';
import { TopReposSection } from './sections/TopRepos';
import { OrgsSection } from './sections/Orgs';

export const PAGE_WIDTH = 1100;
export const PAGE_HEIGHT = 1400;

export function ResumeView({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ThemeTokens;
}) {
  return (
    <div
      data-theme={theme.id}
      style={{
        ...cssVarsFor(theme),
        background: '#f5f5f5',
        color: 'var(--theme-text-primary)',
        fontFamily: 'var(--theme-font-body)',
        width: PAGE_WIDTH,
        minHeight: PAGE_HEIGHT,
        padding: 40,
      }}
      className="mx-auto"
    >
      <div className="overflow-hidden rounded-[32px] border border-black/[0.06] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)]">

        {/* Header */}
        <div className="border-b border-black/[0.06] px-10 py-10">
          <HeaderSection data={data} theme={theme} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12">

          {/* LEFT SIDEBAR */}
          <aside className="col-span-4 border-r border-black/[0.06] bg-neutral-50/60 px-8 py-8">

            {/* About */}
            {data.profile.bio && (
              <div className="mb-8">
                <SummarySection data={data} />
              </div>
            )}

            {/* Stats */}
            <div className="mb-8">
              <StatsSection data={data} />
            </div>

            {/* Languages */}
            <div className="mb-8">
              <LanguagesSection data={data} theme={theme} />
            </div>

            {/* Organizations */}
            <div>
              <OrgsSection data={data} theme={theme} />
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <main className="col-span-8 px-8 py-8">

            {/* Featured Projects */}
            <div className="mb-10">
              <PinnedSection data={data} theme={theme} />
            </div>

            {/* Top Repositories */}
            <div>
              <TopReposSection data={data} theme={theme} />
            </div>
          </main>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/[0.06] bg-neutral-50 px-10 py-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">
            GitHub Résumé Generator
          </p>

          <p className="text-xs text-neutral-400">
            ATS Friendly · Vector PDF · Searchable
          </p>
        </div>
      </div>
    </div>
  );
}