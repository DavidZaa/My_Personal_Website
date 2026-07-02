import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Supabase OAuth code exchange; sends the user back where they started. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Only allow same-site redirect targets.
  const target = next.startsWith("/") ? next : "/";
  return NextResponse.redirect(`${origin}${target}`);
}
