"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { lockBodyScroll } from "@/lib/scrollLock";
import { GameScene, type HudState } from "./GameScene";
import { GAME_OVER_MESSAGE, saveBestScore } from "./store";

export default function FlightMode({ onExit }: { onExit: () => void }) {
  const [hud, setHud] = useState<HudState>({
    status: "start",
    score: 0,
    best: 0,
    lives: 3,
    wave: 0,
  });
  const savedBest = useRef(0);

  useEffect(() => {
    const unlock = lockBodyScroll();
    window.history.pushState({ helm: true }, "");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    const onPop = () => onExit();
    window.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
    };
  }, [onExit]);

  // Persist a new best once, when a run ends.
  useEffect(() => {
    if (hud.status === "over" && hud.best > savedBest.current) {
      savedBest.current = hud.best;
      saveBestScore(hud.best);
    }
  }, [hud.status, hud.best]);

  const lives = Array.from({ length: 3 }, (_, i) => i < hud.lives);

  return (
    <div className="fixed inset-0 z-50 bg-[#050510]">
      <Canvas
        camera={{ position: [0, 6.5, 9], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => gl.setClearColor("#050510")}
        dpr={[1, 2]}
      >
        {/* Clean field: bright key light + a distant starfield, so the ship
            and asteroids read clearly (no sun/planets crowding the play area). */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[6, 12, 4]} intensity={1.1} />
        <Stars radius={120} depth={60} count={4000} factor={3.6} saturation={0} fade speed={0.4} />
        <GameScene onHud={setHud} />
      </Canvas>

      {/* exit */}
      <button
        onClick={onExit}
        className="hud-label absolute right-5 top-5 rounded-sm border border-line-bright px-3 py-1.5 text-ink transition-colors hover:bg-white/5"
      >
        exit helm ✕
      </button>

      {/* live HUD while playing */}
      {hud.status === "playing" && (
        <div className="hud-label pointer-events-none absolute left-5 top-5 space-y-1 text-ink">
          <div>score {hud.score}</div>
          <div className="text-ink-dim">best {hud.best}</div>
          <div className="text-glow-b">
            {lives.map((alive, i) => (
              <span key={i} style={{ opacity: alive ? 1 : 0.2 }}>
                ▲
              </span>
            ))}
            <span className="ml-3 text-ink-dim">wave {hud.wave}</span>
          </div>
        </div>
      )}

      {/* start screen */}
      <AnimatePresence>
        {hud.status === "start" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <p className="hud-label mb-2 text-glow-b">take the helm</p>
            <h2 className="mb-4 text-3xl font-semibold glow-text">shoot the asteroids</h2>
            <p className="hud-label mb-1 text-ink-dim">← → turn · ↑ thrust · space fire · esc exit</p>
            <p className="hud-label mb-6 text-ink-dim">best {hud.best}</p>
            <p className="hud-label animate-pulse text-ink">press space to launch</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* game over */}
      <AnimatePresence>
        {hud.status === "over" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <p className="hud-label mb-3 text-glow-warm">game over</p>
            <p className="mb-6 max-w-md text-sm text-ink">{GAME_OVER_MESSAGE}</p>
            <p className="text-2xl font-semibold glow-text">score {hud.score}</p>
            <p className="hud-label mb-6 mt-1 text-ink-dim">best {hud.best}</p>
            <p className="hud-label animate-pulse text-ink">press space to fly again</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
