import { HudPanel } from "@/components/ui/HudPanel";
import { TelemetryNumber } from "@/components/ui/Telemetry";
import { ContributionGraph } from "@/components/stats/ContributionGraph";
import type { Counter, GithubStats, LeetcodeStats } from "@/lib/types";

export function TelemetryStrip({
  github,
  leetcode,
  counters,
  visitors,
}: {
  github: GithubStats | null;
  leetcode: LeetcodeStats | null;
  counters: Counter[];
  visitors: number;
}) {
  return (
    <HudPanel>
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        <TelemetryNumber
          value={github?.totalContributions ?? 0}
          label="contributions · yr"
          signalLost={!github}
        />
        <TelemetryNumber
          value={github?.totalCommits ?? 0}
          label="commits · yr"
          signalLost={!github}
        />
        <TelemetryNumber
          value={github?.totalStars ?? 0}
          label="stars earned"
          signalLost={!github}
        />
        <TelemetryNumber
          value={leetcode?.totalSolved ?? 0}
          label="leetcode solved"
          signalLost={!leetcode}
        />
        {counters.slice(0, 1).map((c) => (
          <TelemetryNumber
            key={c.id}
            value={c.value}
            label={c.label.toLowerCase()}
            unit={c.unit ?? undefined}
          />
        ))}
        <TelemetryNumber value={visitors} label="visitors logged" />
      </div>

      {github && github.contributionCalendar.length > 0 && (
        <div className="mt-8">
          <p className="hud-label mb-3">contribution field · trailing year</p>
          <ContributionGraph calendar={github.contributionCalendar} />
        </div>
      )}

      {github && github.topLanguages.length > 0 && (
        <div className="mt-6">
          <p className="hud-label mb-3">fuel mixture</p>
          <div
            className="flex h-2 w-full gap-[2px] overflow-hidden rounded-sm"
            role="img"
            aria-label={`Language mix: ${github.topLanguages.map((l) => `${l.name} ${l.percent}%`).join(", ")}`}
          >
            {github.topLanguages.map((l) => (
              <span
                key={l.name}
                style={{ width: `${l.percent}%`, backgroundColor: l.color }}
                title={`${l.name} ${l.percent}%`}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {github.topLanguages.map((l) => (
              <span key={l.name} className="flex items-center gap-1.5 font-mono text-[10px] text-ink-dim">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: l.color }}
                />
                {l.name} {l.percent}%
              </span>
            ))}
          </div>
        </div>
      )}
    </HudPanel>
  );
}
