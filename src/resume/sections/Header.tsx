import {
  Globe,
  Mail,
  MapPin,
  Building2,
  Github,
} from 'lucide-react';

import type { ResumeData } from '@/resume/types';
import type { ThemeTokens } from '@/resume/themes';
import { formatDate } from '@/lib/format';

export function HeaderSection({
  data,
}: {
  data: ResumeData;
  theme: ThemeTokens;
}) {
  const p = data.profile;

  return (
    <header className="flex items-start gap-6">
      <img
        src={p.avatarUrl}
        alt={`${p.login} avatar`}
        className="h-28 w-28 rounded-2xl object-cover border border-black/[0.06]"
        crossOrigin="anonymous"
      />

      <div className="min-w-0 flex-1">
        <h1
          className="text-[38px] font-semibold leading-none"
          style={{
            fontFamily: 'var(--theme-font-heading)',
            letterSpacing: '-0.04em',
          }}
        >
          {p.name ?? p.login}
        </h1>

        <div
          className="mt-2 text-sm"
          style={{
            color: 'var(--theme-text-muted)',
            fontFamily: 'var(--theme-font-mono)',
          }}
        >
          @{p.login}
        </div>

        {p.bio && (
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-neutral-700">
            {p.bio}
          </p>
        )}

        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-neutral-600">
          {p.location && (
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {p.location}
            </li>
          )}

          {p.company && (
            <li className="inline-flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {p.company}
            </li>
          )}

          {p.email && (
            <li className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {p.email}
            </li>
          )}

          {p.website && (
            <li className="inline-flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <a href={p.website} target="_blank" rel="noreferrer">
                {p.website.replace(/^https?:\/\//, '')}
              </a>
            </li>
          )}

          <li className="inline-flex items-center gap-2">
            <Github className="h-4 w-4" />
            github.com/{p.login}
          </li>
        </ul>

        <div className="mt-5 text-xs text-neutral-400">
          Joined {formatDate(p.joinedAt)}
        </div>
      </div>
    </header>
  );
}