import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/stats/github", () => ({
  fetchGithubStats: vi.fn().mockResolvedValue(null),
}));
vi.mock("@/lib/stats/leetcode", () => ({
  fetchLeetcodeStats: vi.fn().mockResolvedValue(null),
}));
vi.mock("@/lib/data", () => ({
  saveStatCache: vi.fn(),
}));
vi.mock("@/lib/data/config", () => ({
  hasServiceRole: vi.fn().mockReturnValue(false),
}));

const request = (auth?: string) =>
  new Request("http://localhost/api/stats/refresh", {
    headers: auth ? { authorization: auth } : {},
  });

afterEach(() => {
  delete process.env.CRON_SECRET;
});

describe("GET /api/stats/refresh cron guard", () => {
  it("rejects callers without the secret when CRON_SECRET is set", async () => {
    process.env.CRON_SECRET = "s3cret";
    expect((await GET(request())).status).toBe(401);
    expect((await GET(request("Bearer wrong"))).status).toBe(401);
  });

  it("accepts the Vercel cron's bearer header", async () => {
    process.env.CRON_SECRET = "s3cret";
    const res = await GET(request("Bearer s3cret"));
    expect(res.status).toBe(200);
  });

  it("stays open when no CRON_SECRET is configured", async () => {
    const res = await GET(request());
    expect(res.status).toBe(200);
  });
});
