"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { profile } from "@/lib/content/profile";
import { HeroFallback } from "./HeroFallback";

const StarSystem = dynamic(() => import("./StarSystem"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});

function supportsWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero() {
  // null = undecided (first paint, SSR-safe), then pick 3D or fallback.
  const [mode, setMode] = useState<"3d" | "fallback" | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = window.matchMedia("(max-width: 768px)").matches;
      setReduced(reducedMotion);
      setMode(!reducedMotion && !small && supportsWebgl() ? "3d" : "fallback");
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative h-[calc(100svh-3.5rem)] min-h-[540px] w-full overflow-hidden">
      {/* scene */}
      <div className="absolute inset-0">
        {mode === "3d" && <StarSystem />}
        {mode === "fallback" && (
          <div className="flex h-full items-center justify-center pt-10">
            <HeroFallback animate={!reduced} />
          </div>
        )}
      </div>

      {/* overlay copy */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 pb-14">
        <div className="mx-auto max-w-6xl px-6">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="hud-label mb-3"
          >
            los angeles · {profile.title}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.6 }}
            className="max-w-3xl text-4xl font-semibold leading-tight glow-text sm:text-6xl"
          >
            {profile.name}
            <span className="text-gradient block text-2xl font-normal sm:text-3xl">
              {profile.tagline}
            </span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.6 }}
            className="pointer-events-auto mt-7 flex flex-wrap gap-3"
          >
            <GlowButton href="/projects">View projects</GlowButton>
            <GlowButton href="/about" variant="ghost">
              About me
            </GlowButton>
          </motion.div>
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
        <span className="hud-label animate-pulse">scroll ↓</span>
      </div>
    </section>
  );
}
