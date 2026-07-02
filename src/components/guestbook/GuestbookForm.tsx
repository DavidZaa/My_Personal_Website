"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlowButton } from "@/components/ui/GlowButton";
import { createClient } from "@/lib/supabase/client";

const MAX = 280;

export function GuestbookForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState<boolean | null>(configured ? null : false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
  }, [configured]);

  if (!configured) {
    return (
      <p className="font-mono text-xs text-ink-dim">
        guestbook transmitter offline (demo mode) — entries below are sample
        signals
      </p>
    );
  }

  const signIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/guestbook`,
      },
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || busy) return;
    setBusy(true);
    setError(null);
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    setBusy(false);
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Transmission failed — try again.");
      return;
    }
    setMessage("");
    router.refresh();
  };

  if (signedIn === null) {
    return <p className="font-mono text-xs text-ink-dim">checking uplink…</p>;
  }

  if (!signedIn) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-ink-dim">
          Sign in with Google to leave a signal.
        </p>
        <GlowButton onClick={signIn}>Sign in with Google</GlowButton>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label htmlFor="gb-message" className="hud-label block">
        compose signal
      </label>
      <textarea
        id="gb-message"
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
        rows={3}
        placeholder="Say hi, leave a note, report a spotted easter egg…"
        className="w-full resize-none rounded-sm border border-line bg-panel/60 p-3 text-sm outline-none transition-colors placeholder:text-ink-dim/50 focus:border-glow-b"
      />
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-ink-dim">
          {message.length}/{MAX}
        </span>
        <GlowButton type="submit" disabled={busy || !message.trim()}>
          {busy ? "Transmitting…" : "Transmit"}
        </GlowButton>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </form>
  );
}
