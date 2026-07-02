import type { Metadata } from "next";
import { formatDistanceToNow } from "date-fns";
import { HudPanel } from "@/components/ui/HudPanel";
import { Reveal } from "@/components/ui/Reveal";
import { getNowStatus, recordPageView } from "@/lib/data";

export const metadata: Metadata = {
  title: "Now",
  description: "What David Zhang is focused on right now.",
};

export const revalidate = 60;

export default async function NowPage() {
  const now = await getNowStatus();
  void recordPageView("/now");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Reveal>
        <div className="mb-3 flex items-center gap-3">
          <span className="live-dot" aria-hidden />
          <p className="hud-label">live feed</p>
        </div>
        <h1 className="text-3xl font-semibold glow-text sm:text-4xl">Now</h1>
        <p className="mt-3 text-sm text-ink-dim">
          Updated{" "}
          {formatDistanceToNow(new Date(now.updated_at), { addSuffix: true })}{" "}
          from mission control.
        </p>
      </Reveal>

      <div className="mt-10 space-y-5">
        <Reveal>
          <HudPanel title="Current focus">
            <p className="leading-relaxed">{now.focus}</p>
          </HudPanel>
        </Reveal>
        <Reveal delay={0.06}>
          <HudPanel title="Building this week">
            <p className="leading-relaxed">{now.building}</p>
          </HudPanel>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {now.listening && (
            <Reveal delay={0.12}>
              <HudPanel title="On the speakers" className="h-full">
                <p className="text-sm leading-relaxed text-ink-dim">
                  {now.listening}
                </p>
              </HudPanel>
            </Reveal>
          )}
          {now.location && (
            <Reveal delay={0.18}>
              <HudPanel title="Coordinates" className="h-full">
                <p className="font-mono text-sm text-ink-dim">{now.location}</p>
              </HudPanel>
            </Reveal>
          )}
        </div>
      </div>

      <Reveal delay={0.2}>
        <p className="mt-12 text-center font-mono text-xs text-ink-dim/60">
          this page is a live table row, not a redeploy
        </p>
      </Reveal>
    </div>
  );
}
