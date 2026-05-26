import { Document, Image, Link, Page, Text, View } from '@react-pdf/renderer';
import type { ResumeData } from '@/resume/types';
import type { ThemeTokens } from '@/resume/themes';
import { formatSectionTitle } from '@/resume/themes';
import { makeStyles, type ThemedStyles } from './styles';
import { compactNumber, formatDate, relativeTime } from '@/lib/format';

interface Props {
  data: ResumeData;
  theme: ThemeTokens;
  avatarDataUrl: string;
  paperSize: 'a4' | 'letter';
}

export function ResumeDocument({ data, theme, avatarDataUrl, paperSize }: Props) {
  const styles = makeStyles(theme);

  return (
    <Document
      title={`${data.profile.login} – Résumé`}
      author={data.profile.name ?? data.profile.login}
      subject="GitHub résumé"
      creator="GitHub Résumé Generator"
      producer="@react-pdf/renderer"
    >
      <Page size={paperSize === 'a4' ? 'A4' : 'LETTER'} style={styles.page} wrap>
        <Header data={data} avatarDataUrl={avatarDataUrl} styles={styles} />
        {data.profile.bio ? (
          <Text style={styles.bio}>{stripUnsupported(data.profile.bio)}</Text>
        ) : null}
        <Stats data={data} styles={styles} />
        <View style={styles.body}>
          <Languages data={data} theme={theme} styles={styles} />
          <Pinned data={data} theme={theme} styles={styles} />
          <TopRepos data={data} theme={theme} styles={styles} />
          <Orgs data={data} theme={theme} styles={styles} />
        </View>

        <View fixed style={styles.footer}>
          <Text>
            github.com/{data.profile.login} · Generated {formatDate(new Date().toISOString())}
          </Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

/* -------------------------------------------------------------------------- */

function SectionTitle({
  theme,
  styles,
  label,
}: {
  theme: ThemeTokens;
  styles: ThemedStyles;
  label: string;
}) {
  return <Text style={styles.sectionTitle}>{formatSectionTitle(theme, label)}</Text>;
}

function Header({
  data,
  avatarDataUrl,
  styles,
}: {
  data: ResumeData;
  avatarDataUrl: string;
  styles: ThemedStyles;
}) {
  const p = data.profile;
  const meta: { text: string; href?: string }[] = [];
  if (p.location) meta.push({ text: p.location });
  if (p.company) meta.push({ text: p.company });
  if (p.email) meta.push({ text: p.email, href: `mailto:${p.email}` });
  if (p.website) meta.push({ text: p.website.replace(/^https?:\/\//, ''), href: p.website });
  if (p.twitter) meta.push({ text: `@${p.twitter}`, href: `https://twitter.com/${p.twitter}` });
  meta.push({ text: `github.com/${p.login}`, href: `https://github.com/${p.login}` });

  return (
    <View style={styles.header} wrap={false}>
      {avatarDataUrl ? <Image src={avatarDataUrl} style={styles.avatar} /> : null}
      <View style={styles.headerText}>
        <Text style={styles.name}>{p.name ?? p.login}</Text>
        <Text style={styles.login}>
          @{p.login}
          {p.joinedAt ? `  ·  joined ${formatDate(p.joinedAt)}` : ''}
        </Text>
        <View style={styles.metaRow}>
          {meta.map((m, i) => (
            <View key={`${m.text}-${i}`} style={styles.metaItem}>
              {m.href ? (
                <Link src={m.href} style={styles.link}>
                  {m.text}
                </Link>
              ) : (
                <Text>{m.text}</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function Stats({ data, styles }: { data: ResumeData; styles: ThemedStyles }) {
  const items: { label: string; value: number }[] = [
    { label: 'Followers', value: data.profile.followers },
    { label: 'Following', value: data.profile.following },
    { label: 'Public Repos', value: data.stats.publicReposCount },
    { label: 'Contribs (1y)', value: data.stats.totalContributionsLastYear },
    { label: 'Commits (1y)', value: data.stats.totalCommits },
    { label: 'PRs (1y)', value: data.stats.totalPRs },
    { label: 'Issues (1y)', value: data.stats.totalIssues },
  ];
  return (
    <View style={styles.statsRow} wrap={false}>
      {items.map((i) => (
        <View key={i.label} style={styles.statBox}>
          <Text style={styles.statLabel}>{i.label}</Text>
          <Text style={styles.statValue}>{compactNumber(i.value)}</Text>
        </View>
      ))}
    </View>
  );
}

function Languages({
  data,
  theme,
  styles,
}: {
  data: ResumeData;
  theme: ThemeTokens;
  styles: ThemedStyles;
}) {
  if (data.languages.length === 0) return null;
  // Strict grayscale: stepped opacities of the ink accent.
  const opacityFor = (i: number, total: number) =>
    Math.max(0.25, 1 - (i / Math.max(1, total)) * 0.7);

  return (
    <View wrap={false}>
      <SectionTitle theme={theme} styles={styles} label="Languages" />
      <View style={styles.langBar}>
        {data.languages.map((l, i) => (
          <View
            key={l.name}
            style={{
              ...styles.langSegment,
              width: `${l.percent}%`,
              backgroundColor: theme.colors.accent,
              opacity: opacityFor(i, data.languages.length),
            }}
          />
        ))}
      </View>
      <View style={styles.legendRow}>
        {data.languages.map((l, i) => (
          <View key={l.name} style={styles.legendItem}>
            <View
              style={{
                ...styles.swatch,
                backgroundColor: theme.colors.accent,
                opacity: opacityFor(i, data.languages.length),
              }}
            />
            <Text>
              {l.name}{' '}
              <Text style={{ color: theme.colors.textMuted }}>{l.percent}%</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Pinned({
  data,
  theme,
  styles,
}: {
  data: ResumeData;
  theme: ThemeTokens;
  styles: ThemedStyles;
}) {
  if (data.pinned.length === 0) return null;
  return (
    <View>
      <SectionTitle theme={theme} styles={styles} label="Pinned Projects" />
      <View style={styles.pinnedGrid}>
        {data.pinned.map((repo) => (
          <View key={repo.fullName} style={styles.pinnedCard} wrap={false}>
            <View style={styles.pinnedHeader}>
              <Link src={repo.url} style={[styles.repoName, styles.link]}>
                {repo.name}
              </Link>
              <View style={styles.repoMeta}>
                <Text>★ {repo.stars}</Text>
                {repo.forks > 0 ? <Text>{repo.forks} forks</Text> : null}
              </View>
            </View>
            {repo.description ? (
              <Text style={styles.repoDescription}>{truncate(repo.description, 160)}</Text>
            ) : null}
            {repo.primaryLanguage ? (
              <View style={styles.repoMeta}>
                <View style={{ ...styles.swatch, backgroundColor: theme.colors.textMuted }} />
                <Text>{repo.primaryLanguage.name}</Text>
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

function TopRepos({
  data,
  theme,
  styles,
}: {
  data: ResumeData;
  theme: ThemeTokens;
  styles: ThemedStyles;
}) {
  if (data.topRepos.length === 0) return null;
  return (
    <View>
      <SectionTitle theme={theme} styles={styles} label="Top Repositories" />
      <View>
        {data.topRepos.map((repo) => (
          <View key={repo.fullName} style={styles.topRepoRow} wrap={false}>
            <View style={styles.topRepoLeft}>
              <Link src={repo.url} style={[styles.repoName, styles.link]}>
                {repo.name}
              </Link>
              {repo.description ? (
                <Text style={{ color: theme.colors.textMuted }}>
                  — {truncate(repo.description, 100)}
                </Text>
              ) : null}
            </View>
            <View style={styles.topRepoMeta}>
              {repo.primaryLanguage ? (
                <View style={styles.repoMeta}>
                  <View style={{ ...styles.swatch, backgroundColor: theme.colors.textMuted }} />
                  <Text>{repo.primaryLanguage.name}</Text>
                </View>
              ) : null}
              <Text>★ {repo.stars}</Text>
              {repo.pushedAt ? <Text>{relativeTime(repo.pushedAt)}</Text> : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function Orgs({
  data,
  theme,
  styles,
}: {
  data: ResumeData;
  theme: ThemeTokens;
  styles: ThemedStyles;
}) {
  if (data.organizations.length === 0) return null;
  return (
    <View wrap={false}>
      <SectionTitle theme={theme} styles={styles} label="Organizations" />
      <View style={styles.orgGrid}>
        {data.organizations.map((o) => (
          <Link key={o.login} src={o.url} style={styles.orgChip}>
            <Text style={styles.orgName}>{o.name ?? o.login}</Text>
          </Link>
        ))}
      </View>
    </View>
  );
}

function truncate(s: string, n: number): string {
  const cleaned = stripUnsupported(s);
  if (cleaned.length <= n) return cleaned;
  return cleaned.slice(0, n - 1).trimEnd() + '…';
}

/**
 * Strip glyphs the bundled fonts (Geist / Geist Mono / Inter / IBM Plex
 * Serif / JetBrains Mono) don't ship — primarily emoji and pictographs —
 * before they're rendered into the PDF. Without this, characters like ⚡
 * fall back to garbage glyphs (e.g. "¡").
 */
const UNSUPPORTED_RE = /[\p{Emoji_Presentation}\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}]/gu;
function stripUnsupported(s: string): string {
  return s.replace(UNSUPPORTED_RE, '').replace(/\s{2,}/g, ' ').trim();
}
