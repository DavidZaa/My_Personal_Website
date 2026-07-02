"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/data/config";

export function SignOutButton() {
  const router = useRouter();
  if (!isSupabaseConfigured()) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        await createClient().auth.signOut();
        router.push("/");
        router.refresh();
      }}
      className="font-mono text-xs text-ink-dim transition-colors hover:text-danger"
    >
      sign out ⏻
    </button>
  );
}
