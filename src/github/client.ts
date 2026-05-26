import { GraphQLClient, ClientError } from 'graphql-request';
import { USER_RESUME_QUERY } from './queries';
import { normalize } from '@/resume/normalize';
import type { RateLimit, ResumeData, UserResumeQueryResponse } from '@/resume/types';

const ENDPOINT = 'https://api.github.com/graphql';

export type ResumeErrorKind =
  | 'user-not-found'
  | 'unauthorized'
  | 'rate-limited'
  | 'network'
  | 'unknown';

export class ResumeError extends Error {
  constructor(
    public kind: ResumeErrorKind,
    message: string,
  ) {
    super(message);
    this.name = 'ResumeError';
  }
}

export function makeClient(token: string | null): GraphQLClient {
  // Defensive runtime check: PAT must NEVER be sent anywhere but GitHub.
  if (ENDPOINT !== 'https://api.github.com/graphql') {
    throw new Error('Invalid GraphQL endpoint');
  }
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  if (token && token.trim().length > 0) {
    headers.authorization = `bearer ${token.trim()}`;
  }
  return new GraphQLClient(ENDPOINT, { headers });
}

export async function fetchResume(
  login: string,
  token: string | null,
): Promise<{ data: ResumeData; rateLimit: RateLimit }> {
  const client = makeClient(token);
  try {
    const res = await client.request<UserResumeQueryResponse>(USER_RESUME_QUERY, { login });
    if (!res.user) {
      throw new ResumeError('user-not-found', `User "${login}" not found`);
    }
    return normalize(res);
  } catch (err) {
    if (err instanceof ResumeError) throw err;
    if (err instanceof ClientError) {
      const status = err.response?.status;
      if (status === 401) {
        throw new ResumeError('unauthorized', 'Invalid or missing GitHub token');
      }
      if (status === 403) {
        throw new ResumeError(
          'rate-limited',
          'GitHub API rate limit exceeded — add a personal access token',
        );
      }
      const errors = err.response?.errors;
      if (errors && errors.length > 0) {
        const msg = errors[0]?.message ?? 'GraphQL error';
        if (/Could not resolve to a User/i.test(msg)) {
          throw new ResumeError('user-not-found', `User "${login}" not found`);
        }
        throw new ResumeError('unknown', msg);
      }
    }
    if (err instanceof Error) {
      throw new ResumeError('network', err.message);
    }
    throw new ResumeError('unknown', 'Unknown error');
  }
}

/**
 * Lightweight token-validation request. Calls the REST `/user` endpoint, which
 * is fine for verifying the token works and reading scope headers without
 * burning the GraphQL rate limit.
 */
export async function validateToken(token: string): Promise<{
  ok: boolean;
  scopes: string[];
  login: string | null;
}> {
  if (token.trim().length === 0) return { ok: false, scopes: [], login: null };
  const res = await fetch('https://api.github.com/user', {
    headers: { authorization: `bearer ${token.trim()}` },
  });
  const scopesHeader = res.headers.get('x-oauth-scopes') ?? '';
  const scopes = scopesHeader
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!res.ok) return { ok: false, scopes, login: null };
  const body = (await res.json()) as { login?: string };
  return { ok: true, scopes, login: body.login ?? null };
}
