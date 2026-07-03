import Link from "next/link";
import { BootSequence } from "@/components/boot/BootSequence";
import { Hero } from "@/components/hero/Hero";
import { HudPanel } from "@/components/ui/HudPanel";
import { GlowButton } from "@/components/ui/GlowButton";
import { Reveal } from "@/components/ui/Reveal";
import { TelemetryStrip } from "@/components/stats/TelemetryStrip";
import { featuredProjects } from "@/lib/content/projects";
import { profile } from "@/lib/content/profile";
import {
  getCounters,
  getGithubStats,
  getLeetcodeStats,
  getNowStatus,
  getVisitorCount,
  recordPageView,
} from "@/lib/data";

export default async function Home() {
  const [github, leetcode, counters, visitors, now] = await Promise.all([
    getGithubStats(),
    getLeetcodeStats(),
    getCounters(),
    getVisitorCount(),
    getNowStatus(),
  ]);
  void recordPageView("/");

  return (
    <>
      <BootSequence />
      <Hero />

      <div className="mx-auto max-w-6xl space-y-24 px-6 pb-8 pt-20">
        {/* About teaser */}
        <Reveal>
          <section className="grid gap-8 md:grid-cols-[2fr_1fr]">
            <div>
              <p className="hud-label mb-3">crew file · 001</p>
              <h2 className="text-2xl font-semibold sm:text-3xl">
                Research-brained, ship-hearted.
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-ink-dim">
                {profile.bio}
              </p>
              <div className="mt-6">
                <GlowButton href="/about" variant="ghost">
                  Full crew file →
                </GlowButton>
              </div>
            </div>
            <HudPanel title="Currently" className="self-start">
              <p className="text-sm leading-relaxed">{now.focus}</p>
              <p className="mt-3 text-sm text-ink-dim">
                Building: {now.building}
              </p>
              <Link
                href="/now"
                className="mt-4 inline-block font-mono text-xs text-glow-b hover:underline"
              >
                live feed →
              </Link>
            </HudPanel>
          </section>
        </Reveal>

        {/* Featured projects */}
        <section>
          <Reveal>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="hud-label mb-3">payload bay</p>
                <h2 className="text-2xl font-semibold sm:text-3xl">
                  Featured projects
                </h2>
              </div>
              <Link
                href="/projects"
                className="font-mono text-xs text-ink-dim hover:text-glow-b"
              >
                all projects →
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <HudPanel className="group h-full transition-colors hover:border-line-bright">
                  <div className="flex h-full flex-col">
                    <h3 className="font-mono text-base font-semibold group-hover:text-glow-b">
                      {p.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-dim">
                      {p.tagline}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tech.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-dim"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </HudPanel>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Telemetry strip */}
        <Reveal>
          <section>
            <p className="hud-label mb-3">telemetry</p>
            <TelemetryStrip
              github={github}
              leetcode={leetcode}
              counters={counters}
              visitors={visitors}
            />
          </section>
        </Reveal>

        {/* Guestbook CTA */}
        <Reveal>
          <section className="pb-8 text-center">
            <p className="hud-label mb-3">open channel</p>
            <h2 className="text-2xl font-semibold">Passing through?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-ink-dim">
              Leave a signal in the guestbook — every entry shows up as a
              satellite in this system&apos;s orbit.
            </p>
            <div className="mt-6">
              <GlowButton href="/guestbook">Sign the guestbook</GlowButton>
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}
