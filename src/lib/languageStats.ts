import type { GqlRepoNode, LanguageStat, Repo } from '@/resume/types';

const FALLBACK_COLOR = '#94a3b8';

export function repoFromNode(node: GqlRepoNode): Repo {
  return {
    name: node.name,
    fullName: node.nameWithOwner,
    description: node.description,
    url: node.url,
    stars: node.stargazerCount,
    forks: node.forkCount,
    pushedAt: node.pushedAt ?? '',
    primaryLanguage: node.primaryLanguage
      ? {
          name: node.primaryLanguage.name,
          color: node.primaryLanguage.color ?? FALLBACK_COLOR,
        }
      : null,
  };
}

/**
 * Aggregate language usage across all repos by summing bytes. Returns the top
 * `limit` languages, with `percent` re-normalized so the array sums to 100.
 */
export function aggregateLanguages(repos: GqlRepoNode[], limit = 8): LanguageStat[] {
  const totals = new Map<string, { bytes: number; color: string }>();

  for (const repo of repos) {
    const edges = repo.languages?.edges ?? [];
    for (const edge of edges) {
      const lang = edge.node;
      const prev = totals.get(lang.name);
      if (prev) {
        prev.bytes += edge.size;
      } else {
        totals.set(lang.name, {
          bytes: edge.size,
          color: lang.color ?? FALLBACK_COLOR,
        });
      }
    }
  }

  const all = Array.from(totals.entries()).map(([name, v]) => ({
    name,
    bytes: v.bytes,
    color: v.color,
  }));

  all.sort((a, b) => b.bytes - a.bytes);
  const top = all.slice(0, limit);
  const totalBytes = top.reduce((s, r) => s + r.bytes, 0) || 1;

  return top.map((l) => ({
    name: l.name,
    color: l.color,
    bytes: l.bytes,
    percent: Math.round((l.bytes / totalBytes) * 1000) / 10,
  }));
}
