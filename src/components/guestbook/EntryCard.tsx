"use client";

/* eslint-disable @next/next/no-img-element */

import { motion, useReducedMotion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import type { GuestbookEntry } from "@/lib/types";

export function EntryCard({
  entry,
  index,
}: {
  entry: GuestbookEntry;
  index: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: Math.min(index * 0.06, 0.6), duration: 0.4 }}
      className="hud-panel rounded-sm p-4"
    >
      <div className="flex items-center gap-3">
        {entry.author_avatar ? (
          <img
            src={entry.author_avatar}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-full border border-line"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-full border border-line font-mono text-xs text-glow-b"
          >
            {entry.author_name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{entry.author_name}</p>
          <p className="font-mono text-[10px] text-ink-dim">
            {formatDistanceToNow(new Date(entry.created_at), {
              addSuffix: true,
            })}
          </p>
        </div>
        <span aria-hidden className="ml-auto text-ink-dim/40">📡</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-dim">
        {entry.message}
      </p>
    </motion.li>
  );
}
