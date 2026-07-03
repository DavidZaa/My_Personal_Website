import type { Metadata } from "next";
import { HudPanel } from "@/components/ui/HudPanel";
import { GlowButton } from "@/components/ui/GlowButton";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/lib/content/profile";
import { recordPageView } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "David Zhang — CS & Math of Computation at UCLA. Experience, research, publications, and awards.",
};

export default function AboutPage() {
  void recordPageView("/about");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Reveal>
        <p className="hud-label mb-3">crew file · 001</p>
        <h1 className="text-3xl font-semibold glow-text sm:text-4xl">
          {profile.name}
        </h1>
        <p className="mt-2 font-mono text-sm text-glow-b">{profile.title}</p>
        <p className="mt-5 max-w-2xl leading-relaxed text-ink-dim">
          {profile.bio}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <GlowButton href={profile.links.github} external variant="ghost">
            GitHub
          </GlowButton>
          <GlowButton href={profile.links.linkedin} external variant="ghost">
            LinkedIn
          </GlowButton>
          <GlowButton href={`mailto:${profile.links.email}`} variant="ghost">
            Email
          </GlowButton>
        </div>
      </Reveal>

      {/* Education */}
      <Reveal className="mt-16">
        <p className="hud-label mb-4">education</p>
        {profile.education.map((e) => (
          <HudPanel key={e.school}>
            <h2 className="font-semibold">{e.school}</h2>
            <p className="mt-1 text-sm text-ink-dim">{e.degree}</p>
          </HudPanel>
        ))}
      </Reveal>

      {/* Experience — mission log */}
      <section className="mt-16">
        <Reveal>
          <p className="hud-label mb-6">mission log</p>
        </Reveal>
        <div className="relative space-y-8 border-l border-line pl-6">
          {profile.experience.map((job, i) => (
            <Reveal key={job.org} delay={i * 0.05}>
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full bg-glow-a shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h2 className="font-semibold">{job.org}</h2>
                  <span className="font-mono text-xs text-ink-dim">
                    {job.period}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-glow-b">{job.role}</p>
                <ul className="mt-2 space-y-1.5">
                  {job.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-sm leading-relaxed text-ink-dim"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Campus involvement */}
      <Reveal className="mt-16">
        <p className="hud-label mb-4">active stations · ucla</p>
        <div className="grid gap-5 md:grid-cols-3">
          {profile.clubs.map((c) => (
            <HudPanel key={c.org} className="h-full">
              <h2 className="text-sm font-semibold">{c.org}</h2>
              <p className="mt-0.5 text-xs text-glow-b">{c.role}</p>
              <p className="mt-0.5 font-mono text-[10px] text-ink-dim">
                {c.period}
              </p>
              <p className="mt-2.5 text-xs leading-relaxed text-ink-dim">
                {c.detail}
              </p>
            </HudPanel>
          ))}
        </div>
      </Reveal>

      {/* Publications & patents */}
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <Reveal>
          <HudPanel title="Publications" className="h-full">
            <ul className="space-y-3">
              {profile.publications.map((p) => (
                <li key={p.title}>
                  <p className="text-sm leading-snug">{p.title}</p>
                  <p className="mt-0.5 font-mono text-xs text-ink-dim">
                    {p.venue}
                  </p>
                </li>
              ))}
            </ul>
          </HudPanel>
        </Reveal>
        <Reveal delay={0.08}>
          <HudPanel title="US Provisional Patents" className="h-full">
            <ul className="space-y-3">
              {profile.patents.map((p) => (
                <li key={p.id}>
                  <p className="text-sm leading-snug">{p.title}</p>
                  <p className="mt-0.5 font-mono text-xs text-ink-dim">{p.id}</p>
                </li>
              ))}
            </ul>
          </HudPanel>
        </Reveal>
      </div>

      {/* Awards */}
      <Reveal className="mt-6">
        <HudPanel title="Decorations">
          <ul className="grid gap-2 sm:grid-cols-2">
            {profile.awards.map((a) => (
              <li key={a} className="flex items-center gap-2 text-sm">
                <span aria-hidden className="text-glow-warm">✦</span>
                {a}
              </li>
            ))}
          </ul>
        </HudPanel>
      </Reveal>

      {/* Skills */}
      <Reveal className="mt-6">
        <HudPanel title="Systems fluency">
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span
                key={s}
                className="rounded-sm border border-line px-2 py-1 font-mono text-xs text-ink-dim transition-colors hover:border-line-bright hover:text-ink"
              >
                {s}
              </span>
            ))}
          </div>
        </HudPanel>
      </Reveal>

      <Reveal className="mt-10">
        <p className="text-center text-sm text-ink-dim">{profile.offDuty}</p>
      </Reveal>
    </div>
  );
}
