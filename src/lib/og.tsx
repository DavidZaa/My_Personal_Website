/**
 * Shared layout for Open Graph card images (next/og ImageResponse JSX).
 * Same night-side instrument-panel look as the site itself.
 */

export const OG_SIZE = { width: 1200, height: 630 };

// Deterministic starfield — same seeded generator trick as the demo
// calendar, so the card renders identically on every build.
function stars(count: number) {
  let seed = 7;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  return Array.from({ length: count }, (_, i) => ({
    key: i,
    left: Math.round(rand() * 1200),
    top: Math.round(rand() * 630),
    size: rand() > 0.85 ? 3 : 2,
    opacity: 0.25 + rand() * 0.55,
  }));
}

const STARS = stars(90);

const HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "").host || "davidzzhang.vercel.app";
  } catch {
    return "davidzzhang.vercel.app";
  }
})();

export function OgCard({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 96px",
        backgroundColor: "#050510",
        backgroundImage:
          "radial-gradient(ellipse 90% 70% at 20% 110%, rgba(139, 92, 246, 0.28), transparent), radial-gradient(ellipse 60% 50% at 90% 0%, rgba(34, 211, 238, 0.14), transparent)",
        color: "#e6e8f5",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {STARS.map((s) => (
        <div
          key={s.key}
          style={{
            position: "absolute",
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: 9999,
            backgroundColor: "#e6e8f5",
            opacity: s.opacity,
          }}
        />
      ))}
      {/* HUD corner brackets */}
      <div style={{ position: "absolute", top: 36, left: 36, width: 40, height: 40, borderTop: "3px solid rgba(160,180,255,0.5)", borderLeft: "3px solid rgba(160,180,255,0.5)" }} />
      <div style={{ position: "absolute", bottom: 36, right: 36, width: 40, height: 40, borderBottom: "3px solid rgba(160,180,255,0.5)", borderRight: "3px solid rgba(160,180,255,0.5)" }} />

      <div
        style={{
          fontSize: 26,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: "#22d3ee",
          marginBottom: 28,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: title.length > 44 ? 60 : 76,
          fontWeight: 700,
          lineHeight: 1.1,
          maxWidth: 1000,
          textShadow: "0 0 40px rgba(139, 92, 246, 0.55)",
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div style={{ fontSize: 30, color: "#8b90b3", marginTop: 30, maxWidth: 960 }}>
          {subtitle}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 96,
          fontSize: 24,
          letterSpacing: 4,
          color: "#8b90b3",
        }}
      >
        {HOST}
      </div>
    </div>
  );
}
