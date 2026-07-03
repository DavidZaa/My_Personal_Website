"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  depth: number; // 0..1 — deeper stars move less and glow dimmer
  r: number;
  twinkle: number;
}

/**
 * The persistent backdrop for the whole voyage: a fixed canvas of stars
 * that parallax against scroll (deep stars drift slower), with a gentle
 * twinkle. Cheap by design — one canvas, ~180 dots, no WebGL — so it can
 * sit behind every section without hurting scroll performance.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let raf = 0;
    let running = true;

    const seed = (w: number, h: number) => {
      const count = Math.min(200, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 1.4,
        depth: Math.random(),
        r: 0.4 + Math.random() * 1.1,
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(window.innerWidth, window.innerHeight);
    };

    const draw = (t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scroll = window.scrollY;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        // Parallax: shallow stars (depth→1) track scroll more.
        const y = (((s.y - scroll * (0.05 + s.depth * 0.18)) % (h * 1.4)) + h * 1.4) % (h * 1.4) - h * 0.2;
        const alpha = reduced
          ? 0.35 + s.depth * 0.4
          : (0.25 + s.depth * 0.45) * (0.75 + 0.25 * Math.sin(t / 900 + s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, y, s.r + s.depth * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 218, 255, ${alpha})`;
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      // Single static render + reposition on scroll end only.
      draw(0);
      const onScroll = () => draw(0);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
      };
    }

    raf = requestAnimationFrame(loop);
    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) raf = requestAnimationFrame(loop);
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
