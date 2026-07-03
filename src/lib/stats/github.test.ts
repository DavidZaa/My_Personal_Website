import { describe, expect, it } from "vitest";
import { mapGithubGraphql, type GraphqlViewer } from "@/lib/stats/github";

const payload: GraphqlViewer = {
  repositories: {
    totalCount: 3,
    nodes: [
      {
        stargazerCount: 10,
        languages: {
          edges: [
            { size: 6000, node: { name: "Python", color: "#3572A5" } },
            { size: 2000, node: { name: "TypeScript", color: "#3178c6" } },
          ],
        },
      },
      {
        stargazerCount: 5,
        languages: {
          edges: [{ size: 2000, node: { name: "Python", color: "#3572A5" } }],
        },
      },
    ],
  },
  followers: { totalCount: 42 },
  monthly: {
    totalCommitContributions: 31,
    contributionCalendar: {
      totalContributions: 48,
      weeks: [
        {
          contributionDays: [
            { date: "2026-06-29", contributionCount: 0 },
            { date: "2026-06-30", contributionCount: 2 },
            { date: "2026-07-01", contributionCount: 7 },
            { date: "2026-07-02", contributionCount: 12 },
          ],
        },
      ],
    },
  },
  contributionsCollection: {
    totalCommitContributions: 500,
    contributionCalendar: { totalContributions: 700 },
  },
};

describe("mapGithubGraphql", () => {
  it("aggregates stars, repos, followers, totals", () => {
    const stats = mapGithubGraphql(payload);
    expect(stats.totalStars).toBe(15);
    expect(stats.publicRepos).toBe(3);
    expect(stats.followers).toBe(42);
    expect(stats.totalContributions).toBe(700);
    expect(stats.totalCommits).toBe(500);
    expect(stats.monthlyContributions).toBe(48);
    expect(stats.monthlyCommits).toBe(31);
  });

  it("weights language share per repo, not by raw bytes", () => {
    // repo1: Python 75% / TS 25%; repo2: Python 100% → Python 87.5%, TS 12.5%
    const { topLanguages } = mapGithubGraphql(payload);
    expect(topLanguages[0]).toEqual({ name: "Python", color: "#3572A5", percent: 88 });
    expect(topLanguages[1]).toEqual({ name: "TypeScript", color: "#3178c6", percent: 13 });
  });

  it("flattens the monthly calendar with correct intensity levels", () => {
    const { contributionCalendar } = mapGithubGraphql(payload);
    expect(contributionCalendar.map((d) => d.level)).toEqual([0, 1, 3, 4]);
  });
});
