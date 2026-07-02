import { beforeEach, describe, expect, it } from "vitest";
import {
  addGuestbookEntry,
  getPostBySlug,
  getPublishedPosts,
  getAllPosts,
  getVisitorCount,
  saveTask,
} from "@/lib/data";

// No Supabase env vars in tests → the layer must serve demo data and
// refuse writes gracefully.
beforeEach(() => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
});

describe("data layer in demo mode", () => {
  it("serves only published posts publicly, newest first", async () => {
    const posts = await getPublishedPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((p) => p.status === "published")).toBe(true);
    const dates = posts.map((p) => p.published_at ?? "");
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("includes drafts in the owner view", async () => {
    const all = await getAllPosts();
    expect(all.some((p) => p.status === "draft")).toBe(true);
  });

  it("resolves a published post by slug", async () => {
    const post = await getPostBySlug("hello-universe");
    expect(post?.title).toBe("Hello, universe");
  });

  it("returns null for a missing or draft slug", async () => {
    expect(await getPostBySlug("does-not-exist")).toBeNull();
    expect(await getPostBySlug("draft-riscv-notes")).toBeNull();
  });

  it("rejects writes with an explicit demo flag instead of throwing", async () => {
    const task = await saveTask({ title: "should not persist" });
    expect(task).toEqual({ ok: false, demo: true });

    const entry = await addGuestbookEntry({
      author_name: "x",
      author_avatar: null,
      message: "y",
      user_id: "z",
    });
    expect(entry).toEqual({ ok: false, demo: true });
  });

  it("serves a plausible visitor count", async () => {
    expect(await getVisitorCount()).toBeGreaterThan(0);
  });
});
