"use client";

import { useState, useTransition } from "react";
import { HudPanel } from "@/components/ui/HudPanel";
import { GlowButton } from "@/components/ui/GlowButton";
import { Notice, writeError } from "@/components/dashboard/DemoNotice";
import { removeCounter, upsertCounter } from "../actions";
import type { Counter } from "@/lib/types";

export function CounterEditor({ initial }: { initial: Counter[] }) {
  const [counters, setCounters] = useState(initial);
  const [label, setLabel] = useState("");
  const [unit, setUnit] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const bump = (counter: Counter, delta: number) => {
    const value = Math.max(0, counter.value + delta);
    setCounters((cs) =>
      cs.map((c) => (c.id === counter.id ? { ...c, value } : c)),
    );
    startTransition(async () => {
      const result = await upsertCounter({ ...counter, value });
      setNotice(writeError(result));
    });
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    const optimistic: Counter = {
      id: `tmp-${Date.now()}`,
      label: label.trim(),
      value: 0,
      unit: unit.trim() || null,
      icon: null,
    };
    setCounters((cs) => [...cs, optimistic]);
    setLabel("");
    setUnit("");
    startTransition(async () => {
      const result = await upsertCounter({
        label: optimistic.label,
        value: 0,
        unit: optimistic.unit,
        icon: null,
      });
      setNotice(writeError(result));
      if (result.ok && result.id) {
        setCounters((cs) =>
          cs.map((c) => (c.id === optimistic.id ? { ...c, id: result.id! } : c)),
        );
      }
    });
  };

  const del = (id: string) => {
    setCounters((cs) => cs.filter((c) => c.id !== id));
    startTransition(async () => {
      const result = await removeCounter(id);
      setNotice(writeError(result));
    });
  };

  return (
    <HudPanel title="Public telemetry counters">
      <p className="mb-5 text-sm text-ink-dim">
        These show as animated gauges on the home page. Bump them whenever —
        papers read, coffees, experiments, anything worth counting.
      </p>

      <ul className="space-y-3">
        {counters.map((c) => (
          <li
            key={c.id}
            className="group flex items-center gap-3 rounded-sm border border-line/50 px-3 py-2"
          >
            <span className="min-w-0 flex-1 truncate text-sm">
              {c.icon && <span className="mr-1.5">{c.icon}</span>}
              {c.label}
              {c.unit && (
                <span className="ml-1 font-mono text-xs text-ink-dim">
                  ({c.unit})
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => bump(c, -1)}
              aria-label={`Decrement ${c.label}`}
              className="h-7 w-7 rounded-sm border border-line font-mono text-sm text-ink-dim hover:border-line-bright hover:text-ink"
            >
              −
            </button>
            <span className="w-14 text-center font-mono text-lg font-semibold">
              {c.value.toLocaleString()}
            </span>
            <button
              type="button"
              onClick={() => bump(c, 1)}
              aria-label={`Increment ${c.label}`}
              className="h-7 w-7 rounded-sm border border-line font-mono text-sm text-ink-dim hover:border-glow-b hover:text-glow-b"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => del(c.id)}
              aria-label={`Delete ${c.label}`}
              className="ml-1 text-ink-dim/40 opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={add} className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="New counter label…"
          aria-label="New counter label"
          className="min-w-0 flex-1 rounded-sm border border-line bg-panel/60 px-3 py-2 text-sm outline-none placeholder:text-ink-dim/50 focus:border-glow-b"
        />
        <input
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="unit (opt)"
          aria-label="Unit"
          className="w-24 rounded-sm border border-line bg-panel/60 px-3 py-2 font-mono text-xs outline-none placeholder:text-ink-dim/50 focus:border-glow-b"
        />
        <GlowButton type="submit" disabled={!label.trim()}>
          Add
        </GlowButton>
      </form>
      <Notice text={notice} />
    </HudPanel>
  );
}
