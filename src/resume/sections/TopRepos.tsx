import { useState } from 'react';
import {
  Star,
  GitFork,
  Clock3,
  Github,
} from 'lucide-react';

import type { ResumeData } from '@/resume/types';
import type { ThemeTokens } from '@/resume/themes';

import { relativeTime } from '@/lib/format';

export function TopReposSection({
  data,
}: {
  data: ResumeData;
  theme: ThemeTokens;
}) {
  const [showAll, setShowAll] = useState(false);

  if (data.topRepos.length === 0) return null;

  // Show only 3 repos initially
  const visibleRepos = showAll
    ? data.topRepos
    : data.topRepos.slice(0, 3);

  return (
    <section>
      <div className="space-y-4">
        {visibleRepos.map((repo) => (
          <a
            key={repo.fullName}
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="group block overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-black/10 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0 flex-1">

                {/* Repo Header */}
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-[16px] font-semibold tracking-tight text-neutral-900 transition-colors duration-200 group-hover:text-black">
                    {repo.name}
                  </h3>

                  {repo.primaryLanguage && (
                    <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-black/[0.06] bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-black" />
                      {repo.primaryLanguage.name}
                    </div>
                  )}
                </div>

                {/* Description */}
                {repo.description && (
                  <p className="mt-3 line-clamp-2 text-[13px] leading-6 text-neutral-600">
                    {repo.description}
                  </p>
                )}

                {/* Bottom Stats */}
                <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-neutral-500">

                  <div className="inline-flex items-center gap-1.5 transition-colors duration-200 group-hover:text-black">
                    <Star className="h-3.5 w-3.5" />
                    <span>{repo.stars} Stars</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 transition-colors duration-200 group-hover:text-black">
                    <GitFork className="h-3.5 w-3.5" />
                    <span>{repo.forks} Forks</span>
                  </div>

                  {repo.pushedAt && (
                    <div className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" />
                      <span>Updated {relativeTime(repo.pushedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Hover Bottom Bar */}
                <div className="mt-5 h-[2px] w-0 rounded-full bg-black transition-all duration-300 group-hover:w-full" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Open GitHub */}
      <div className="mt-6 flex justify-center">
        <a
          href={`https://github.com/${data.profile.login}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-lg"
        >
          <Github className="h-4 w-4" />
          View All on GitHub
        </a>
      </div>

    </section>
  );
}