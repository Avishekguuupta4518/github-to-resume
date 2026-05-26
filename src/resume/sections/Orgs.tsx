import type { ResumeData } from '@/resume/types';
import type { ThemeTokens } from '@/resume/themes';
import { Building2, ExternalLink } from 'lucide-react';

export function OrgsSection({
  data,
}: {
  data: ResumeData;
  theme: ThemeTokens;
}) {
  if (data.organizations.length === 0) return null;

  return (
    <section>
      <div className="grid grid-cols-2 gap-4">
        {data.organizations.map((org) => (
          <a
            key={org.login}
            href={org.url}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-black/[0.06] bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
                  <Building2 className="h-5 w-5 text-neutral-700" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    {org.name ?? org.login}
                  </h3>

                  <p className="mt-0.5 text-xs text-neutral-500">
                    @{org.login}
                  </p>
                </div>
              </div>

              <ExternalLink className="h-4 w-4 text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}