import type { ResumeData } from '@/resume/types';

export function SummarySection({ data }: { data: ResumeData }) {
  if (!data.profile.bio) return null;

  return (
    <section>
      <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
        Professional Summary
      </h2>

      <p className="text-[14px] leading-7 text-neutral-700">
        {data.profile.bio}
      </p>
    </section>
  );
}