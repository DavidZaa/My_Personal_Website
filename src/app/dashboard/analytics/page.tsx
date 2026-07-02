import { format } from "date-fns";
import { HudPanel } from "@/components/ui/HudPanel";
import { getPageViewsByDay, getTopPaths, getVisitorCount } from "@/lib/data";

// Bar color validated against the dark panel surface (lightness band,
// chroma, 3:1 contrast) — see cyan-600.
const BAR = "#0891b2";
const BAR_HOVER = "#22d3ee";

export default async function AnalyticsPage() {
  const [total, byDay, topPaths] = await Promise.all([
    getVisitorCount(),
    getPageViewsByDay(30),
    getTopPaths(8),
  ]);

  const max = Math.max(...byDay.map((d) => d.count), 1);
  const W = 600;
  const H = 140;
  const gap = 2;
  const barW = (W - gap * (byDay.length - 1)) / byDay.length;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <HudPanel title="Total page views">
          <p className="font-mono text-3xl font-semibold">
            {total.toLocaleString()}
          </p>
        </HudPanel>
        <HudPanel title="Last 30 days">
          <p className="font-mono text-3xl font-semibold">
            {byDay.reduce((s, d) => s + d.count, 0).toLocaleString()}
          </p>
        </HudPanel>
        <HudPanel title="Busiest day">
          <p className="font-mono text-3xl font-semibold">
            {max.toLocaleString()}
            <span className="ml-2 text-sm font-normal text-ink-dim">views</span>
          </p>
        </HudPanel>
      </div>

      <HudPanel title="Views per day · last 30">
        <svg
          viewBox={`0 0 ${W} ${H + 22}`}
          role="img"
          aria-label={`Daily page views for the last 30 days, peaking at ${max}`}
          className="w-full"
        >
          {byDay.map((d, i) => {
            const h = Math.max((d.count / max) * H, 2);
            const x = i * (barW + gap);
            return (
              <g key={d.day} className="group">
                <rect
                  x={x}
                  y={H - h}
                  width={barW}
                  height={h}
                  rx={1.5}
                  fill={BAR}
                  className="transition-colors"
                  onMouseOver={undefined}
                >
                  <title>{`${format(new Date(`${d.day}T00:00:00`), "MMM d")}: ${d.count} views`}</title>
                </rect>
                <rect
                  x={x}
                  y={0}
                  width={barW + gap}
                  height={H}
                  fill="transparent"
                  className="cursor-default [&:hover+*]:opacity-100"
                >
                  <title>{`${format(new Date(`${d.day}T00:00:00`), "MMM d")}: ${d.count} views`}</title>
                </rect>
                {i % 7 === 0 && (
                  <text
                    x={x}
                    y={H + 16}
                    fill="var(--text-dim)"
                    fontSize="9"
                    fontFamily="var(--font-telemetry), monospace"
                  >
                    {format(new Date(`${d.day}T00:00:00`), "MM/dd")}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <style>{`
          svg g.group:hover rect:first-child { fill: ${BAR_HOVER}; }
        `}</style>
      </HudPanel>

      <HudPanel title="Top signals">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="hud-label pb-2 font-normal">path</th>
              <th className="hud-label pb-2 text-right font-normal">views</th>
            </tr>
          </thead>
          <tbody>
            {topPaths.map((p) => (
              <tr key={p.path} className="border-t border-line/50">
                <td className="py-2 font-mono text-xs">{p.path}</td>
                <td className="py-2 text-right font-mono text-xs">
                  {p.count.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </HudPanel>
    </div>
  );
}
