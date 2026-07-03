import type { GithubStats } from "@/lib/types";

export const GITHUB_USERNAME = "DavidZaa";

interface GraphqlWeek {
  contributionDays: { date: string; contributionCount: number }[];
}

export interface GraphqlViewer {
  repositories: {
    totalCount: number;
    nodes: {
      stargazerCount: number;
      languages: {
        edges: { size: number; node: { name: string; color: string | null } }[];
      };
    }[];
  };
  followers: { totalCount: number };
  contributionsCollection: {
    totalCommitContributions: number;
    contributionCalendar: { totalContributions: number };
  };
  monthly: {
    totalCommitContributions: number;
    contributionCalendar: {
      totalContributions: number;
      weeks: GraphqlWeek[];
    };
  };
}

function levelFor(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;
  return 4;
}

/** Pure mapper from the GraphQL payload — unit-tested. */
export function mapGithubGraphql(user: GraphqlViewer): GithubStats {
  // Weight each repo equally (by its internal language share) so one huge
  // repo's bytes don't drown every other language out of the mix.
  const langShare = new Map<string, { share: number; color: string }>();
  let totalStars = 0;
  for (const repo of user.repositories.nodes) {
    totalStars += repo.stargazerCount;
    const repoBytes = repo.languages.edges.reduce((s, e) => s + e.size, 0);
    if (repoBytes === 0) continue;
    for (const edge of repo.languages.edges) {
      const prev = langShare.get(edge.node.name);
      langShare.set(edge.node.name, {
        share: (prev?.share ?? 0) + edge.size / repoBytes,
        color: edge.node.color ?? "#8b90b3",
      });
    }
  }
  const totalShare = [...langShare.values()].reduce((s, l) => s + l.share, 0) || 1;
  const topLanguages = [...langShare.entries()]
    .sort((a, b) => b[1].share - a[1].share)
    .slice(0, 8)
    .map(([name, { share, color }]) => ({
      name,
      color,
      percent: Math.max(1, Math.round((share / totalShare) * 100)),
    }));

  const contributionCalendar = user.monthly.contributionCalendar.weeks.flatMap((w) =>
    w.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: levelFor(d.contributionCount),
    })),
  );

  return {
    totalContributions:
      user.contributionsCollection.contributionCalendar.totalContributions,
    totalCommits: user.contributionsCollection.totalCommitContributions,
    monthlyContributions: user.monthly.contributionCalendar.totalContributions,
    monthlyCommits: user.monthly.totalCommitContributions,
    publicRepos: user.repositories.totalCount,
    totalStars,
    followers: user.followers.totalCount,
    topLanguages,
    contributionCalendar,
  };
}

const QUERY = `
query($login: String!, $monthAgo: DateTime!, $now: DateTime!) {
  user(login: $login) {
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        stargazerCount
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
        }
      }
    }
    followers { totalCount }
    contributionsCollection {
      totalCommitContributions
      contributionCalendar { totalContributions }
    }
    monthly: contributionsCollection(from: $monthAgo, to: $now) {
      totalCommitContributions
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

/**
 * Live fetch. With GITHUB_TOKEN: full GraphQL stats. Without: minimal
 * REST facts (no calendar). Returns null on any failure — callers keep
 * serving the last cached value.
 */
export async function fetchGithubStats(): Promise<GithubStats | null> {
  const token = process.env.GITHUB_TOKEN;
  try {
    if (token) {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: QUERY,
          variables: {
            login: GITHUB_USERNAME,
            monthAgo: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            now: new Date().toISOString(),
          },
        }),
      });
      if (!res.ok) return null;
      const body = await res.json();
      if (!body?.data?.user) return null;
      return mapGithubGraphql(body.data.user);
    }

    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const u = await res.json();
    return {
      totalContributions: 0,
      totalCommits: 0,
      monthlyContributions: 0,
      monthlyCommits: 0,
      publicRepos: u.public_repos ?? 0,
      totalStars: 0,
      followers: u.followers ?? 0,
      topLanguages: [],
      contributionCalendar: [],
    };
  } catch {
    return null;
  }
}
