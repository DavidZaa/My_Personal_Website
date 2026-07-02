import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/data/config";
import {
  demoCounters,
  demoEvents,
  demoGithubStats,
  demoGuestbook,
  demoLeetcodeStats,
  demoNowStatus,
  demoPosts,
  demoTasks,
  demoVisitorCount,
} from "@/lib/data/demo";
import type {
  CalendarEvent,
  Counter,
  GithubStats,
  GuestbookEntry,
  LeetcodeStats,
  NowStatus,
  Post,
  Task,
  WriteResult,
} from "@/lib/types";

/**
 * The only data access surface for the app. Every function serves demo
 * data when Supabase isn't configured, so nothing downstream needs to
 * care which mode it's running in.
 */

const DEMO_WRITE: WriteResult = { ok: false, demo: true };

function fail(error: unknown): WriteResult {
  return { ok: false, error: error instanceof Error ? error.message : String(error) };
}

// ---------- Posts ----------

export async function getPublishedPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    return demoPosts
      .filter((p) => p.status === "published")
      .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) {
    return demoPosts.find((p) => p.slug === slug && p.status === "published") ?? null;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data ?? null;
}

/** All posts including drafts — dashboard only (RLS restricts to owner). */
export async function getAllPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    return [...demoPosts].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function getPostById(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) {
    return demoPosts.find((p) => p.id === id) ?? null;
  }
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}

export async function savePost(
  post: Partial<Post> & { title: string; slug: string },
): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return DEMO_WRITE;
  const supabase = await createClient();
  const now = new Date().toISOString();
  const row = { ...post, updated_at: now };
  const { data, error } = post.id
    ? await supabase.from("posts").update(row).eq("id", post.id).select("id").single()
    : await supabase.from("posts").insert(row).select("id").single();
  if (error) return fail(error);
  return { ok: true, id: data.id };
}

export async function deletePost(id: string): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return DEMO_WRITE;
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  return error ? fail(error) : { ok: true };
}

// ---------- Tasks ----------

export async function getTasks(): Promise<Task[]> {
  if (!isSupabaseConfigured()) {
    return [...demoTasks].sort((a, b) => a.position - b.position);
  }
  const supabase = await createClient();
  const { data } = await supabase.from("tasks").select("*").order("position");
  return data ?? [];
}

export async function saveTask(
  task: Partial<Task> & { title: string },
): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return DEMO_WRITE;
  const supabase = await createClient();
  const { data, error } = task.id
    ? await supabase.from("tasks").update(task).eq("id", task.id).select("id").single()
    : await supabase.from("tasks").insert(task).select("id").single();
  if (error) return fail(error);
  return { ok: true, id: data.id };
}

export async function toggleTask(id: string, done: boolean): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return DEMO_WRITE;
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ done }).eq("id", id);
  return error ? fail(error) : { ok: true };
}

export async function deleteTask(id: string): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return DEMO_WRITE;
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  return error ? fail(error) : { ok: true };
}

// ---------- Calendar events ----------

export async function getEvents(
  rangeStart: string,
  rangeEnd: string,
): Promise<CalendarEvent[]> {
  if (!isSupabaseConfigured()) {
    return demoEvents.filter(
      (e) => e.starts_at >= rangeStart && e.starts_at <= rangeEnd,
    );
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .gte("starts_at", rangeStart)
    .lte("starts_at", rangeEnd)
    .order("starts_at");
  return data ?? [];
}

export async function saveEvent(
  event: Partial<CalendarEvent> & { title: string; starts_at: string },
): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return DEMO_WRITE;
  const supabase = await createClient();
  const { data, error } = event.id
    ? await supabase.from("events").update(event).eq("id", event.id).select("id").single()
    : await supabase.from("events").insert(event).select("id").single();
  if (error) return fail(error);
  return { ok: true, id: data.id };
}

export async function deleteEvent(id: string): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return DEMO_WRITE;
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  return error ? fail(error) : { ok: true };
}

// ---------- Counters ----------

export async function getCounters(): Promise<Counter[]> {
  if (!isSupabaseConfigured()) return demoCounters;
  const supabase = await createClient();
  const { data } = await supabase.from("counters").select("*").order("label");
  return data ?? [];
}

export async function saveCounter(
  counter: Partial<Counter> & { label: string },
): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return DEMO_WRITE;
  const supabase = await createClient();
  const { data, error } = counter.id
    ? await supabase.from("counters").update(counter).eq("id", counter.id).select("id").single()
    : await supabase.from("counters").insert(counter).select("id").single();
  if (error) return fail(error);
  return { ok: true, id: data.id };
}

export async function deleteCounter(id: string): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return DEMO_WRITE;
  const supabase = await createClient();
  const { error } = await supabase.from("counters").delete().eq("id", id);
  return error ? fail(error) : { ok: true };
}

// ---------- Now status ----------

export async function getNowStatus(): Promise<NowStatus> {
  if (!isSupabaseConfigured()) return demoNowStatus;
  const supabase = await createClient();
  const { data } = await supabase.from("now_status").select("*").limit(1).maybeSingle();
  return data ?? demoNowStatus;
}

export async function saveNowStatus(
  status: Omit<NowStatus, "updated_at">,
): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return DEMO_WRITE;
  const supabase = await createClient();
  // Single-row table: id=1 always.
  const { error } = await supabase
    .from("now_status")
    .upsert({ id: 1, ...status, updated_at: new Date().toISOString() });
  return error ? fail(error) : { ok: true };
}

// ---------- Guestbook ----------

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  if (!isSupabaseConfigured()) return demoGuestbook;
  const supabase = await createClient();
  const { data } = await supabase
    .from("guestbook_entries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  return data ?? [];
}

export async function addGuestbookEntry(entry: {
  author_name: string;
  author_avatar: string | null;
  message: string;
  user_id: string;
}): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return DEMO_WRITE;
  const supabase = await createClient();
  const { error } = await supabase.from("guestbook_entries").insert(entry);
  return error ? fail(error) : { ok: true };
}

export async function deleteGuestbookEntry(id: string): Promise<WriteResult> {
  if (!isSupabaseConfigured()) return DEMO_WRITE;
  const supabase = await createClient();
  const { error } = await supabase.from("guestbook_entries").delete().eq("id", id);
  return error ? fail(error) : { ok: true };
}

// ---------- Stat cache ----------

export async function getGithubStats(): Promise<GithubStats | null> {
  if (!isSupabaseConfigured()) return demoGithubStats;
  const supabase = await createClient();
  const { data } = await supabase
    .from("stat_cache")
    .select("data")
    .eq("key", "github")
    .maybeSingle();
  return (data?.data as GithubStats) ?? null;
}

export async function getLeetcodeStats(): Promise<LeetcodeStats | null> {
  if (!isSupabaseConfigured()) return demoLeetcodeStats;
  const supabase = await createClient();
  const { data } = await supabase
    .from("stat_cache")
    .select("data")
    .eq("key", "leetcode")
    .maybeSingle();
  return (data?.data as LeetcodeStats) ?? null;
}

export async function saveStatCache(
  key: "github" | "leetcode",
  payload: GithubStats | LeetcodeStats,
): Promise<WriteResult> {
  if (!hasServiceRole()) return DEMO_WRITE;
  const admin = createAdminClient();
  const { error } = await admin
    .from("stat_cache")
    .upsert({ key, data: payload, fetched_at: new Date().toISOString() });
  return error ? fail(error) : { ok: true };
}

// ---------- Page views ----------

export async function getVisitorCount(): Promise<number> {
  if (!isSupabaseConfigured()) return demoVisitorCount;
  const supabase = await createClient();
  const { data } = await supabase.rpc("total_page_views");
  return typeof data === "number" ? data : 0;
}

export async function getPageViewsByDay(
  days: number,
): Promise<{ day: string; count: number }[]> {
  if (!isSupabaseConfigured()) {
    // Deterministic demo series so the analytics chart has a shape.
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(Date.now() - (days - 1 - i) * 86400000);
      return {
        day: d.toISOString().slice(0, 10),
        count: 20 + ((i * 37) % 45),
      };
    });
  }
  const supabase = await createClient();
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const { data } = await supabase
    .from("page_views")
    .select("day, count")
    .gte("day", since)
    .order("day");
  // Aggregate across paths per day.
  const byDay = new Map<string, number>();
  for (const row of data ?? []) {
    byDay.set(row.day, (byDay.get(row.day) ?? 0) + row.count);
  }
  return [...byDay.entries()].map(([day, count]) => ({ day, count }));
}

export async function getTopPaths(
  limit: number,
): Promise<{ path: string; count: number }[]> {
  if (!isSupabaseConfigured()) {
    return [
      { path: "/", count: 512 },
      { path: "/projects", count: 203 },
      { path: "/blog/hello-universe", count: 144 },
      { path: "/about", count: 98 },
      { path: "/guestbook", count: 67 },
    ].slice(0, limit);
  }
  const supabase = await createClient();
  const { data } = await supabase.from("page_views").select("path, count");
  const byPath = new Map<string, number>();
  for (const row of data ?? []) {
    byPath.set(row.path, (byPath.get(row.path) ?? 0) + row.count);
  }
  return [...byPath.entries()]
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function recordPageView(path: string): Promise<void> {
  if (!hasServiceRole()) return;
  try {
    const admin = createAdminClient();
    await admin.rpc("increment_page_view", { view_path: path });
  } catch {
    // Analytics must never break a page render.
  }
}
