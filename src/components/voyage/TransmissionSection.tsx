"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { Post } from "@/lib/types";

/**
 * David's log as a navigation chart: recent posts are beacons in a
 * living star map — drifting nebulae, parallax depth, a radar sweep,
 * and a targeting reticle that locks onto the selected entry.
 */

// Hand-placed so up to six beacons always read as a constellation.
const COORDS = [
  { x: 24, y: 36 },
  { x: 45, y: 20 },
  { x: 63, y: 44 },
  { x: 82, y: 28 },
  { x: 35, y: 70 },
  { x: 72, y: 74 },
];

// Deterministic star layers (no hydration mismatch).
const STARS_FAR = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 37 + 13) % 100,
  y: (i * 53 + 29) % 100,
  r: 0.6 + ((i * 7) % 6) / 8,
  o: 0.25 + ((i * 11) % 10) / 40,
}));
const STARS_NEAR = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 61 + 7) % 100,
  y: (i * 43 + 17) % 100,
  r: 1 + ((i * 5) % 8) / 6,
  o: 0.4 + ((i * 13) % 10) / 30,
}));

function sector(i: number): string {
  const c = COORDS[i];
  return `sec ${(c.x * 1.83).toFixed(1)} · ${(c.y * 2.41).toFixed(1)}`;
}

export function TransmissionSection({ posts }: { posts: Post[] }) {
  const entries = posts.slice(0, 6);
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const mapRef = useRef<HTMLDivElement>(null);
  const post = entries[selected] ?? null;

  // Pointer parallax: layers drift at different depths.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 14 });
  const sy = useSpring(my, { stiffness: 40, damping: 14 });
  const farX = useTransform(sx, (v) => v * 6);
  const farY = useTransform(sy, (v) => v * 6);
  const midX = useTransform(sx, (v) => v * 14);
  const midY = useTransform(sy, (v) => v * 14);
  const nearX = useTransform(sx, (v) => v * 26);
  const nearY = useTransform(sy, (v) => v * 26);

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !mapRef.current) return;
    const r = mapRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const sel = COORDS[Math.min(selected, COORDS.length - 1)];

  return (
    <section id="transmission" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 text-center">
          <p className="hud-label mb-2">star charts · captain&apos;s log</p>
          <h2 className="text-3xl font-semibold glow-text sm:text-4xl">
            David&apos;s Log
          </h2>
          <p className="mt-2 text-sm text-ink-dim">
            Every beacon is a post I&apos;ve written — chart a course to one.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* ══ The chart: dive into the map ══ */}
          <motion.div
            initial={reduced ? false : { scale: 1.06, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div
              ref={mapRef}
              onMouseMove={onMove}
              onMouseLeave={() => {
                mx.set(0);
                my.set(0);
              }}
              className="hud-panel relative min-h-[440px] overflow-hidden rounded-sm lg:min-h-[540px]"
            >
              {/* zoom-dive interior: everything scales in a touch harder */}
              <motion.div
                aria-hidden
                className="absolute inset-0"
                initial={reduced ? false : { scale: 1.45 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* drifting nebulae */}
                <motion.div
                  className="absolute -left-[10%] top-[5%] h-[70%] w-[55%] rounded-full blur-3xl"
                  style={{
                    x: farX,
                    y: farY,
                    background:
                      "radial-gradient(ellipse, rgba(139,92,246,0.16), transparent 70%)",
                  }}
                  animate={reduced ? undefined : { x: [0, 26, 0], y: [0, -14, 0] }}
                  transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute right-[-8%] top-[30%] h-[65%] w-[50%] rounded-full blur-3xl"
                  animate={reduced ? undefined : { x: [0, -20, 0], y: [0, 16, 0] }}
                  transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background:
                      "radial-gradient(ellipse, rgba(34,211,238,0.11), transparent 70%)",
                  }}
                />
                <motion.div
                  className="absolute bottom-[-15%] left-[30%] h-[55%] w-[45%] rounded-full blur-3xl"
                  animate={reduced ? undefined : { x: [0, 14, 0], y: [0, -18, 0] }}
                  transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background:
                      "radial-gradient(ellipse, rgba(251,191,36,0.06), transparent 70%)",
                  }}
                />

                {/* far stars */}
                <motion.svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ x: farX, y: farY }}
                >
                  {STARS_FAR.map((s, i) => (
                    <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.22} fill={`rgba(210,218,255,${s.o})`} />
                  ))}
                </motion.svg>
                {/* near stars */}
                <motion.svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ x: midX, y: midY }}
                >
                  {STARS_NEAR.map((s, i) => (
                    <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.28} fill={`rgba(230,240,255,${s.o})`} />
                  ))}
                </motion.svg>

                {/* chart grid + sector ring + crosshairs */}
                <motion.div className="absolute inset-0" style={{ x: midX, y: midY }}>
                  <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(140,160,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(140,160,255,0.6) 1px, transparent 1px)",
                      backgroundSize: "52px 52px",
                    }}
                  />
                  <svg
                    className="absolute inset-0 h-full w-full opacity-25"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(140,160,255,0.5)" strokeWidth="0.15" strokeDasharray="0.8 1.6" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(140,160,255,0.35)" strokeWidth="0.12" strokeDasharray="0.4 1.2" />
                    <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(140,160,255,0.25)" strokeWidth="0.1" />
                    <line x1="2" y1="50" x2="98" y2="50" stroke="rgba(140,160,255,0.25)" strokeWidth="0.1" />
                  </svg>
                </motion.div>

                {/* radar sweep */}
                {!reduced && (
                  <motion.div
                    className="absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 0deg, rgba(34,211,238,0.10) 0deg, transparent 55deg)",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </motion.div>

              {/* corner readouts */}
              <p className="hud-label absolute left-4 top-3 z-10">
                sector dz-01 · logs {entries.length}
              </p>
              <p className="hud-label absolute bottom-3 right-4 z-10">
                {post ? sector(selected) : "no logs"}
                {post?.published_at &&
                  ` · ${format(new Date(post.published_at), "yyyy.MM.dd")}`}
              </p>

              {/* plotted course + beacons layer (nearest depth) */}
              <motion.div className="absolute inset-0" style={{ x: nearX, y: nearY }}>
                {entries.length > 1 && (
                  <svg
                    aria-hidden
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <motion.polyline
                      points={entries.map((_, i) => `${COORDS[i].x},${COORDS[i].y + 4}`).join(" ")}
                      fill="none"
                      stroke="rgba(34,211,238,0.45)"
                      strokeWidth="0.3"
                      strokeDasharray="1.4 2"
                      vectorEffect="non-scaling-stroke"
                      animate={reduced ? undefined : { strokeDashoffset: [0, -34] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    />
                  </svg>
                )}

                {/* targeting reticle locks onto the selected beacon */}
                {post && (
                  <motion.div
                    aria-hidden
                    className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2"
                    animate={{ left: `${sel.x}%`, top: `${sel.y + 4}%` }}
                    transition={
                      reduced ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 16 }
                    }
                  >
                    {(["-top-0 -left-0 border-t border-l", "-top-0 -right-0 border-t border-r", "-bottom-0 -left-0 border-b border-l", "-bottom-0 -right-0 border-b border-r"] as const).map(
                      (pos) => (
                        <span
                          key={pos}
                          className={`absolute h-3.5 w-3.5 border-glow-b/90 ${pos}`}
                        />
                      ),
                    )}
                    {!reduced && (
                      <motion.span
                        className="absolute inset-0 rounded-full border border-dashed border-glow-b/30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </motion.div>
                )}

                {/* beacons */}
                {entries.map((p, i) => {
                  const c = COORDS[i];
                  const isSel = i === selected;
                  const isLatest = i === 0;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelected(i)}
                      aria-pressed={isSel}
                      aria-label={`Open log: ${p.title}`}
                      className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${c.x}%`, top: `${c.y + 4}%` }}
                    >
                      <span className="relative flex h-11 w-11 items-center justify-center">
                        {!reduced && (
                          <motion.span
                            aria-hidden
                            className={`absolute inset-0 rounded-full border ${
                              isSel ? "border-glow-b" : "border-glow-a/60"
                            }`}
                            animate={{ scale: [0.45, 1.4], opacity: [0.9, 0] }}
                            transition={{
                              duration: isSel ? 1.5 : 2.8,
                              repeat: Infinity,
                              ease: "easeOut",
                              delay: i * 0.45,
                            }}
                          />
                        )}
                        <span
                          className={`h-3 w-3 rotate-45 transition-all ${
                            isSel
                              ? "scale-125 bg-glow-b shadow-[0_0_20px_rgba(34,211,238,1)]"
                              : "bg-glow-a/80 shadow-[0_0_10px_rgba(139,92,246,0.7)] group-hover:bg-glow-b"
                          }`}
                        />
                      </span>
                      <span
                        className={`absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap text-center font-mono text-[9px] uppercase tracking-widest transition-colors ${
                          isSel ? "text-glow-b" : "text-ink-dim group-hover:text-ink"
                        }`}
                      >
                        log {String(entries.length - i).padStart(2, "0")}
                        {isLatest && " · latest"}
                        <span className="block text-[8px] normal-case tracking-normal text-ink-dim/70">
                          {sector(i)}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </motion.div>

              {entries.length === 0 && (
                <p className="absolute inset-0 flex items-center justify-center font-mono text-sm text-ink-dim">
                  chart empty — no logs filed yet
                </p>
              )}

              {/* vignette so the map reads deep */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, rgba(3,5,12,0.8))",
                }}
              />
            </div>
          </motion.div>

          {/* ══ The log console ══ */}
          <div className="hud-panel flex flex-col rounded-sm p-6">
            <p className="hud-label">log entry console</p>
            <AnimatePresence mode="wait">
              {post ? (
                <motion.div
                  key={post.id}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-1 flex-col"
                >
                  <p className="mt-4 font-mono text-[11px] text-glow-b/80">
                    {post.published_at &&
                      format(new Date(post.published_at), "MMMM d, yyyy")}{" "}
                    · logged by David Zhang
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                    {sector(selected)} · beacon locked
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold leading-snug glow-text">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-dim">
                    {post.excerpt}
                  </p>
                  <div className="mt-6 space-y-2.5">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block font-mono text-xs uppercase tracking-widest text-glow-b hover:underline"
                    >
                      read this entry →
                    </Link>
                    <Link
                      href="/blog"
                      className="block font-mono text-[11px] text-ink-dim hover:text-ink"
                    >
                      open the full log archive
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <p className="mt-4 font-mono text-sm text-ink-dim">
                  no entries yet — first log coming soon
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
