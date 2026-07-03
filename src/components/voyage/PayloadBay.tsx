"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { featuredProjects } from "@/lib/content/projects";

function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const reduced = useReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateZ(6px)`,
    );
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTransform("")}
      style={{ transform, transition: transform ? "transform 60ms linear" : "transform 350ms ease" }}
      className={className}
    >
      {children}
    </div>
  );
}

export function PayloadBay() {
  const reduced = useReducedMotion();

  return (
    <section id="payload" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {featuredProjects.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={reduced ? false : { opacity: 0, y: 40, rotateX: -8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
            >
              {/* separate layer for the idle float so it can loop freely */}
              <motion.div
                animate={reduced ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                className="h-full"
              >
              <TiltCard className="group relative h-full">
                <a
                  href={p.github ?? p.liveUrl ?? "/projects"}
                  target={p.github || p.liveUrl ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="hud-panel relative flex h-full flex-col overflow-hidden rounded-sm p-6 transition-colors group-hover:border-glow-a/70"
                >
                  {/* glowing edge seam */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glow-a to-transparent opacity-40 transition-opacity group-hover:opacity-100"
                  />
                  <p className="hud-label">pod {String(i + 1).padStart(2, "0")} · {p.origin}</p>
                  <h3 className="mt-3 font-mono text-lg font-semibold group-hover:text-glow-b">
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
                  <span className="mt-5 font-mono text-[11px] text-glow-a opacity-0 transition-opacity group-hover:opacity-100">
                    open pod ↗
                  </span>
                </a>
              </TiltCard>
              </motion.div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/projects"
            className="font-mono text-xs tracking-widest text-ink-dim uppercase transition-colors hover:text-glow-b"
          >
            open full bay · {`{all projects}`} →
          </Link>
        </div>
      </div>
    </section>
  );
}
