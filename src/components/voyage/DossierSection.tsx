"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { Decrypt } from "@/components/voyage/Decrypt";
import { profile } from "@/lib/content/profile";

const TABS = ["Mission Log", "Research", "Decorations", "Systems", "Stations"] as const;
type Tab = (typeof TABS)[number];

function MissionLog() {
  return (
    <div className="relative space-y-6 border-l border-line pl-5">
      {profile.experience.map((job) => (
        <div key={job.org} className="relative">
          <span
            aria-hidden
            className="absolute -left-[1.6rem] top-1.5 h-2 w-2 rounded-full bg-glow-a shadow-[0_0_10px_rgba(139,92,246,0.8)]"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h4 className="text-sm font-semibold">{job.org}</h4>
            <span className="font-mono text-[10px] text-ink-dim">{job.period}</span>
          </div>
          <p className="mt-0.5 text-xs text-glow-b">{job.role}</p>
          <ul className="mt-1.5 space-y-1">
            {job.bullets.map((b) => (
              <li key={b} className="text-xs leading-relaxed text-ink-dim">{b}</li>
            ))}
          </ul>
        </div>
      ))}
      <div className="relative">
        <span aria-hidden className="absolute -left-[1.6rem] top-1.5 h-2 w-2 rounded-full bg-glow-b/60" />
        <h4 className="text-sm font-semibold">{profile.education[0].school}</h4>
        <p className="mt-0.5 text-xs text-ink-dim">{profile.education[0].degree}</p>
      </div>
    </div>
  );
}

function Research() {
  return (
    <div className="space-y-6">
      <div>
        <p className="hud-label mb-2.5">publications</p>
        <ul className="space-y-2.5">
          {profile.publications.map((p) => (
            <li key={p.title}>
              <p className="text-xs leading-snug">{p.title}</p>
              <p className="mt-0.5 font-mono text-[10px] text-ink-dim">{p.venue}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="hud-label mb-2.5">us provisional patents</p>
        <ul className="space-y-2.5">
          {profile.patents.map((p) => (
            <li key={p.id}>
              <p className="text-xs leading-snug">{p.title}</p>
              <p className="mt-0.5 font-mono text-[10px] text-ink-dim">{p.id}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Decorations() {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {profile.awards.map((a) => (
        <li key={a} className="flex items-start gap-2 text-xs leading-relaxed">
          <span aria-hidden className="text-glow-warm">✦</span>
          {a}
        </li>
      ))}
    </ul>
  );
}

function Systems() {
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {profile.skills.map((s) => (
          <span
            key={s}
            className="rounded-sm border border-line px-2 py-1 font-mono text-[11px] text-ink-dim transition-colors hover:border-glow-b/60 hover:text-ink"
          >
            {s}
          </span>
        ))}
      </div>
      <p className="mt-5 text-xs text-ink-dim">{profile.offDuty}</p>
    </div>
  );
}

function Stations() {
  return (
    <div className="space-y-4">
      {profile.clubs.map((c) => (
        <div key={c.org}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h4 className="text-sm font-semibold">{c.org}</h4>
            <span className="font-mono text-[10px] text-ink-dim">{c.period}</span>
          </div>
          <p className="mt-0.5 text-xs text-glow-b">{c.role}</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-dim">{c.detail}</p>
        </div>
      ))}
    </div>
  );
}

const PANELS: Record<Tab, () => React.JSX.Element> = {
  "Mission Log": MissionLog,
  Research: Research,
  Decorations: Decorations,
  Systems: Systems,
  Stations: Stations,
};

export function DossierSection() {
  const [tab, setTab] = useState<Tab>("Mission Log");
  const reduced = useReducedMotion();
  const Panel = PANELS[tab];

  return (
    <section id="dossier" className="scroll-mt-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[300px_1fr]">
        {/* Holographic ID card */}
        <motion.div
          initial={reduced ? false : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6 }}
          className="hud-panel scanlines relative self-start overflow-hidden rounded-sm p-6"
        >
          <div className="hud-label">personnel file · dz-01</div>
          <div className="mt-5 flex h-28 w-28 items-center justify-center rounded-sm border border-line-bright bg-gradient-to-br from-glow-a/25 to-glow-b/15">
            <span className="font-mono text-4xl font-semibold text-gradient">DZ</span>
          </div>
          <h3 className="mt-5 text-xl font-semibold glow-text">
            <Decrypt text={profile.name} />
          </h3>
          <p className="mt-1 font-mono text-[11px] text-glow-b">
            <Decrypt text={profile.title} charDelayMs={10} />
          </p>
          <dl className="mt-5 space-y-2 font-mono text-[11px]">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-dim">status</dt>
              <dd className="flex items-center gap-1.5 text-glow-b">
                <span className="live-dot" aria-hidden /> active
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-dim">coordinates</dt>
              <dd>{profile.location}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-dim">specialty</dt>
              <dd className="text-right">CS · math · linguistics</dd>
            </div>
          </dl>
          <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-ink-dim">
            {profile.bio}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <GlowButton href={profile.links.github} external variant="ghost" className="!px-3 !py-1 text-xs">
              GitHub
            </GlowButton>
            <GlowButton href={profile.links.linkedin} external variant="ghost" className="!px-3 !py-1 text-xs">
              LinkedIn
            </GlowButton>
            <GlowButton href={`mailto:${profile.links.email}`} variant="ghost" className="!px-3 !py-1 text-xs">
              Email
            </GlowButton>
          </div>
        </motion.div>

        {/* Tabbed console */}
        <motion.div
          initial={reduced ? false : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hud-panel min-h-[420px] rounded-sm p-6"
        >
          <div role="tablist" aria-label="Dossier sections" className="flex flex-wrap gap-1 border-b border-line pb-3">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                  tab === t
                    ? "bg-glow-a/20 text-glow-b"
                    : "text-ink-dim hover:bg-white/5 hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              role="tabpanel"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="pt-5"
            >
              <Panel />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
