"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { projects, type ProjectStatus } from "@/lib/content/projects";

const statusStyles: Record<ProjectStatus, string> = {
  active: "text-glow-b border-glow-b/40",
  shipped: "text-emerald-300 border-emerald-300/40",
  research: "text-glow-a border-glow-a/40",
};

const DOOR_MS = 420;
const HOLD_MS = 160;

/** Diagonal hazard stripes for the door edges. */
const hazard = {
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(251,191,36,0.85) 0 12px, #0a0c14 12px 24px)",
};

function Door({ side, closed }: { side: "left" | "right"; closed: boolean }) {
  const reduced = useReducedMotion();
  const dir = side === "left" ? -1 : 1;
  return (
    <motion.div
      aria-hidden
      className="absolute inset-y-0 z-20 w-[50.5%] overflow-hidden"
      style={{ [side]: 0 } as React.CSSProperties}
      initial={false}
      animate={{ x: closed ? "0%" : `${dir * 103}%` }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: DOOR_MS / 1000, ease: [0.6, 0.05, 0.25, 1] }
      }
    >
      {/* door body */}
      <div className="absolute inset-0 border-line/60 bg-gradient-to-b from-[#12141f] via-[#0b0d18] to-[#12141f]">
        {/* panel lines */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(140,160,255,0.12) 1px, transparent 1px)",
            backgroundSize: "100% 56px",
          }}
        />
        {/* bolts along the leading edge */}
        <div
          className={`absolute inset-y-4 flex w-6 flex-col justify-around ${
            side === "left" ? "right-4" : "left-4"
          }`}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className="mx-auto h-2 w-2 rounded-full border border-line-bright/50 bg-[#1a1d2c]"
            />
          ))}
        </div>
        {/* hazard strip on the meeting edge */}
        <div
          className={`absolute inset-y-0 w-3 ${side === "left" ? "right-0" : "left-0"}`}
          style={hazard}
        />
        {/* small status lamp */}
        <span
          className={`absolute top-6 ${side === "left" ? "left-6" : "right-6"} h-2 w-2 rounded-full ${
            closed ? "bg-danger shadow-[0_0_10px_rgba(251,113,133,0.9)]" : "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"
          }`}
        />
      </div>
    </motion.div>
  );
}

export function ProjectGallery() {
  const [index, setIndex] = useState(0);
  const [closed, setClosed] = useState(false);
  const [busy, setBusy] = useState(false);
  const reduced = useReducedMotion();
  const project = projects[index];

  const go = useCallback(
    (nextIndex: number) => {
      if (busy || nextIndex === index) return;
      const target = (nextIndex + projects.length) % projects.length;
      if (reduced) {
        setIndex(target);
        return;
      }
      // busy only while closing + swapping — a click during reopen simply
      // closes the doors again from wherever they are, which reads fine.
      setBusy(true);
      setClosed(true);
      setTimeout(() => {
        setIndex(target);
        setTimeout(() => {
          setClosed(false);
          setBusy(false);
        }, HOLD_MS);
      }, DOOR_MS);
    },
    [busy, index, reduced],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-10">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="hud-label mb-2">payload bay · hangar 01</p>
            <h1 className="text-2xl font-semibold glow-text sm:text-3xl">Projects</h1>
          </div>
          <p className="font-mono text-sm text-ink-dim" aria-live="polite">
            payload{" "}
            <span className="text-glow-b">{String(index + 1).padStart(2, "0")}</span>
            {" / "}
            {String(projects.length).padStart(2, "0")}
          </p>
        </div>

        {/* The bay aperture */}
        <div className="relative">
          {/* frame */}
          <div className="relative overflow-hidden rounded-sm border border-line-bright/40 bg-[#05070f] shadow-[0_0_60px_rgba(139,92,246,0.12)]">
            {/* top + bottom hazard rails */}
            <div className="absolute inset-x-0 top-0 z-30 h-2" style={hazard} />
            <div className="absolute inset-x-0 bottom-0 z-30 h-2" style={hazard} />

            <Door side="left" closed={closed} />
            <Door side="right" closed={closed} />

            {/* cargo: the project on display */}
            <div className="relative z-10 grid min-h-[420px] gap-8 p-8 pt-10 sm:p-12 md:grid-cols-[200px_1fr]">
              {/* emblem */}
              <div className="relative mx-auto flex h-40 w-40 items-center justify-center self-center md:h-48 md:w-48">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-line"
                />
                <span
                  aria-hidden
                  className="absolute inset-3 animate-[spin_24s_linear_infinite] rounded-full border border-dashed border-glow-a/40"
                />
                <span
                  aria-hidden
                  className="absolute inset-6 rounded-full border border-glow-b/30"
                />
                <span className="font-mono text-5xl font-semibold text-gradient">
                  {project.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase()}
                </span>
              </div>

              {/* description */}
              <div className="min-w-0 self-center">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                    {project.origin}
                  </span>
                  <span
                    className={`rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${statusStyles[project.status]}`}
                  >
                    {project.status}
                  </span>
                  <span className="font-mono text-[10px] text-ink-dim">{project.year}</span>
                </div>
                <h2 className="mt-3 font-mono text-2xl font-semibold text-ink sm:text-3xl">
                  {project.name}
                </h2>
                <p className="mt-1 text-sm text-glow-b/80">{project.tagline}</p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-dim">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-dim"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <GlowButton href={project.liveUrl} external>
                      Live demo ↗
                    </GlowButton>
                  )}
                  {project.github && (
                    <GlowButton href={project.github} external variant="ghost">
                      GitHub ↗
                    </GlowButton>
                  )}
                  {!project.liveUrl && !project.github && (
                    <p className="font-mono text-xs text-ink-dim">
                      records sealed — publication/patent only
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* switch controls */}
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous project"
            className="absolute -left-3 top-1/2 z-40 -translate-y-1/2 rounded-sm border border-line-bright/50 bg-[#0a0c14] px-3 py-6 font-mono text-lg text-ink-dim transition-all hover:border-glow-b hover:text-glow-b hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] sm:-left-6"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next project"
            className="absolute -right-3 top-1/2 z-40 -translate-y-1/2 rounded-sm border border-line-bright/50 bg-[#0a0c14] px-3 py-6 font-mono text-lg text-ink-dim transition-all hover:border-glow-b hover:text-glow-b hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] sm:-right-6"
          >
            ▶
          </button>
        </div>

        {/* pager dots */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${p.name}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-glow-b shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                  : "w-2 bg-line-bright/40 hover:bg-ink-dim"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-ink-dim/60">
          ← → arrow keys work too
        </p>
      </div>
    </div>
  );
}
