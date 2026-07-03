"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ContributionGraph } from "@/components/stats/ContributionGraph";
import { TelemetryNumber } from "@/components/ui/Telemetry";
import type { Counter, GithubStats, LeetcodeStats } from "@/lib/types";

/**
 * Radial gauge that sweeps to its value when scrolled into view.
 * The sweep fraction is decorative (value vs. an owner-tuned max);
 * the real number sits in the middle.
 */
function Gauge({
  value,
  max,
  label,
  color,
  signalLost = false,
}: {
  value: number;
  max: number;
  label: string;
  color: string;
  signalLost?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();
  const frac = signalLost ? 0 : Math.min(value / max, 1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setActive(true),
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const R = 42;
  const C = 2 * Math.PI * R;
  const arc = C * 0.75; // 270° gauge

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-[135deg]">
          <circle
            cx="50" cy="50" r={R}
            fill="none"
            stroke="rgba(140,160,255,0.12)"
            strokeWidth="6"
            strokeDasharray={`${arc} ${C}`}
            strokeLinecap="round"
          />
          <motion.circle
            cx="50" cy="50" r={R}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${arc} ${C}`}
            initial={{ strokeDashoffset: arc }}
            animate={
              active
                ? { strokeDashoffset: arc * (1 - frac) }
                : { strokeDashoffset: arc }
            }
            transition={reduced ? { duration: 0 } : { duration: 1.4, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-lg font-semibold">
            {signalLost ? "— —" : active ? value.toLocaleString() : "0"}
          </span>
        </div>
      </div>
      <span className="hud-label text-center">
        {signalLost ? `${label} · signal lost` : label}
      </span>
    </div>
  );
}

export function TelemetryDeck({
  github,
  leetcode,
  counters,
  visitors,
}: {
  github: GithubStats | null;
  leetcode: LeetcodeStats | null;
  counters: Counter[];
  visitors: number;
}) {
  return (
    <section id="telemetry" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8">
          <p className="hud-label mb-2">telemetry deck</p>
          <h2 className="text-3xl font-semibold glow-text sm:text-4xl">
            Analytics This Month
          </h2>
        </div>
        <div className="hud-panel rounded-sm p-8">
          {/* Gauges row */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <Gauge
              value={github?.totalContributions ?? 0}
              max={500}
              label="contributions · yr"
              color="#8b5cf6"
              signalLost={!github}
            />
            <Gauge
              value={github?.monthlyCommits ?? 0}
              max={150}
              label="commits · mo"
              color="#0891b2"
              signalLost={!github}
            />
            <Gauge
              value={leetcode?.totalSolved ?? 0}
              max={600}
              label="leetcode solved"
              color="#34d399"
              signalLost={!leetcode}
            />
            <Gauge
              value={visitors}
              max={Math.max(visitors * 1.4, 100)}
              label="visitors logged"
              color="#f472b6"
            />
          </div>

          {/* Counters row */}
          {counters.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-4">
              {counters.slice(0, 4).map((c) => (
                <TelemetryNumber
                  key={c.id}
                  value={c.value}
                  label={`${c.icon ? `${c.icon} ` : ""}${c.label.toLowerCase()}`}
                  unit={c.unit ?? undefined}
                />
              ))}
            </div>
          )}

          {/* Contribution field */}
          {github && github.contributionCalendar.length > 0 && (
            <div className="mt-10 border-t border-line pt-8">
              <p className="hud-label mb-3">contribution field · trailing month</p>
              <ContributionGraph calendar={github.contributionCalendar} />
            </div>
          )}

          {/* Language mixture */}
          {github && github.topLanguages.length > 0 && (
            <div className="mt-8">
              <p className="hud-label mb-3">fuel mixture</p>
              <div
                className="flex h-2 w-full gap-[2px] overflow-hidden rounded-sm"
                role="img"
                aria-label={`Language mix: ${github.topLanguages.map((l) => `${l.name} ${l.percent}%`).join(", ")}`}
              >
                {github.topLanguages.map((l) => (
                  <span
                    key={l.name}
                    style={{ width: `${l.percent}%`, backgroundColor: l.color }}
                    title={`${l.name} ${l.percent}%`}
                  />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {github.topLanguages.map((l) => (
                  <span key={l.name} className="flex items-center gap-1.5 font-mono text-[10px] text-ink-dim">
                    <span
                      aria-hidden
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: l.color }}
                    />
                    {l.name} {l.percent}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
