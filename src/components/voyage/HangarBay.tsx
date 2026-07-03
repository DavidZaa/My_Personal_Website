"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { projects, type ProjectStatus } from "@/lib/content/projects";

const statusStyles: Record<ProjectStatus, string> = {
  active: "text-glow-b border-glow-b/40",
  shipped: "text-emerald-300 border-emerald-300/40",
  research: "text-glow-a border-glow-a/40",
};

const DOOR_MS = 460;
const HOLD_MS = 180;

const hazard = {
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(251,191,36,0.85) 0 14px, #0a0c14 14px 28px)",
};

function Door({ side, closed }: { side: "left" | "right"; closed: boolean }) {
  const reduced = useReducedMotion();
  const dir = side === "left" ? -1 : 1;
  return (
    <motion.div
      aria-hidden
      className="absolute inset-y-0 z-20 w-[50.5%]"
      style={{ [side]: 0 } as React.CSSProperties}
      initial={false}
      animate={{ x: closed ? "0%" : `${dir * 103}%` }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: DOOR_MS / 1000, ease: [0.6, 0.05, 0.25, 1] }
      }
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#151827] via-[#0b0d18] to-[#12141f]">
        {/* heavy panel plating */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(140,160,255,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(140,160,255,0.06) 2px, transparent 2px)",
            backgroundSize: "100% 88px, 160px 100%",
          }}
        />
        {/* window slit with interior light */}
        <div
          className={`absolute top-[18%] h-[3px] w-2/5 bg-glow-b/50 blur-[1px] ${
            side === "left" ? "right-10" : "left-10"
          }`}
        />
        {/* bolts on the leading edge */}
        <div
          className={`absolute inset-y-6 flex w-8 flex-col justify-around ${
            side === "left" ? "right-5" : "left-5"
          }`}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              className="mx-auto h-2.5 w-2.5 rounded-full border border-line-bright/50 bg-[#1a1d2c] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"
            />
          ))}
        </div>
        {/* giant stencil */}
        <p
          className={`absolute bottom-[12%] select-none font-mono text-7xl font-bold tracking-widest text-white/[0.04] ${
            side === "left" ? "right-8" : "left-8"
          }`}
        >
          {side === "left" ? "BAY" : "01"}
        </p>
        {/* hazard strip on the meeting edge */}
        <div
          className={`absolute inset-y-0 w-4 ${side === "left" ? "right-0" : "left-0"}`}
          style={hazard}
        />
      </div>
    </motion.div>
  );
}

/** Amber beacon that spins up while the doors are in motion. */
function Beacon({ active, side }: { active: boolean; side: "left" | "right" }) {
  const reduced = useReducedMotion();
  return (
    <div
      aria-hidden
      className={`absolute top-3 z-40 ${side === "left" ? "left-4" : "right-4"}`}
    >
      <motion.span
        className="block h-3 w-3 rounded-full bg-glow-warm"
        animate={
          active && !reduced
            ? { opacity: [0.25, 1, 0.25], scale: [1, 1.25, 1] }
            : { opacity: 0.25, scale: 1 }
        }
        transition={active ? { duration: 0.5, repeat: Infinity } : undefined}
        style={{ boxShadow: active ? "0 0 22px rgba(251,191,36,0.9)" : "none" }}
      />
    </div>
  );
}

export function HangarBay() {
  const [index, setIndex] = useState(0);
  const [closed, setClosed] = useState(false);
  const [busy, setBusy] = useState(false);
  const reduced = useReducedMotion();
  const project = projects[index];

  const go = useCallback(
    (nextIndex: number) => {
      if (busy) return;
      const target = (nextIndex + projects.length) % projects.length;
      if (target === index) return;
      if (reduced) {
        setIndex(target);
        return;
      }
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
      // Don't hijack arrows while typing in the guestbook box etc.
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable]")) return;
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  return (
    <section id="payload" className="scroll-mt-16">
      {/* Full-bleed hangar interior */}
      <div className="relative overflow-hidden bg-[#07080f] py-14 [mask-image:linear-gradient(to_bottom,black,black_calc(100%-4rem),transparent)]">
        {/* ceiling truss */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-16 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(140,160,255,0.18) 0 2px, transparent 2px 90px), linear-gradient(rgba(140,160,255,0.12) 1px, transparent 1px)",
            backgroundSize: "auto, 100% 16px",
          }}
        />
        {/* gantry floodlights */}
        {[25, 75].map((x) => (
          <div
            key={x}
            aria-hidden
            className="absolute top-0 h-2/3 w-40 opacity-[0.05]"
            style={{
              left: `${x}%`,
              transform: "translateX(-50%)",
              background: "linear-gradient(to bottom, #e6fbff, transparent)",
              clipPath: "polygon(35% 0, 65% 0, 100% 100%, 0 100%)",
            }}
          />
        ))}
        {/* floor markings */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(251,191,36,0.4) 2px, transparent 2px), linear-gradient(90deg, rgba(140,160,255,0.25) 1px, transparent 1px)",
            backgroundSize: "100% 44px, 120px 100%",
            transform: "perspective(300px) rotateX(50deg)",
            transformOrigin: "bottom",
            maskImage: "linear-gradient(to top, black 30%, transparent)",
            WebkitMaskImage: "linear-gradient(to top, black 30%, transparent)",
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="hud-label mb-2">hangar 01 · payload bay</p>
              <h2 className="text-3xl font-semibold glow-text sm:text-4xl">Projects</h2>
            </div>
            <p className="font-mono text-base text-ink-dim" aria-live="polite">
              payload{" "}
              <span className="text-glow-b">{String(index + 1).padStart(2, "0")}</span>
              <span className="mx-1 text-line-bright">/</span>
              {String(projects.length).padStart(2, "0")}
            </p>
          </div>

          {/* The bay aperture */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-sm border border-line-bright/40 bg-[#04060d] shadow-[0_0_120px_rgba(139,92,246,0.15),inset_0_0_80px_rgba(0,0,0,0.7)]">
              <div className="absolute inset-x-0 top-0 z-30 h-2.5" style={hazard} />
              <div className="absolute inset-x-0 bottom-0 z-30 h-2.5" style={hazard} />
              <Beacon active={busy} side="left" />
              <Beacon active={busy} side="right" />

              <Door side="left" closed={closed} />
              <Door side="right" closed={closed} />

              {/* light spill when doors part */}
              {!reduced && (
                <AnimatePresence>
                  {!closed && (
                    <motion.div
                      key={index}
                      aria-hidden
                      className="pointer-events-none absolute inset-0 z-10"
                      initial={{ opacity: 0.9 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.1, ease: "easeOut" }}
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 20%, rgba(230,251,255,0.18) 50%, transparent 80%)",
                      }}
                    />
                  )}
                </AnimatePresence>
              )}

              {/* cargo on display */}
              <div className="relative z-[5] grid min-h-[520px] items-center gap-10 p-8 pt-12 sm:p-14 lg:grid-cols-[minmax(240px,300px)_1fr]">
                {/* giant background stencil of the payload number */}
                <p
                  aria-hidden
                  className="pointer-events-none absolute -right-4 bottom-2 select-none font-mono text-[11rem] font-bold leading-none tracking-tighter text-white/[0.03]"
                >
                  {String(index + 1).padStart(2, "0")}
                </p>

                {/* emblem */}
                <div className="relative mx-auto flex h-52 w-52 items-center justify-center lg:h-64 lg:w-64">
                  <span aria-hidden className="absolute inset-0 rounded-full border border-line" />
                  <span aria-hidden className="absolute inset-4 animate-[spin_26s_linear_infinite] rounded-full border border-dashed border-glow-a/40" />
                  <span aria-hidden className="absolute inset-9 animate-[spin_18s_linear_infinite_reverse] rounded-full border border-dotted border-glow-b/30" />
                  <motion.span
                    aria-hidden
                    className="absolute inset-14 rounded-full bg-glow-a/10 blur-md"
                    animate={reduced ? undefined : { opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="font-mono text-6xl font-semibold text-gradient lg:text-7xl">
                    {project.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase()}
                  </span>
                </div>

                {/* description */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {String(project.origin) !== String(project.status) && (
                      <span className="rounded-sm border border-line px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest text-ink-dim">
                        {project.origin}
                      </span>
                    )}
                    <span
                      className={`rounded-sm border px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest ${statusStyles[project.status]}`}
                    >
                      {project.status}
                    </span>
                    <span className="font-mono text-[11px] text-ink-dim">{project.year}</span>
                  </div>
                  <h3 className="mt-4 font-mono text-3xl font-semibold text-ink sm:text-5xl">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-base text-glow-b/80 sm:text-lg">{project.tagline}</p>
                  <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-dim sm:text-base">
                    {project.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-sm border border-line px-2 py-0.5 font-mono text-[11px] text-ink-dim"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {project.liveUrl && (
                      <GlowButton href={project.liveUrl} external>
                        Live demo ↗
                      </GlowButton>
                    )}
                    {project.paperUrl && (
                      <GlowButton
                        href={project.paperUrl}
                        external
                        variant={project.liveUrl ? "ghost" : "solid"}
                      >
                        Read the paper ↗
                      </GlowButton>
                    )}
                    {project.articleUrl && (
                      <GlowButton
                        href={project.articleUrl}
                        external
                        variant={project.liveUrl || project.paperUrl ? "ghost" : "solid"}
                      >
                        Read the article ↗
                      </GlowButton>
                    )}
                    {project.github && (
                      <GlowButton href={project.github} external variant="ghost">
                        GitHub ↗
                      </GlowButton>
                    )}
                    {!project.liveUrl && !project.github && !project.paperUrl && !project.articleUrl && (
                      <p className="font-mono text-xs text-ink-dim">
                        records sealed — patent only
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
              className="absolute -left-3 top-1/2 z-40 -translate-y-1/2 rounded-sm border border-line-bright/50 bg-[#0a0c14] px-3.5 py-8 font-mono text-xl text-ink-dim transition-all hover:border-glow-b hover:text-glow-b hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] sm:-left-5"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next project"
              className="absolute -right-3 top-1/2 z-40 -translate-y-1/2 rounded-sm border border-line-bright/50 bg-[#0a0c14] px-3.5 py-8 font-mono text-xl text-ink-dim transition-all hover:border-glow-b hover:text-glow-b hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] sm:-right-5"
            >
              ▶
            </button>
          </div>

          {/* pager */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${p.name}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? "w-7 bg-glow-b shadow-[0_0_8px_rgba(34,211,238,0.7)]"
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
    </section>
  );
}
