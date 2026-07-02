import type { Metadata } from "next";
import { HudPanel } from "@/components/ui/HudPanel";
import { GlowButton } from "@/components/ui/GlowButton";
import { Reveal } from "@/components/ui/Reveal";
import { projects, type ProjectStatus } from "@/lib/content/projects";
import { recordPageView } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Things David Zhang has built and researched — from LLM optimization tooling to civic chatbots.",
};

const statusStyles: Record<ProjectStatus, string> = {
  active: "text-glow-b border-glow-b/40",
  shipped: "text-emerald-300 border-emerald-300/40",
  research: "text-glow-a border-glow-a/40",
};

export default function ProjectsPage() {
  void recordPageView("/projects");

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <p className="hud-label mb-3">payload bay</p>
        <h1 className="text-3xl font-semibold glow-text sm:text-4xl">
          Projects
        </h1>
        <p className="mt-3 max-w-2xl text-ink-dim">
          Research tooling, working apps, and the occasional civic deployment.
          Launch links open the real thing.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.07}>
            <HudPanel className="group flex h-full flex-col transition-colors hover:border-line-bright">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-mono text-lg font-semibold group-hover:text-glow-b">
                  {p.name}
                </h2>
                <span
                  className={`shrink-0 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${statusStyles[p.status]}`}
                >
                  {p.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-glow-b/80">{p.tagline}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-dim">
                {p.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-dim"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {(p.github || p.liveUrl) && (
                <div className="mt-5 flex gap-3">
                  {p.liveUrl && (
                    <GlowButton href={p.liveUrl} external className="!px-4 !py-1.5 text-xs">
                      Launch ↗
                    </GlowButton>
                  )}
                  {p.github && (
                    <GlowButton
                      href={p.github}
                      external
                      variant="ghost"
                      className="!px-4 !py-1.5 text-xs"
                    >
                      GitHub ↗
                    </GlowButton>
                  )}
                </div>
              )}
            </HudPanel>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
