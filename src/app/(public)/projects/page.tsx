import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { recordPageView } from "@/lib/data";
import { ProjectGrid } from "./ProjectGrid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "The full payload manifest — research, apps, civic deployments, club projects, and patents from David Zhang.",
};

export default function ProjectsPage() {
  void recordPageView("/projects");

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <p className="hud-label mb-3">payload bay · full manifest</p>
        <h1 className="text-3xl font-semibold glow-text sm:text-4xl">
          Projects
        </h1>
        <p className="mt-3 max-w-2xl text-ink-dim">
          Everything in the hold: research tooling, working apps, civic
          deployments, club builds, and patented inventions. Launch links open
          the real thing.
        </p>
      </Reveal>
      <ProjectGrid />
    </div>
  );
}
