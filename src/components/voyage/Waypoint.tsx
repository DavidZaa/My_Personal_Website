"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The seam between voyage sections: warp streaks flash past and the
 * next station's designation flies in, like passing a checkpoint.
 */
export function Waypoint({ index, label }: { index: number; label: string }) {
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto flex h-28 max-w-6xl items-center justify-center overflow-hidden px-6" aria-hidden>
      {/* warp streaks */}
      {!reduced &&
        [0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-glow-b/60 to-transparent"
            style={{ top: `${18 + i * 16}%`, width: "60%" }}
            initial={{ x: "-120%", opacity: 0 }}
            whileInView={{ x: "120%", opacity: [0, 1, 0] }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.9, delay: i * 0.06, ease: "easeIn" }}
          />
        ))}
      <motion.p
        initial={reduced ? false : { opacity: 0, letterSpacing: "0.9em" }}
        whileInView={{ opacity: 1, letterSpacing: "0.35em" }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="font-mono text-[11px] uppercase text-ink-dim"
      >
        waypoint {String(index).padStart(2, "0")} · {label}
      </motion.p>
    </div>
  );
}
