"use client";

import { useState, useTransition } from "react";
import { HudPanel } from "@/components/ui/HudPanel";
import { GlowButton } from "@/components/ui/GlowButton";
import { Notice, writeError } from "@/components/dashboard/DemoNotice";
import { updateNow } from "../actions";
import type { NowStatus } from "@/lib/types";

const field =
  "w-full rounded-sm border border-line bg-panel/60 px-3 py-2 text-sm outline-none placeholder:text-ink-dim/50 focus:border-glow-b";

export function NowEditor({ initial }: { initial: NowStatus }) {
  const [focus, setFocus] = useState(initial.focus);
  const [building, setBuilding] = useState(initial.building);
  const [listening, setListening] = useState(initial.listening ?? "");
  const [location, setLocation] = useState(initial.location ?? "");
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateNow({
        focus: focus.trim(),
        building: building.trim(),
        listening: listening.trim() || null,
        location: location.trim() || null,
      });
      setNotice(writeError(result) ?? "Live — /now updated.");
    });
  };

  return (
    <HudPanel title="Edit the public live feed">
      <form onSubmit={save} className="space-y-4">
        <label className="block">
          <span className="hud-label mb-1.5 block">current focus</span>
          <input value={focus} onChange={(e) => setFocus(e.target.value)} className={field} />
        </label>
        <label className="block">
          <span className="hud-label mb-1.5 block">building this week</span>
          <input value={building} onChange={(e) => setBuilding(e.target.value)} className={field} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="hud-label mb-1.5 block">on the speakers</span>
            <input value={listening} onChange={(e) => setListening(e.target.value)} className={field} />
          </label>
          <label className="block">
            <span className="hud-label mb-1.5 block">coordinates</span>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className={field} />
          </label>
        </div>
        <GlowButton type="submit" disabled={busy}>
          {busy ? "Transmitting…" : "Update live feed"}
        </GlowButton>
      </form>
      <Notice text={notice} />
    </HudPanel>
  );
}
