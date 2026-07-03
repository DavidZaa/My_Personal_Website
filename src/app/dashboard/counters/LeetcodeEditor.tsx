"use client";

import { useState, useTransition } from "react";
import { HudPanel } from "@/components/ui/HudPanel";
import { GlowButton } from "@/components/ui/GlowButton";
import { Notice, writeError } from "@/components/dashboard/DemoNotice";
import { updateLeetcodeStats } from "../actions";
import type { LeetcodeStats } from "@/lib/types";

const EMPTY: LeetcodeStats = { totalSolved: 0, easy: 0, medium: 0, hard: 0 };

const FIELDS: { key: keyof LeetcodeStats; label: string }[] = [
  { key: "totalSolved", label: "Total solved" },
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

export function LeetcodeEditor({ initial }: { initial: LeetcodeStats | null }) {
  const [stats, setStats] = useState<LeetcodeStats>(initial ?? EMPTY);
  const [notice, setNotice] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = (key: keyof LeetcodeStats, raw: string) => {
    setSaved(false);
    setStats((s) => ({ ...s, [key]: Math.max(0, parseInt(raw, 10) || 0) }));
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateLeetcodeStats(stats);
      setNotice(writeError(result));
      setSaved(result.ok);
    });
  };

  return (
    <HudPanel title="LeetCode telemetry">
      <p className="mb-5 text-sm text-ink-dim">
        Feeds the &ldquo;leetcode solved&rdquo; gauge on the home page. Update
        it by hand whenever your count changes — only the total shows publicly
        for now.
      </p>

      <form onSubmit={save} className="flex flex-wrap items-end gap-3">
        {FIELDS.map(({ key, label }) => (
          <label key={key} className="flex flex-col gap-1 text-xs text-ink-dim">
            {label}
            <input
              type="number"
              min={0}
              value={stats[key]}
              onChange={(e) => set(key, e.target.value)}
              aria-label={`LeetCode ${label.toLowerCase()}`}
              className="w-24 rounded-sm border border-line bg-panel/60 px-3 py-2 font-mono text-sm text-ink outline-none focus:border-glow-b"
            />
          </label>
        ))}
        <GlowButton type="submit" disabled={pending}>
          {saved ? "Saved" : "Save"}
        </GlowButton>
      </form>
      <Notice text={notice} />
    </HudPanel>
  );
}
