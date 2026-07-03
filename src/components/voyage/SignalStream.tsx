"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useReducedMotion } from "framer-motion";
import { GuestbookForm } from "@/components/guestbook/GuestbookForm";
import type { GuestbookEntry } from "@/lib/types";

/**
 * Guestbook comments drift across the section like slow transmissions.
 * Pure CSS keyframes (GPU-friendly); hover pauses a card so it can be
 * read. Reduced motion renders a static staggered grid instead.
 */
export function SignalStream({
  entries,
  configured,
}: {
  entries: GuestbookEntry[];
  configured: boolean;
}) {
  const reduced = useReducedMotion();
  const stream = entries.slice(0, 10);

  return (
    <section id="signals" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative h-[420px] overflow-hidden rounded-sm border border-line/60">
          {/* faint grid backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(140,160,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(140,160,255,0.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {stream.length === 0 && (
            <p className="absolute inset-0 flex items-center justify-center font-mono text-sm text-ink-dim">
              channel silent — no signals yet
            </p>
          )}

          {stream.map((e, i) => {
            const lane = (i * 37) % 78; // vertical position, %
            const duration = 26 + ((i * 11) % 18);
            const delay = -((i * 9) % duration);
            return (
              <div
                key={e.id}
                className="signal-card absolute w-64"
                style={
                  reduced
                    ? {
                        top: `${6 + (i % 4) * 24}%`,
                        left: `${4 + Math.floor(i / 4) * 33}%`,
                      }
                    : ({
                        top: `${4 + lane}%`,
                        left: 0,
                        animation: `drift ${duration}s linear infinite`,
                        animationDelay: `${delay}s`,
                      } as React.CSSProperties)
                }
              >
                <div className="hud-panel rounded-sm p-3.5 transition-shadow hover:shadow-[0_0_28px_rgba(34,211,238,0.25)]">
                  <div className="flex items-center gap-2">
                    <span aria-hidden className="font-mono text-[10px] text-glow-b">
                      ▸▸
                    </span>
                    <p className="truncate text-xs font-medium">{e.author_name}</p>
                    <p className="ml-auto shrink-0 font-mono text-[9px] text-ink-dim">
                      {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">
                    {e.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-xl">
          <div className="hud-panel rounded-sm p-5">
            <GuestbookForm configured={configured} />
          </div>
          <p className="mt-3 text-center">
            <Link
              href="/guestbook"
              className="font-mono text-[11px] text-ink-dim hover:text-glow-b"
            >
              open full channel →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
