import type { ResumeData } from '@/resume/types';
import type { ThemeTokens } from '@/resume/themes';
import {
  Star,
  GitFork,
  ExternalLink,
} from 'lucide-react';

export function PinnedSection({
  data,
}: {
  data: ResumeData;
  theme: ThemeTokens;
}) {
  if (data.pinned.length === 0) return null;

  return (
    <section>
      <div className="grid grid-cols-2 gap-5">
        {data.pinned.map((repo) => (
          <a
            key={repo.fullName}
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="group rounded-3xl border border-black/[0.06] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-neutral-900">
                  {repo.name}
                </h3>

                {repo.primaryLanguage && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                    <span className="h-2 w-2 rounded-full bg-black" />
                    {repo.primaryLanguage.name}
                  </div>
                )}
              </div>

              <ExternalLink className="h-4 w-4 text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            {repo.description && (
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-600">
                {repo.description}
              </p>
            )}

            <div className="mt-5 flex items-center gap-5 text-xs text-neutral-500">
              <div className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                {repo.stars}
              </div>

              <div className="inline-flex items-center gap-1">
                <GitFork className="h-3.5 w-3.5" />
                {repo.forks}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}