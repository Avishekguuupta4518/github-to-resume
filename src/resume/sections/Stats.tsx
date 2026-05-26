import type { ResumeData } from '@/resume/types';
import { compactNumber } from '@/lib/format';

const ITEMS = [
  { key: 'followers', label: 'Followers' },
  { key: 'publicReposCount', label: 'Repositories' },
  { key: 'totalContributionsLastYear', label: 'Contributions' },
  { key: 'totalCommits', label: 'Commits' },
] as const;

export function StatsSection({ data }: { data: ResumeData }) {
  const values: any = {
    followers: data.profile.followers,
    publicReposCount: data.stats.publicReposCount,
    totalContributionsLastYear: data.stats.totalContributionsLastYear,
    totalCommits: data.stats.totalCommits,
  };

  return (
    <section>
      <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
        GitHub Metrics
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {ITEMS.map((item) => (
          <div
            key={item.key}
            className="group rounded-2xl border border-black/[0.06] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-black/[0.12] hover:shadow-lg"
          >
            {/* Label */}
            <div className="text-xs font-medium text-neutral-500 transition-colors duration-200 group-hover:text-neutral-700">
              {item.label}
            </div>

            {/* Value */}
            <div className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 transition-transform duration-200 group-hover:scale-[1.03]">
              {compactNumber(values[item.key])}
            </div>

            {/* Bottom Line */}
            <div className="mt-4 h-[2px] w-0 rounded-full bg-black transition-all duration-300 group-hover:w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}