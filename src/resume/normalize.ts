import type { RateLimit, ResumeData, UserResumeQueryResponse } from '@/resume/types';
import { aggregateLanguages, repoFromNode } from '@/lib/languageStats';

export function normalize(response: UserResumeQueryResponse): {
  data: ResumeData;
  rateLimit: RateLimit;
} {
  const u = response.user;
  if (!u) {
    throw new Error('USER_NOT_FOUND');
  }

  const pinned = u.pinnedItems.nodes.map(repoFromNode);

  // Top Repositories = the 8 most-starred owned, non-fork, public repos.
  // This is a *statistical* ranking; we intentionally do NOT exclude pinned
  // repos because pinned is a curated subset and "Top" means top-by-stars.
  // The repositories query already returns nodes ordered by STARGAZERS DESC,
  // so we just take the first 8. Re-sorting defensively in case GitHub
  // returns ties in a non-deterministic order.
  const allRepos = u.repositories.nodes.map(repoFromNode);
  const topRepos = [...allRepos].sort((a, b) => b.stars - a.stars).slice(0, 8);

  // Aggregate languages from the union of top-100 owned repos + pinned. The
  // top-100 query already covers most cases, but for users with >100 repos
  // some pinned items may fall outside that window — explicitly include them.
  const langSourceMap = new Map<string, (typeof u.repositories.nodes)[number]>();
  for (const r of u.repositories.nodes) langSourceMap.set(r.nameWithOwner, r);
  for (const r of u.pinnedItems.nodes) langSourceMap.set(r.nameWithOwner, r);
  const languages = aggregateLanguages(Array.from(langSourceMap.values()), 8);

  const organizations = u.organizations.nodes.map((o) => ({
    login: o.login,
    name: o.name,
    avatarUrl: o.avatarUrl,
    url: o.url,
  }));

  const data: ResumeData = {
    profile: {
      login: u.login,
      name: u.name,
      bio: u.bio,
      avatarUrl: u.avatarUrl,
      location: u.location,
      company: u.company,
      email: u.email,
      website: u.websiteUrl,
      twitter: u.twitterUsername,
      joinedAt: u.createdAt,
      followers: u.followers.totalCount,
      following: u.following.totalCount,
    },
    stats: {
      totalCommits: u.contributionsCollection.totalCommitContributions,
      totalPRs: u.contributionsCollection.totalPullRequestContributions,
      totalIssues: u.contributionsCollection.totalIssueContributions,
      totalRepos: u.contributionsCollection.totalRepositoryContributions,
      totalContributionsLastYear:
        u.contributionsCollection.contributionCalendar.totalContributions,
      publicReposCount: u.repositories.totalCount,
    },
    languages,
    pinned,
    topRepos,
    organizations,
  };

  return { data, rateLimit: response.rateLimit };
}
