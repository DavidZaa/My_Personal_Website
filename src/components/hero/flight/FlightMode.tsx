"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { lockBodyScroll } from "@/lib/scrollLock";
import { PLANETS } from "../planets";
import { OrbitRing, PlanetBody, Sun } from "../SystemBodies";
import { Ship } from "./Ship";
import { SatelliteBody } from "./SatelliteBody";
import { SATELLITE_MESSAGE, hasFoundSatellite, markSatelliteFound } from "./satellite";

export default function FlightMode({ onExit }: { onExit: () => void }) {
  const [outOfBounds, setOutOfBounds] = useState(false);
  const [signal, setSignal] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Lock scroll, trap ESC, and make browser Back exit instead of leaving.
  useEffect(() => {
    const unlock = lockBodyScroll();
    window.history.pushState({ helm: true }, "");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    const onPop = () => onExit();
    window.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);

    const hintTimer = window.setTimeout(() => setShowHint(false), 5000);

    return () => {
      unlock();
      window.clearTimeout(hintTimer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
    };
  }, [onExit]);

  const onNearSatellite = () => {
    if (hasFoundSatellite()) return;
    markSatelliteFound();
    setSignal(true);
    window.setTimeout(() => setSignal(false), 9000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050510]">
      <Canvas
        camera={{ position: [0, 4.5, 9], fov: 55 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => gl.setClearColor("#050510")}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.25} />
        <Stars radius={80} depth={50} count={3200} factor={3.4} saturation={0} fade speed={0.5} />
        <Sun />
        {PLANETS.map((p) => (
          <group key={p.href}>
            <OrbitRing radius={p.orbit} />
            <PlanetBody spec={p} />
          </group>
        ))}
        <SatelliteBody />
        <Ship onBoundary={setOutOfBounds} onNearSatellite={onNearSatellite} />
      </Canvas>

      {/* exit */}
      <button
        onClick={onExit}
        className="hud-label absolute right-5 top-5 rounded-sm border border-line-bright px-3 py-1.5 text-ink transition-colors hover:bg-white/5"
      >
        exit helm ✕
      </button>

      {/* controls hint — fades after a few seconds */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="hud-label pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-ink-dim"
          >
            W / ↑ thrust · A D / ← → steer · S / ↓ brake · mouse to fly · esc to exit
          </motion.div>
        )}
      </AnimatePresence>

      {/* soft boundary warning */}
      <AnimatePresence>
        {outOfBounds && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="hud-label pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 text-glow-warm"
          >
            leaving charted space — turning back
          </motion.div>
        )}
      </AnimatePresence>

      {/* easter-egg transmission */}
      <AnimatePresence>
        {signal && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute bottom-20 left-1/2 w-[min(90vw,520px)] -translate-x-1/2 rounded-sm border border-line-bright bg-black/60 px-5 py-4 text-center backdrop-blur"
          >
            <p className="hud-label mb-1 text-glow-b">incoming transmission</p>
            <p className="text-sm text-ink">{SATELLITE_MESSAGE}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
