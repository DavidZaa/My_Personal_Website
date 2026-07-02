import { NextResponse } from "next/server";
import { addGuestbookEntry } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/data/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Guestbook is in demo mode — signing is disabled." },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  let message: unknown;
  try {
    ({ message } = await request.json());
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (typeof message !== "string" || !message.trim() || message.length > 280) {
    return NextResponse.json(
      { error: "Message must be 1–280 characters." },
      { status: 422 },
    );
  }

  const result = await addGuestbookEntry({
    author_name:
      (user.user_metadata.full_name as string | undefined) ??
      (user.user_metadata.name as string | undefined) ??
      "Anonymous traveler",
    author_avatar: (user.user_metadata.avatar_url as string | undefined) ?? null,
    message: message.trim(),
    user_id: user.id,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Could not save entry." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
