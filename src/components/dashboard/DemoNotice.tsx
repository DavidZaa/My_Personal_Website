"use client";

import type { WriteResult } from "@/lib/types";

/** Standard interpretation of a failed dashboard write. */
export function writeError(result: WriteResult): string | null {
  if (result.ok) return null;
  if (result.demo) return "Demo mode — this edit won't persist until Supabase is configured.";
  return result.error ?? "Something went wrong.";
}

export function Notice({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <p role="status" className="mt-3 font-mono text-xs text-glow-warm">
      {text}
    </p>
  );
}
