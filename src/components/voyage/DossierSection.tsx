"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { Decrypt } from "@/components/voyage/Decrypt";
import { HoloModal } from "@/components/voyage/HoloModal";
import { profile } from "@/lib/content/profile";

const TABS = ["Experiences", "Publications", "Awards", "Systems", "Clubs"] as const;
type Tab = (typeof TABS)[number];

type Experience = (typeof profile.experience)[number];
type Award = (typeof profile.awards)[number];

type ModalRecord =
  | { kind: "experience"; data: Experience }
  | { kind: "award"; data: Award };

/** Trim to a teaser that always ends in an ellipsis. */
function teaser(text: string, max = 84): string {
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 40))}…`;
}

function Experiences({ onOpen }: { onOpen: (r: ModalRecord) => void }) {
  return (
    <ul className="space-y-2">
      {profile.experience.map((job) => (
        <li key={job.org}>
          <button
            type="button"
            onClick={() => onOpen({ kind: "experience", data: job })}
            className="w-full rounded-sm border border-glow-b/20 p-3 text-left transition-colors hover:border-glow-b/60 hover:bg-glow-b/5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <span className="text-sm font-semibold text-[#e6fbff]">{job.org}</span>
              <span className="font-mono text-[10px] text-glow-b/70">{job.period}</span>
            </div>
            <p className="mt-0.5 text-xs text-glow-b">{job.role}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-dim">
              {teaser(job.bullets[0])}
            </p>
            <span className="mt-1.5 inline-block font-mono text-[9px] uppercase tracking-widest text-glow-b/60">
              tap to expand record
            </span>
          </button>
        </li>
      ))}
      <li className="rounded-sm border border-glow-b/10 p-3">
        <p className="text-sm font-semibold text-[#e6fbff]">{profile.education[0].school}</p>
        <p className="mt-0.5 text-xs text-ink-dim">{profile.education[0].degree}</p>
      </li>
    </ul>
  );
}

function Awards({ onOpen }: { onOpen: (r: ModalRecord) => void }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {profile.awards.map((a) => (
        <li key={a.title} className="min-w-0">
          <button
            type="button"
            onClick={() => onOpen({ kind: "award", data: a })}
            className="flex h-full w-full flex-col rounded-sm border border-glow-b/20 p-3 text-left transition-colors hover:border-glow-b/60 hover:bg-glow-b/5"
          >
            <div className="flex items-start gap-2">
              <span aria-hidden className="mt-px shrink-0 text-glow-warm">✦</span>
              <p className="line-clamp-2 min-h-[2em] text-xs font-semibold leading-snug text-[#e6fbff]">
                {a.title}
              </p>
            </div>
            <p className="mt-1 truncate pl-5 font-mono text-[10px] text-glow-b/70">
              {a.meta ?? "—"}
            </p>
            <p className="mt-1 line-clamp-2 flex-1 pl-5 text-[11px] leading-snug text-ink-dim">
              {a.detail ? teaser(a.detail, 72) : ""}
            </p>
            <span className="mt-2 pl-5 font-mono text-[9px] uppercase tracking-widest text-glow-b/60">
              tap to expand record
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function Publications() {
  return (
    <div className="space-y-6">
      <div>
        <p className="hud-label mb-2.5 !text-glow-b/70">publications</p>
        <ul className="space-y-2.5">
          {profile.publications.map((p) => (
            <li key={p.title}>
              <p className="text-xs leading-snug text-[#e6fbff]">{p.title}</p>
              <p className="mt-0.5 font-mono text-[10px] text-ink-dim">{p.venue}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="hud-label mb-2.5 !text-glow-b/70">us provisional patents</p>
        <ul className="space-y-2.5">
          {profile.patents.map((p) => (
            <li key={p.id}>
              <p className="text-xs leading-snug text-[#e6fbff]">{p.title}</p>
              <p className="mt-0.5 font-mono text-[10px] text-ink-dim">{p.id}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Systems() {
  return (
    <div className="space-y-6">
      <div>
        <p className="hud-label mb-2.5 !text-glow-b/70">completed coursework</p>
        <div className="space-y-3.5">
          {Object.entries(profile.coursework).map(([subject, classes]) => (
            <div key={subject}>
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                {subject}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {classes.map((c) => (
                  <span
                    key={c}
                    className="rounded-sm border border-glow-b/30 px-2 py-1 font-mono text-[11px] text-[#c6eef7] transition-colors hover:border-glow-b"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="hud-label mb-2.5 !text-glow-b/70">tooling & skills</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.skills.map((s) => (
            <span
              key={s}
              className="rounded-sm border border-glow-b/20 px-2 py-1 font-mono text-[11px] text-ink-dim transition-colors hover:border-glow-b hover:text-[#e6fbff]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Clubs() {
  return (
    <div className="space-y-4">
      {profile.clubs.map((c) => (
        <div key={c.org}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h4 className="text-sm font-semibold text-[#e6fbff]">{c.org}</h4>
            <span className="font-mono text-[10px] text-glow-b/70">{c.period}</span>
          </div>
          <p className="mt-0.5 text-xs text-glow-b">{c.role}</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-dim">{c.detail}</p>
        </div>
      ))}
    </div>
  );
}

/** Rows of storage containers receding along one wall of the hold. */
function ContainerWall({ side }: { side: "left" | "right" }) {
  const flip = side === "right";
  return (
    <div
      aria-hidden
      className="absolute top-[8%] hidden h-[70%] w-40 md:block"
      style={{
        [side]: "-0.5rem",
        perspective: "700px",
        maskImage: `linear-gradient(to ${flip ? "left" : "right"}, black 30%, transparent 95%)`,
        WebkitMaskImage: `linear-gradient(to ${flip ? "left" : "right"}, black 30%, transparent 95%)`,
      } as React.CSSProperties}
    >
      <div
        className="grid h-full grid-rows-6 gap-2"
        style={{ transform: `rotateY(${flip ? -38 : 38}deg)` }}
      >
        {Array.from({ length: 6 }, (_, r) => (
          <div key={r} className="flex gap-2">
            {Array.from({ length: 3 }, (_, c) => (
              <div
                key={c}
                className="relative flex-1 rounded-[2px] border border-[#1b3a3f] bg-gradient-to-b from-[#0d1b20] to-[#081014]"
              >
                <span
                  className="absolute right-1 top-1 h-1 w-1 rounded-full"
                  style={{
                    backgroundColor: (r * 3 + c) % 4 === 0 ? "#34d399" : "#1f4d55",
                    boxShadow: (r * 3 + c) % 4 === 0 ? "0 0 4px #34d399" : "none",
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Projection cone + emitter that a hologram "stands" on. */
function HoloEmitter() {
  return (
    <div aria-hidden className="relative mx-auto -mt-px flex h-14 w-full flex-col items-center">
      <div
        className="h-10 w-3/4"
        style={{
          clipPath: "polygon(0 0, 100% 0, 56% 100%, 44% 100%)",
          background:
            "linear-gradient(to bottom, rgba(34,211,238,0.16), rgba(34,211,238,0.5))",
        }}
      />
      <div className="h-1.5 w-16 rounded-full bg-[#0d1b20] shadow-[0_0_18px_rgba(34,211,238,0.8)] ring-1 ring-glow-b/60" />
    </div>
  );
}

export function DossierSection() {
  const [tab, setTab] = useState<Tab>("Experiences");
  const [record, setRecord] = useState<ModalRecord | null>(null);
  const reduced = useReducedMotion();

  return (
    <section id="dossier" className="scroll-mt-16">
      {/* The cargo hold: its own room, deliberately not open space.
          Top edge fades in from open space so there's no hard seam. */}
      <div className="relative overflow-hidden border-b border-[#12262c] bg-[#060b0e] pb-16 pt-36 [mask-image:linear-gradient(to_bottom,transparent,black_22rem)]">
        {/* back-wall fog + overhead light shafts */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 45% at 50% 28%, rgba(20,55,60,0.4), transparent 70%), radial-gradient(ellipse 90% 30% at 50% 100%, rgba(10,25,30,0.9), transparent 70%)",
          }}
        />
        {[18, 50, 82].map((x) => (
          <div
            key={x}
            aria-hidden
            className="absolute top-0 h-3/4 w-24 opacity-[0.06]"
            style={{
              left: `${x}%`,
              background: "linear-gradient(to bottom, #67e8f9, transparent)",
              transform: "skewX(-6deg)",
            }}
          />
        ))}
        {/* floor grid, receding */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-48 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(52,211,153,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.35) 1px, transparent 1px)",
            backgroundSize: "56px 28px",
            transform: "perspective(320px) rotateX(55deg)",
            transformOrigin: "bottom",
            maskImage: "linear-gradient(to top, black 20%, transparent)",
            WebkitMaskImage: "linear-gradient(to top, black 20%, transparent)",
          }}
        />
        <ContainerWall side="left" />
        <ContainerWall side="right" />

        <div className="relative mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-[280px_1fr] md:px-16">
          {/* ID card hologram on its emitter */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.6 }}
            className="self-end"
          >
            <div className={`holo-panel rounded-sm p-6 ${reduced ? "" : "holo-flicker"}`}>
              <div className="hud-label !text-glow-b/70">personnel hologram · dz-01</div>
              <div className="mt-5 flex h-24 w-24 items-center justify-center rounded-sm border border-glow-b/50 bg-glow-b/10">
                <span className="font-mono text-3xl font-semibold text-glow-b">DZ</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[#e6fbff] glow-text">
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
                  <dd className="text-[#e6fbff]">{profile.location}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-dim">specialty</dt>
                  <dd className="text-right text-[#e6fbff]">CS · math · linguistics</dd>
                </div>
              </dl>
              <p className="mt-5 border-t border-glow-b/20 pt-4 text-xs leading-relaxed text-ink-dim">
                {profile.bio}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <GlowButton href={profile.links.github} external variant="ghost" className="!border-glow-b/40 !px-3 !py-1 text-xs">
                  GitHub
                </GlowButton>
                <GlowButton href={profile.links.linkedin} external variant="ghost" className="!border-glow-b/40 !px-3 !py-1 text-xs">
                  LinkedIn
                </GlowButton>
                <GlowButton href={`mailto:${profile.links.email}`} variant="ghost" className="!border-glow-b/40 !px-3 !py-1 text-xs">
                  Email
                </GlowButton>
              </div>
            </div>
            <HoloEmitter />
          </motion.div>

          {/* Records hologram: fixed height, scrolls internally */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="flex flex-col self-end"
          >
            <div role="tablist" aria-label="Dossier records" className="mb-3 flex flex-wrap gap-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-all ${
                    tab === t
                      ? "border-glow-b/70 bg-glow-b/15 text-glow-b shadow-[0_0_16px_rgba(34,211,238,0.3)]"
                      : "border-[#1b3a3f] text-ink-dim hover:border-glow-b/40 hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div
              key={tab}
              role="tabpanel"
              className={`holo-panel h-[480px] overflow-y-auto rounded-sm p-6 ${
                reduced ? "" : "holo-materialize holo-flicker"
              }`}
            >
              <p className="hud-label mb-4 !text-glow-b/60">
                hologram record · {tab.toLowerCase()}
              </p>
              {tab === "Experiences" && <Experiences onOpen={setRecord} />}
              {tab === "Publications" && <Publications />}
              {tab === "Awards" && <Awards onOpen={setRecord} />}
              {tab === "Systems" && <Systems />}
              {tab === "Clubs" && <Clubs />}
            </div>
            <HoloEmitter />
          </motion.div>
        </div>
      </div>

      {/* Expanded record popup */}
      <HoloModal
        open={record !== null}
        title={
          record?.kind === "experience"
            ? record.data.org
            : (record?.data.title ?? "")
        }
        meta={
          record?.kind === "experience"
            ? `${record.data.role} · ${record.data.period} · ${record.data.location}`
            : record?.data.meta
        }
        onClose={() => setRecord(null)}
      >
        {record?.kind === "experience" && (
          <ul className="space-y-2.5">
            {record.data.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm leading-relaxed text-ink-dim">
                <span aria-hidden className="mt-1 text-glow-b/60">▹</span>
                {b}
              </li>
            ))}
          </ul>
        )}
        {record?.kind === "award" && (
          <div className="space-y-4">
            {record.data.detail && (
              <p className="text-sm leading-relaxed text-ink-dim">{record.data.detail}</p>
            )}
            {"highlights" in record.data && record.data.highlights && (
              <div>
                <p className="hud-label mb-2 !text-glow-b/60">
                  trophy log · {record.data.highlights.length} records
                </p>
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {record.data.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-1.5 text-xs leading-relaxed text-ink-dim">
                      <span aria-hidden className="text-glow-b/60">▹</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </HoloModal>
    </section>
  );
}
