"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / durationMs, 1);
          // ease-out cubic so the number settles rather than slams
          setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, durationMs]);

  return { value, ref };
}

export function TelemetryNumber({
  value,
  label,
  unit,
  signalLost = false,
}: {
  value: number;
  label: string;
  unit?: string;
  signalLost?: boolean;
}) {
  const { value: shown, ref } = useCountUp(value);

  return (
    <div className="flex flex-col gap-1">
      <span ref={ref} className="font-mono text-2xl font-semibold sm:text-3xl">
        {signalLost ? (
          <span className="text-ink-dim">— —</span>
        ) : (
          <>
            {shown.toLocaleString()}
            {unit && (
              <span className="ml-1 text-sm font-normal text-ink-dim">
                {unit}
              </span>
            )}
          </>
        )}
      </span>
      <span className="hud-label">
        {signalLost ? `${label} · signal lost` : label}
      </span>
    </div>
  );
}
