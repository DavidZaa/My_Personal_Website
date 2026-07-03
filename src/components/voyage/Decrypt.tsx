"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "▓▒░<>/\\|=+*#@$%&";

/**
 * Text that scrambles into legibility when it enters the viewport —
 * the dossier "decrypting". Falls back to plain text under reduced
 * motion or before hydration.
 */
export function Decrypt({
  text,
  className,
  charDelayMs = 18,
}: {
  text: string;
  className?: string;
  charDelayMs?: number;
}) {
  const [shown, setShown] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || played.current) return;
      played.current = true;
      const t0 = performance.now();
      let raf = 0;
      const tick = (t: number) => {
        const resolved = Math.floor((t - t0) / charDelayMs);
        if (resolved >= text.length) {
          setShown(text);
          return;
        }
        setShown(
          text.slice(0, resolved) +
            text
              .slice(resolved)
              .split("")
              .map((c) => (c === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
              .join(""),
        );
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [text, charDelayMs]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {shown}
    </span>
  );
}
