import type { GithubStats } from "@/lib/types";

// Sequential single-hue ramp (violet), dim → bright on the dark surface.
const LEVELS = [
  "rgba(140, 160, 255, 0.08)",
  "#3b2a70",
  "#5b3fa8",
  "#8b5cf6",
  "#c4b5fd",
] as const;

const CELL = 8;
const GAP = 2;

export function ContributionGraph({
  calendar,
}: {
  calendar: GithubStats["contributionCalendar"];
}) {
  if (calendar.length === 0) return null;

  const weeks: GithubStats["contributionCalendar"][] = [];
  for (let i = 0; i < calendar.length; i += 7) {
    weeks.push(calendar.slice(i, i + 7));
  }
  const width = weeks.length * (CELL + GAP);
  const height = 7 * (CELL + GAP);

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label="GitHub contribution calendar for the past year"
        className="block"
      >
        {weeks.map((week, wi) =>
          week.map((day, di) => (
            <rect
              key={day.date}
              x={wi * (CELL + GAP)}
              y={di * (CELL + GAP)}
              width={CELL}
              height={CELL}
              rx={2}
              fill={LEVELS[day.level]}
            >
              <title>{`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}</title>
            </rect>
          )),
        )}
      </svg>
    </div>
  );
}
