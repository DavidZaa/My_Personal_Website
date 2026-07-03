"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The approach corridor between the star system and the cargo hold:
 * space gradually gives way to hull, guide rails converge toward the
 * hangar, and descent chevrons pulse downward. Makes entering the
 * dossier feel like docking rather than hitting a wall.
 */
export function DescentTransition() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className="relative -mb-10 h-[38vh] min-h-[240px] overflow-hidden">
      {/* space fading into hull color */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(6,11,14,0.55) 55%, #060b0e 100%)",
        }}
      />

      {/* converging guide rails */}
      {[-1, 1].map((dir) => (
        <div
          key={dir}
          className="absolute bottom-0 top-[15%] w-px"
          style={{
            left: `calc(50% + ${dir * 34}%)`,
            transform: `rotate(${dir * 16}deg)`,
            transformOrigin: "bottom",
            background:
              "repeating-linear-gradient(to bottom, rgba(34,211,238,0.55) 0 6px, transparent 6px 18px)",
            maskImage: "linear-gradient(to bottom, transparent, black 40%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 40%)",
          }}
        />
      ))}

      {/* descent chevrons */}
      <div className="absolute left-1/2 top-[30%] flex -translate-x-1/2 flex-col items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="font-mono text-lg leading-none text-glow-b"
            initial={{ opacity: 0.15 }}
            animate={reduced ? { opacity: 0.5 } : { opacity: [0.15, 1, 0.15] }}
            transition={
              reduced
                ? undefined
                : { duration: 1.6, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }
            }
          >
            ˅
          </motion.span>
        ))}
      </div>

      {/* approach label */}
      <motion.p
        initial={reduced ? false : { opacity: 0, letterSpacing: "0.8em" }}
        whileInView={{ opacity: 1, letterSpacing: "0.35em" }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.7 }}
        className="absolute bottom-[18%] left-1/2 w-full -translate-x-1/2 text-center font-mono text-[11px] uppercase text-ink-dim"
      >
        waypoint 02 · docking — crew deck
      </motion.p>

      {/* hangar aperture glow where the hold begins */}
      <div
        className="absolute inset-x-0 bottom-0 h-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 100% at 50% 100%, rgba(34,211,238,0.14), transparent)",
        }}
      />
    </div>
  );
}
