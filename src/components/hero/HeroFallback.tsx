import { PLANETS } from "./planets";

/**
 * Non-WebGL hero: concentric CSS orbit rings with glowing planet dots.
 * Served to reduced-motion users, small screens, and WebGL failures.
 */
export function HeroFallback({ animate = true }: { animate?: boolean }) {
  return (
    <div className="relative mx-auto aspect-square w-[min(80vw,420px)]">
      {/* sun */}
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow-warm shadow-[0_0_60px_rgba(251,191,36,0.55)]" />

      {PLANETS.map((p, i) => {
        const pct = 32 + i * 17; // ring diameter as % of container
        const duration = 26 + i * 14;
        const delay = -i * 7;
        return (
          <div
            key={p.href}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line"
            style={{ width: `${pct}%`, height: `${pct}%` }}
          >
            <div
              className="absolute inset-0"
              style={
                animate
                  ? {
                      animation: `spin ${duration}s linear infinite`,
                      animationDelay: `${delay}s`,
                    }
                  : { transform: `rotate(${i * 97}deg)` }
              }
            >
              <a
                href={p.href}
                aria-label={p.label}
                className="group absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
              >
                <span
                  className="block h-3.5 w-3.5 rounded-full transition-transform group-hover:scale-150"
                  style={{
                    backgroundColor: p.color,
                    boxShadow: `0 0 14px ${p.color}`,
                  }}
                />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
