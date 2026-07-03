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
  const langBytes = new Map<string, { bytes: number; color: string }>();
  let totalStars = 0;
  for (const repo of user.repositories.nodes) {
    totalStars += repo.stargazerCount;
    for (const edge of repo.languages.edges) {
      const prev = langBytes.get(edge.node.name);
      langBytes.set(edge.node.name, {
        bytes: (prev?.bytes ?? 0) + edge.size,
        color: edge.node.color ?? "#8b90b3",
      });
    }
  }
  const totalBytes = [...langBytes.values()].reduce((s, l) => s + l.bytes, 0) || 1;
  const topLanguages = [...langBytes.entries()]
    .sort((a, b) => b[1].bytes - a[1].bytes)
    .slice(0, 4)
    .map(([name, { bytes, color }]) => ({
      name,
      color,
      percent: Math.round((bytes / totalBytes) * 100),
    }));

  const calendar = user.contributionsCollection.contributionCalendar;
  const contributionCalendar = calendar.weeks.flatMap((w) =>
    w.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: levelFor(d.contributionCount),
    })),
  );

  return {
    totalContributions: calendar.totalContributions,
    totalCommits: user.contributionsCollection.totalCommitContributions,
    publicRepos: user.repositories.totalCount,
    totalStars,
    followers: user.followers.totalCount,
    topLanguages,
    contributionCalendar,
  };
}

const QUERY = `
query($login: String!) {
  user(login: $login) {
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        stargazerCount
        languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
        }
      }
    }
    followers { totalCount }
    contributionsCollection {
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
        body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_USERNAME } }),
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
