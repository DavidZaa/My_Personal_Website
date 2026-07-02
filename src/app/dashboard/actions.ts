"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import * as data from "@/lib/data";
import type { WriteResult } from "@/lib/types";

/**
 * Every mutation from the dashboard funnels through here: re-check the
 * owner session, write via the data layer, then revalidate the public
 * pages the change feeds.
 */

// ---------- tasks ----------

export async function createTask(title: string, due: string | null): Promise<WriteResult> {
  await requireOwner();
  return data.saveTask({ title, due_date: due, done: false });
}

export async function setTaskDone(id: string, done: boolean): Promise<WriteResult> {
  await requireOwner();
  return data.toggleTask(id, done);
}

export async function removeTask(id: string): Promise<WriteResult> {
  await requireOwner();
  return data.deleteTask(id);
}

// ---------- calendar ----------

export async function upsertEvent(event: {
  id?: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  notes: string | null;
}): Promise<WriteResult> {
  await requireOwner();
  return data.saveEvent(event);
}

export async function removeEvent(id: string): Promise<WriteResult> {
  await requireOwner();
  return data.deleteEvent(id);
}

// ---------- posts ----------

export async function upsertPost(post: {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content_md: string;
  status: "draft" | "published";
  published_at: string | null;
}): Promise<WriteResult> {
  await requireOwner();
  const result = await data.savePost(post);
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  return result;
}

export async function removePost(id: string): Promise<WriteResult> {
  await requireOwner();
  const result = await data.deletePost(id);
  revalidatePath("/blog");
  return result;
}

// ---------- now ----------

export async function updateNow(status: {
  focus: string;
  building: string;
  listening: string | null;
  location: string | null;
}): Promise<WriteResult> {
  await requireOwner();
  const result = await data.saveNowStatus(status);
  revalidatePath("/now");
  revalidatePath("/");
  return result;
}

// ---------- counters ----------

export async function upsertCounter(counter: {
  id?: string;
  label: string;
  value: number;
  unit: string | null;
  icon: string | null;
}): Promise<WriteResult> {
  await requireOwner();
  const result = await data.saveCounter(counter);
  revalidatePath("/");
  return result;
}

export async function removeCounter(id: string): Promise<WriteResult> {
  await requireOwner();
  const result = await data.deleteCounter(id);
  revalidatePath("/");
  return result;
}

// ---------- guestbook moderation ----------

export async function removeGuestbookEntry(id: string): Promise<WriteResult> {
  await requireOwner();
  const result = await data.deleteGuestbookEntry(id);
  revalidatePath("/guestbook");
  return result;
}
