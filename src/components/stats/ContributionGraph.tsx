import type { GithubStats } from "@/lib/types";

// Sequential single-hue ramp (violet), dim → bright on the dark surface.
const LEVELS = [
  "rgba(140, 160, 255, 0.08)",
  "#3b2a70",
  "#5b3fa8",
  "#8b5cf6",
  "#c4b5fd",
] as const;

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

  // A trailing month reads like a calendar page (rows of weeks, big cells);
  // anything longer falls back to the classic year strip (columns of weeks).
  const monthView = calendar.length <= 56;
  const cell = monthView ? 18 : 8;
  const gap = monthView ? 4 : 2;
  const width = (monthView ? 7 : weeks.length) * (cell + gap);
  const height = (monthView ? weeks.length : 7) * (cell + gap);

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={`GitHub contribution calendar for the past ${monthView ? "month" : "year"}`}
        className="block"
      >
        {weeks.map((week, wi) =>
          week.map((day, di) => (
            <rect
              key={day.date}
              x={(monthView ? di : wi) * (cell + gap)}
              y={(monthView ? wi : di) * (cell + gap)}
              width={cell}
              height={cell}
              rx={monthView ? 4 : 2}
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
