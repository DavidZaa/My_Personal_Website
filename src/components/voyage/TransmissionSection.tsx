"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import type { Post } from "@/lib/types";

function Typewriter({ text, active }: { text: string; active: boolean }) {
  const [n, setN] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
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
    }, 28);
    return () => clearInterval(id);
  }, [active, text, reduced]);

  return (
    <span>
      {text.slice(0, n)}
      {n < text.length && <span className="animate-pulse text-glow-b">▊</span>}
    </span>
  );
}

/** Animated signal waveform under the transmission header. */
function Waveform() {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className="flex h-6 items-end gap-[3px]">
      {Array.from({ length: 32 }, (_, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-sm bg-glow-b/70"
          initial={{ height: 3 }}
          animate={
            reduced
              ? { height: 3 + ((i * 7) % 14) }
              : { height: [3, 4 + ((i * 13) % 17), 3] }
          }
          transition={
            reduced
              ? undefined
              : { duration: 0.9 + (i % 5) * 0.18, repeat: Infinity, ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}

export function TransmissionSection({ post }: { post: Post | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setActive(true),
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="transmission" className="scroll-mt-16">
      <div className="mx-auto max-w-3xl px-6">
        <div ref={ref} className="hud-panel scanlines relative overflow-hidden rounded-sm p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="hud-label flex items-center gap-2">
              <span className="live-dot" aria-hidden /> incoming transmission
            </p>
            <Waveform />
          </div>

          {post ? (
            <>
              <p className="mt-6 font-mono text-[11px] text-ink-dim">
                {post.published_at &&
                  `received ${format(new Date(post.published_at), "yyyy·MM·dd HH:mm")} UTC`}
              </p>
              <h3 className="mt-2 min-h-[2.4em] text-2xl font-semibold glow-text sm:text-3xl">
                <Typewriter text={post.title} active={active} />
              </h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={active ? { opacity: 1 } : {}}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="mt-3 text-sm leading-relaxed text-ink-dim"
              >
                {post.excerpt}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={active ? { opacity: 1 } : {}}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="mt-6 flex flex-wrap items-center gap-5"
              >
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
                  all transmissions
                </Link>
              </motion.div>
            </>
          ) : (
            <p className="mt-6 font-mono text-sm text-ink-dim">
              channel quiet — no transmissions yet
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
