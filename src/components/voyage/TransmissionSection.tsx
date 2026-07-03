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
 * David's log as a full-bleed navigation chart: the section IS the map —
 * an entire sector of drifting nebulae, parallax starfields, a sweeping
 * radar beam, comets, and beacons (posts) with a floating log console
 * locked over the chart.
 */

// Beacons live in the left ~70% so the floating console never covers them.
const COORDS = [
  { x: 12, y: 32 },
  { x: 30, y: 18 },
  { x: 46, y: 40 },
  { x: 63, y: 24 },
  { x: 22, y: 66 },
  { x: 54, y: 72 },
];

const STARS_FAR = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 37 + 13) % 100,
  y: (i * 53 + 29) % 100,
  r: 0.6 + ((i * 7) % 6) / 8,
  o: 0.22 + ((i * 11) % 10) / 45,
}));
const STARS_NEAR = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 61 + 7) % 100,
  y: (i * 43 + 17) % 100,
  r: 1 + ((i * 5) % 8) / 6,
  o: 0.35 + ((i * 13) % 10) / 32,
}));

function sector(i: number): string {
  const c = COORDS[i];
  return `sec ${(c.x * 1.83).toFixed(1)} · ${(c.y * 2.41).toFixed(1)}`;
}

function Comet({ delay, top, duration }: { delay: number; top: string; duration: number }) {
  return (
    <motion.span
      aria-hidden
      className="absolute h-px w-40"
      style={{
        top,
        left: "-12%",
        background:
          "linear-gradient(90deg, transparent, rgba(230,251,255,0.0) 60%, rgba(230,251,255,0.9))",
        rotate: 8,
      }}
      animate={{ x: ["0vw", "125vw"], opacity: [0, 1, 1, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: 11,
        ease: "easeIn",
        times: [0, 0.15, 0.85, 1],
      }}
    />
  );
}

function LogConsole({ post, selected }: { post: Post | null; selected: number }) {
  const reduced = useReducedMotion();
  return (
    <div className="hud-panel flex h-full flex-col rounded-sm bg-[rgba(8,10,24,0.82)] p-6 backdrop-blur-md">
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
              {post.published_at && format(new Date(post.published_at), "MMMM d, yyyy")}{" "}
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
  );
}

export function TransmissionSection({ posts }: { posts: Post[] }) {
  const entries = posts.slice(0, 6);
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const mapRef = useRef<HTMLDivElement>(null);
  const post = entries[selected] ?? null;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 14 });
  const sy = useSpring(my, { stiffness: 40, damping: 14 });
  const farX = useTransform(sx, (v) => v * 10);
  const farY = useTransform(sy, (v) => v * 10);
  const midX = useTransform(sx, (v) => v * 22);
  const midY = useTransform(sy, (v) => v * 22);
  const nearX = useTransform(sx, (v) => v * 40);
  const nearY = useTransform(sy, (v) => v * 40);

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !mapRef.current) return;
    const r = mapRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const sel = COORDS[Math.min(selected, COORDS.length - 1)];

  return (
    <section id="transmission" className="scroll-mt-16">
      {/* Full-bleed sector chart */}
      <motion.div
        ref={mapRef}
        onMouseMove={onMove}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8 }}
        className="relative min-h-[92svh] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_5rem,black_calc(100%-5rem),transparent)]"
      >
        {/* zoom-dive interior */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          initial={reduced ? false : { scale: 1.5 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* drifting nebulae */}
          <motion.div
            className="absolute -left-[6%] top-[4%] h-[75%] w-[48%] rounded-full blur-3xl"
            style={{
              x: farX,
              y: farY,
              background: "radial-gradient(ellipse, rgba(139,92,246,0.17), transparent 70%)",
            }}
            animate={reduced ? undefined : { x: [0, 34, 0], y: [0, -18, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[-4%] top-[24%] h-[70%] w-[44%] rounded-full blur-3xl"
            animate={reduced ? undefined : { x: [0, -26, 0], y: [0, 20, 0] }}
            transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "radial-gradient(ellipse, rgba(34,211,238,0.12), transparent 70%)",
            }}
          />
          <motion.div
            className="absolute bottom-[-18%] left-[26%] h-[60%] w-[42%] rounded-full blur-3xl"
            animate={reduced ? undefined : { x: [0, 18, 0], y: [0, -22, 0] }}
            transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "radial-gradient(ellipse, rgba(251,191,36,0.07), transparent 70%)",
            }}
          />

          {/* far + near star layers */}
          <motion.svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ x: farX, y: farY }}
          >
            {STARS_FAR.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.16} fill={`rgba(210,218,255,${s.o})`} />
            ))}
          </motion.svg>
          <motion.svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ x: midX, y: midY }}
          >
            {STARS_NEAR.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.2} fill={`rgba(230,240,255,${s.o})`} />
            ))}
          </motion.svg>

          {/* sector grid + rings + crosshairs */}
          <motion.div className="absolute inset-0" style={{ x: midX, y: midY }}>
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(140,160,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(140,160,255,0.6) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
              }}
            />
            <svg
              className="absolute inset-0 h-full w-full opacity-20"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <circle cx="42" cy="48" r="34" fill="none" stroke="rgba(140,160,255,0.5)" strokeWidth="0.12" strokeDasharray="0.8 1.6" />
              <circle cx="42" cy="48" r="18" fill="none" stroke="rgba(140,160,255,0.35)" strokeWidth="0.1" strokeDasharray="0.4 1.2" />
              <circle cx="42" cy="48" r="52" fill="none" stroke="rgba(140,160,255,0.3)" strokeWidth="0.1" strokeDasharray="1.4 2.4" />
              <line x1="42" y1="0" x2="42" y2="100" stroke="rgba(140,160,255,0.22)" strokeWidth="0.08" />
              <line x1="0" y1="48" x2="100" y2="48" stroke="rgba(140,160,255,0.22)" strokeWidth="0.08" />
            </svg>
          </motion.div>

          {/* radar sweep centered on the chart origin */}
          {!reduced && (
            <motion.div
              className="absolute h-[190vmin] w-[190vmin] rounded-full"
              style={{
                left: "42%",
                top: "48%",
                translateX: "-50%",
                translateY: "-50%",
                background:
                  "conic-gradient(from 0deg, rgba(34,211,238,0.09) 0deg, transparent 50deg)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* comets */}
          {!reduced && (
            <>
              <Comet delay={2} top="22%" duration={5} />
              <Comet delay={9} top="64%" duration={6.5} />
            </>
          )}
        </motion.div>

        {/* header floats over the map */}
        <div className="pointer-events-none relative z-10 pt-16 text-center">
          <p className="hud-label mb-2">star charts · captain&apos;s log</p>
          <h2 className="text-3xl font-semibold glow-text sm:text-5xl">David&apos;s Log</h2>
          <p className="mt-2 text-sm text-ink-dim">
            These are my blog posts — click one to read it.
          </p>
        </div>

        {/* map furniture */}
        <p className="hud-label absolute left-6 top-6 z-10">
          sector dz-01 · logs {entries.length}
        </p>
        <div className="hud-label absolute bottom-8 left-6 z-10 flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="text-glow-b">▲</span> galactic north
          </span>
          <span aria-hidden className="inline-flex items-center gap-1">
            <span className="inline-block h-px w-14 bg-line-bright/60" /> 1 au
          </span>
        </div>
        <p className="hud-label absolute bottom-8 right-6 z-10">
          {post ? sector(selected) : "no logs"}
          {post?.published_at && ` · ${format(new Date(post.published_at), "yyyy.MM.dd")}`}
        </p>

        {/* plotted course + reticle + beacons */}
        <motion.div className="absolute inset-0" style={{ x: nearX, y: nearY }}>
          {entries.length > 1 && (
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <motion.polyline
                points={entries.map((_, i) => `${COORDS[i].x},${COORDS[i].y}`).join(" ")}
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

          {post && (
            <motion.div
              aria-hidden
              className="absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2"
              animate={{ left: `${sel.x}%`, top: `${sel.y}%` }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 16 }}
            >
              {(["-top-0 -left-0 border-t border-l", "-top-0 -right-0 border-t border-r", "-bottom-0 -left-0 border-b border-l", "-bottom-0 -right-0 border-b border-r"] as const).map(
                (pos) => (
                  <span key={pos} className={`absolute h-4 w-4 border-glow-b/90 ${pos}`} />
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
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                <span className="relative flex h-12 w-12 items-center justify-center">
                  {!reduced && (
                    <motion.span
                      aria-hidden
                      className={`absolute inset-0 rounded-full border ${
                        isSel ? "border-glow-b" : "border-glow-a/60"
                      }`}
                      animate={{ scale: [0.45, 1.5], opacity: [0.9, 0] }}
                      transition={{
                        duration: isSel ? 1.5 : 2.8,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: i * 0.45,
                      }}
                    />
                  )}
                  <span
                    className={`h-3.5 w-3.5 rotate-45 transition-all ${
                      isSel
                        ? "scale-125 bg-glow-b shadow-[0_0_22px_rgba(34,211,238,1)]"
                        : "bg-glow-a/80 shadow-[0_0_12px_rgba(139,92,246,0.7)] group-hover:bg-glow-b"
                    }`}
                  />
                </span>
                <span
                  className={`absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap text-center font-mono text-[10px] uppercase tracking-widest transition-colors ${
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

        {/* floating console (desktop) */}
        <div className="absolute right-8 top-1/2 z-20 hidden w-[380px] -translate-y-1/2 lg:block xl:w-[420px]">
          <LogConsole post={post} selected={selected} />
        </div>

        {/* vignette depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 95% 85% at 45% 50%, transparent 55%, rgba(3,5,12,0.75))",
          }}
        />
      </motion.div>

      {/* console below the map on smaller screens */}
      <div className="relative z-10 mx-auto -mt-10 max-w-xl px-6 lg:hidden">
        <LogConsole post={post} selected={selected} />
      </div>
    </section>
  );
}
