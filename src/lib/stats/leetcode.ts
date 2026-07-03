import type { LeetcodeStats } from "@/lib/types";

/**
 * LeetCode's public GraphQL endpoint. Unofficial and occasionally
 * flaky — every failure path returns null so the cached value wins.
 */
export async function fetchLeetcodeStats(
  username: string,
): Promise<LeetcodeStats | null> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query($username: String!) {
          matchedUser(username: $username) {
            submitStatsGlobal {
              acSubmissionNum { difficulty count }
            }
          }
        }`,
        variables: { username },
      }),
    });
    if (!res.ok) return null;
    const body = await res.json();
    const rows: { difficulty: string; count: number }[] =
      body?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;
    if (!rows) return null;
    const get = (d: string) => rows.find((r) => r.difficulty === d)?.count ?? 0;
    return {
      totalSolved: get("All"),
      easy: get("Easy"),
      medium: get("Medium"),
      hard: get("Hard"),
    };
  } catch {
    return null;
  }
}
