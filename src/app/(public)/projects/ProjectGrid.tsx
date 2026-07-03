"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import {
  projects,
  type ProjectOrigin,
  type ProjectStatus,
} from "@/lib/content/projects";

const statusStyles: Record<ProjectStatus, string> = {
  active: "text-glow-b border-glow-b/40",
  shipped: "text-emerald-300 border-emerald-300/40",
  research: "text-glow-a border-glow-a/40",
};

const originLabels: Record<ProjectOrigin, string> = {
  personal: "personal",
  research: "research",
  club: "club",
  civic: "civic",
  patent: "patent",
};

const FILTERS = ["all", "research", "personal", "club", "civic", "patent"] as const;

export function ProjectGrid() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const reduced = useReducedMotion();

  const visible =
    filter === "all" ? projects : projects.filter((p) => p.origin === filter);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-1.5" role="group" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
              filter === f
                ? "bg-glow-a/20 text-glow-b"
                : "border border-line text-ink-dim hover:text-ink"
            }`}
          >
            {f}
            <span className="ml-1.5 opacity-60">
              {f === "all" ? projects.length : projects.filter((p) => p.origin === f).length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {visible.map((p, i) => (
          <motion.div
            key={p.slug}
            layout={!reduced}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
          >
            <div className="hud-panel group flex h-full flex-col rounded-sm p-6 transition-colors hover:border-line-bright">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-mono text-lg font-semibold group-hover:text-glow-b">
                  {p.name}
                </h2>
                <div className="flex shrink-0 gap-1.5">
                  <span className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                    {originLabels[p.origin]}
                  </span>
                  <span
                    className={`rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${statusStyles[p.status]}`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-sm text-glow-b/80">{p.tagline}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-dim">
                {p.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 font-mono text-[10px] text-ink-dim">{p.year}</span>
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-dim"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {(p.github || p.liveUrl) && (
                <div className="mt-5 flex gap-3">
                  {p.liveUrl && (
                    <GlowButton href={p.liveUrl} external className="!px-4 !py-1.5 text-xs">
                      Launch ↗
                    </GlowButton>
                  )}
                  {p.github && (
                    <GlowButton
                      href={p.github}
                      external
                      variant="ghost"
                      className="!px-4 !py-1.5 text-xs"
                    >
                      GitHub ↗
                    </GlowButton>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
