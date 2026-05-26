/**
 * Canonical résumé domain model. Both `<ResumeView>` (HTML/Tailwind on screen)
 * and `<ResumeDocument>` (`@react-pdf/renderer`) consume this shape so the two
 * renderers always agree.
 */

export type Repo = {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  pushedAt: string;
  primaryLanguage: { name: string; color: string } | null;
};

export type LanguageStat = {
  name: string;
  color: string;
  /** 0..100, sum of the array == 100 (re-normalized after top-N truncation) */
  percent: number;
  bytes: number;
};

export type Org = {
  login: string;
  name: string | null;
  avatarUrl: string;
  url: string;
};

export type ResumeData = {
  profile: {
    login: string;
    name: string | null;
    bio: string | null;
    avatarUrl: string;
    location: string | null;
    company: string | null;
    email: string | null;
    website: string | null;
    twitter: string | null;
    /** ISO 8601 from GitHub */
    joinedAt: string;
    followers: number;
    following: number;
  };
  stats: {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    /** Distinct repositories the user contributed to in the last year. */
    totalRepos: number;
    totalContributionsLastYear: number;
    /** Total public, non-fork, owned repositories. */
    publicReposCount: number;
  };
  languages: LanguageStat[];
  pinned: Repo[];
  topRepos: Repo[];
  organizations: Org[];
};

export type RateLimit = {
  remaining: number;
  resetAt: string;
  limit: number;
};

/* GraphQL response types — strictly mirror the query in queries.ts.          */

export interface GqlLanguage {
  name: string;
  color: string | null;
}

export interface GqlLanguageEdge {
  size: number;
  node: GqlLanguage;
}

export interface GqlRepoNode {
  name: string;
  nameWithOwner: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  pushedAt: string | null;
  primaryLanguage: GqlLanguage | null;
  languages: { edges: GqlLanguageEdge[] | null } | null;
}

export interface GqlOrgNode {
  login: string;
  name: string | null;
  avatarUrl: string;
  url: string;
}

export interface GqlContributionDay {
  contributionCount: number;
  date: string;
}

export interface GqlContributionWeek {
  contributionDays: GqlContributionDay[];
}

export interface GqlContributionsCollection {
  totalCommitContributions: number;
  totalPullRequestContributions: number;
  totalIssueContributions: number;
  totalRepositoryContributions: number;
  contributionCalendar: {
    totalContributions: number;
    weeks: GqlContributionWeek[];
  };
}

export interface GqlUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  location: string | null;
  company: string | null;
  email: string | null;
  websiteUrl: string | null;
  twitterUsername: string | null;
  createdAt: string;
  followers: { totalCount: number };
  following: { totalCount: number };
  contributionsCollection: GqlContributionsCollection;
  pinnedItems: { nodes: GqlRepoNode[] };
  repositories: { totalCount: number; nodes: GqlRepoNode[] };
  organizations: { nodes: GqlOrgNode[] };
}

export interface UserResumeQueryResponse {
  user: GqlUser | null;
  rateLimit: RateLimit;
}
