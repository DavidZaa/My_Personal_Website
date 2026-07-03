import { NextResponse } from "next/server";
import { fetchGithubStats } from "@/lib/stats/github";
import { fetchLeetcodeStats } from "@/lib/stats/leetcode";
import { saveStatCache } from "@/lib/data";
import { hasServiceRole } from "@/lib/data/config";

/**
 * Refreshes the external-stats cache. Wire this to a Vercel cron
 * (e.g. every 6 hours) or hit it manually after pushing code.
 */
export async function GET() {
  if (!hasServiceRole()) {
    return NextResponse.json({
      ok: false,
      demo: true,
      note: "Supabase service role not configured — site serves demo stats.",
    });
  }

  const [github, leetcode] = await Promise.all([
    fetchGithubStats(),
    process.env.LEETCODE_USERNAME
      ? fetchLeetcodeStats(process.env.LEETCODE_USERNAME)
      : Promise.resolve(null),
  ]);

  const results: Record<string, string> = {};
  if (github) {
    await saveStatCache("github", github);
    results.github = "refreshed";
  } else {
    results.github = "fetch failed — cache untouched";
  }
  if (leetcode) {
    await saveStatCache("leetcode", leetcode);
    results.leetcode = "refreshed";
  } else {
    results.leetcode = "unavailable — cache untouched";
  }

  return NextResponse.json({ ok: true, results });
}
