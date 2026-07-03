"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import type { Post } from "@/lib/types";

const STATIC_MS = 340;

function Typewriter({ text, active }: { text: string; active: boolean }) {
  const [n, setN] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    setN(0);
    if (!active) return;
    if (reduced) {
      const raf = requestAnimationFrame(() => setN(text.length));
      return () => cancelAnimationFrame(raf);
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, 26);
    return () => clearInterval(id);
  }, [active, text, reduced]);

  return (
    <span>
      {text.slice(0, n)}
      {n < text.length && <span className="animate-pulse text-glow-b">▊</span>}
    </span>
  );
}

/** Animated signal waveform — scrambles taller while tuning. */
function Waveform({ tuning }: { tuning: boolean }) {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className="flex h-7 items-end gap-[3px]">
      {Array.from({ length: 28 }, (_, i) => (
        <motion.span
          key={i}
          className={`w-[3px] rounded-sm ${tuning ? "bg-glow-warm/80" : "bg-glow-b/70"}`}
          initial={{ height: 3 }}
          animate={
            reduced
              ? { height: 3 + ((i * 7) % 14) }
              : tuning
                ? { height: [4, 22 - ((i * 5) % 16), 6, 18 - ((i * 3) % 12)] }
                : { height: [3, 4 + ((i * 13) % 17), 3] }
          }
          transition={
            reduced
              ? undefined
              : tuning
                ? { duration: 0.22, repeat: Infinity }
                : { duration: 0.9 + (i % 5) * 0.18, repeat: Infinity, ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}

/** Fake but stable FM frequency per channel. */
function freqFor(i: number): string {
  return (88.5 + i * 6.2).toFixed(1);
}

export function TransmissionSection({ posts }: { posts: Post[] }) {
  const channels = posts.slice(0, 4);
  const [channel, setChannel] = useState(0);
  const [tuning, setTuning] = useState(false);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const post = channels[channel] ?? null;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setActive(true),
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tune = (i: number) => {
    if (i === channel || tuning) return;
    if (reduced) {
      setChannel(i);
      return;
    }
    setTuning(true);
    setTimeout(() => {
      setChannel(i);
      setTuning(false);
    }, STATIC_MS);
  };

  return (
    <section id="transmission" className="scroll-mt-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-6 text-center">
          <p className="hud-label mb-2">ship radio · dz-fm</p>
          <h2 className="text-3xl font-semibold glow-text sm:text-4xl">
            Transmission Log
          </h2>
          <p className="mt-2 text-sm text-ink-dim">
            Dispatches written by David — tune a channel to catch a recent post.
          </p>
        </div>

        <div ref={ref} className="hud-panel scanlines relative overflow-hidden rounded-md p-0">
          {/* radio faceplate header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-[#0a0c1a]/80 px-6 py-4">
            {/* frequency display */}
            <div className="flex items-baseline gap-3 font-mono">
              <span className={`text-3xl font-semibold tabular-nums ${tuning ? "text-glow-warm" : "text-glow-b"}`}>
                {tuning ? "---.-" : freqFor(channel)}
              </span>
              <span className="text-xs text-ink-dim">MHz</span>
              <span className="ml-2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink-dim">
                <span className="live-dot" aria-hidden />
                {tuning ? "tuning…" : "signal locked"}
              </span>
            </div>
            <Waveform tuning={tuning} />
          </div>

          {/* channel selector */}
          <div className="flex flex-wrap gap-1.5 border-b border-line bg-[#080a16]/60 px-6 py-3">
            {channels.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => tune(i)}
                aria-pressed={i === channel}
                className={`rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-all ${
                  i === channel
                    ? "border-glow-b/70 bg-glow-b/15 text-glow-b shadow-[0_0_14px_rgba(34,211,238,0.3)]"
                    : "border-line text-ink-dim hover:border-glow-b/40 hover:text-ink"
                }`}
              >
                ch·{i + 1}
              </button>
            ))}
            {channels.length === 0 && (
              <p className="font-mono text-xs text-ink-dim">no channels broadcasting yet</p>
            )}
          </div>

          {/* broadcast area */}
          <div className="relative min-h-[240px] px-6 py-7 sm:px-8">
            {/* static burst while tuning */}
            {tuning && (
              <div
                aria-hidden
                className="absolute inset-0 z-10 opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(140,160,255,0.12) 0 2px, transparent 2px 5px)",
                  animation: "holo-flicker 0.2s infinite",
                }}
              />
            )}

            {post ? (
              <div className={tuning ? "opacity-20 blur-[1px]" : ""}>
                <p className="font-mono text-[11px] text-ink-dim">
                  {post.published_at &&
                    `broadcast ${format(new Date(post.published_at), "yyyy·MM·dd")}`}
                  {" · "}by David Zhang
                </p>
                <h3 className="mt-2 min-h-[2.2em] text-2xl font-semibold glow-text sm:text-3xl">
                  <Typewriter key={post.id} text={post.title} active={active && !tuning} />
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-dim">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-5">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-mono text-xs tracking-widest text-glow-b uppercase hover:underline"
                  >
                    receive full transmission →
                  </Link>
                  <Link
                    href="/blog"
                    className="font-mono text-[11px] text-ink-dim hover:text-ink"
                  >
                    browse all of David&apos;s posts
                  </Link>
                </div>
              </div>
            ) : (
              <p className="font-mono text-sm text-ink-dim">
                channel quiet — no transmissions yet
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
