import type { ResumeData } from '@/resume/types';
import type { ThemeTokens } from '@/resume/themes';

export function LanguagesSection({
  data,
}: {
  data: ResumeData;
  theme: ThemeTokens;
}) {
  if (data.languages.length === 0) return null;

  return (
    <section>
      <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
        Languages
      </h2>

      <div className="space-y-4">
        {data.languages.map((lang) => (
          <div key={lang.name}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>{lang.name}</span>
              <span className="text-neutral-500">{lang.percent}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-black"
                style={{
                  width: `${lang.percent}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}