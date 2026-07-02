import type { Metadata } from "next";
import { HudPanel } from "@/components/ui/HudPanel";
import { Reveal } from "@/components/ui/Reveal";
import { EntryCard } from "@/components/guestbook/EntryCard";
import { GuestbookForm } from "@/components/guestbook/GuestbookForm";
import { getGuestbookEntries, recordPageView } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/data/config";

export const metadata: Metadata = {
  title: "Guestbook",
  description: "Leave a signal — notes from travelers passing through.",
};

export const revalidate = 30;

export default async function GuestbookPage() {
  const entries = await getGuestbookEntries();
  void recordPageView("/guestbook");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Reveal>
        <p className="hud-label mb-3">open channel</p>
        <h1 className="text-3xl font-semibold glow-text sm:text-4xl">
          Guestbook
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink-dim">
          Signals received from travelers passing through this system. Sign in
          with Google and add yours.
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <HudPanel className="mt-8">
          <GuestbookForm configured={isSupabaseConfigured()} />
        </HudPanel>
      </Reveal>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {entries.map((entry, i) => (
          <EntryCard key={entry.id} entry={entry} index={i} />
        ))}
      </ul>
      {entries.length === 0 && (
        <p className="mt-16 text-center font-mono text-sm text-ink-dim">
          no signals yet — be the first
        </p>
      )}
    </div>
  );
}
