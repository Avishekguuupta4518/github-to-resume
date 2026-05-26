/**
 * The single GraphQL query that powers the entire résumé. Returns everything
 * we need in one round-trip: profile, contributions, pinned repos, top repos
 * (by stars), languages, organizations, and the current rate limit.
 */
export const USER_RESUME_QUERY = /* GraphQL */ `
  query UserResume($login: String!) {
    user(login: $login) {
      login
      name
      bio
      avatarUrl(size: 256)
      location
      company
      email
      websiteUrl
      twitterUsername
      createdAt
      followers {
        totalCount
      }
      following {
        totalCount
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalRepositoryContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            nameWithOwner
            description
            url
            stargazerCount
            forkCount
            pushedAt
            primaryLanguage {
              name
              color
            }
            languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
          }
        }
      }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        isFork: false
        privacy: PUBLIC
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          nameWithOwner
          description
          url
          stargazerCount
          forkCount
          pushedAt
          primaryLanguage {
            name
            color
          }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      organizations(first: 12) {
        nodes {
          login
          name
          avatarUrl
          url
        }
      }
    }
    rateLimit {
      remaining
      resetAt
      limit
    }
  }
`;
