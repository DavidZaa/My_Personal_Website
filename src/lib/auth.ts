import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/data/config";

export interface SessionUser {
  id: string;
  email: string | null;
  name: string | null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email ?? null,
    name:
      (user.user_metadata.full_name as string | undefined) ??
      (user.user_metadata.name as string | undefined) ??
      null,
  };
}

/**
 * Owner = the OWNER_EMAIL Google account. In demo mode (no Supabase)
 * there is no real data to protect and no way to sign in, so the
 * dashboard stays browsable for local preview.
 */
export function isOwner(user: SessionUser | null): boolean {
  if (!isSupabaseConfigured()) return true;
  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  if (!ownerEmail || !user?.email) return false;
  return user.email.toLowerCase() === ownerEmail;
}

/** Server-side gate for /dashboard — bounces non-owners to the home page. */
export async function requireOwner(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!isOwner(user)) redirect("/");
  return user;
}
