"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { HudPanel } from "@/components/ui/HudPanel";
import { GlowButton } from "@/components/ui/GlowButton";
import { Notice, writeError } from "@/components/dashboard/DemoNotice";
import { removeEvent, upsertEvent } from "../actions";
import type { CalendarEvent } from "@/lib/types";

export function MonthCalendar({
  monthKey,
  events,
}: {
  monthKey: string;
  events: CalendarEvent[];
}) {
  const router = useRouter();
  const month = new Date(`${monthKey}-01T00:00:00`);
  const [selected, setSelected] = useState<Date | null>(null);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(month)),
        end: endOfWeek(endOfMonth(month)),
      }),
    [monthKey], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const eventsOn = (day: Date) =>
    events.filter((e) => isSameDay(new Date(e.starts_at), day));

  const prev = format(addMonths(month, -1), "yyyy-MM");
  const next = format(addMonths(month, 1), "yyyy-MM");

  const save = (form: FormData) => {
    const day = selected ?? new Date();
    const title = String(form.get("title") ?? "").trim();
    if (!title) return;
    const time = String(form.get("time") ?? "09:00");
    const endTime = String(form.get("end") ?? "");
    const notes = String(form.get("notes") ?? "").trim() || null;
    const starts = new Date(`${format(day, "yyyy-MM-dd")}T${time}:00`);
    const ends = endTime
      ? new Date(`${format(day, "yyyy-MM-dd")}T${endTime}:00`)
      : null;

    startTransition(async () => {
      const result = await upsertEvent({
        id: editing?.id,
        title,
        starts_at: starts.toISOString(),
        ends_at: ends?.toISOString() ?? null,
        notes,
      });
      setNotice(writeError(result));
      setSelected(null);
      setEditing(null);
      router.refresh();
    });
  };

  const del = (id: string) => {
    startTransition(async () => {
      const result = await removeEvent(id);
      setNotice(writeError(result));
      setEditing(null);
      setSelected(null);
      router.refresh();
    });
  };

  return (
    <HudPanel title={`Mission log · ${format(month, "MMMM yyyy")}`}>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={`/dashboard/calendar?m=${prev}`}
          className="font-mono text-xs text-ink-dim hover:text-glow-b"
        >
          ← {format(addMonths(month, -1), "MMM")}
        </Link>
        <Link
          href="/dashboard/calendar"
          className="font-mono text-xs text-ink-dim hover:text-glow-b"
        >
          today
        </Link>
        <Link
          href={`/dashboard/calendar?m=${next}`}
          className="font-mono text-xs text-ink-dim hover:text-glow-b"
        >
          {format(addMonths(month, 1), "MMM")} →
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="pb-1 text-center font-mono text-[10px] text-ink-dim">
            {d}
          </div>
        ))}
        {days.map((day) => {
          const dayEvents = eventsOn(day);
          const inMonth = isSameMonth(day, month);
          return (
            <button
              type="button"
              key={day.toISOString()}
              onClick={() => {
                setSelected(day);
                setEditing(null);
              }}
              className={`min-h-[72px] rounded-sm border p-1.5 text-left align-top transition-colors ${
                selected && isSameDay(day, selected)
                  ? "border-glow-b bg-glow-b/10"
                  : "border-line/40 hover:border-line-bright"
              } ${inMonth ? "" : "opacity-35"}`}
            >
              <span
                className={`font-mono text-[11px] ${
                  isToday(day) ? "rounded-sm bg-glow-a px-1 text-white" : "text-ink-dim"
                }`}
              >
                {format(day, "d")}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayEvents.slice(0, 2).map((e) => (
                  <span
                    key={e.id}
                    role="button"
                    tabIndex={0}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setSelected(day);
                      setEditing(e);
                    }}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter") {
                        ev.stopPropagation();
                        setSelected(day);
                        setEditing(e);
                      }
                    }}
                    className="block truncate rounded-sm bg-glow-a/20 px-1 py-0.5 text-[10px] leading-tight text-ink hover:bg-glow-a/40"
                  >
                    {e.title}
                  </span>
                ))}
                {dayEvents.length > 2 && (
                  <span className="block px-1 font-mono text-[9px] text-ink-dim">
                    +{dayEvents.length - 2} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <form
          action={save}
          className="mt-5 space-y-3 border-t border-line pt-4"
        >
          <p className="hud-label">
            {editing ? "edit event" : "new event"} ·{" "}
            {format(selected, "EEE MMM d")}
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              name="title"
              defaultValue={editing?.title ?? ""}
              placeholder="Event title…"
              aria-label="Event title"
              required
              className="min-w-0 flex-1 rounded-sm border border-line bg-panel/60 px-3 py-2 text-sm outline-none placeholder:text-ink-dim/50 focus:border-glow-b"
            />
            <input
              type="time"
              name="time"
              aria-label="Start time"
              defaultValue={
                editing ? format(new Date(editing.starts_at), "HH:mm") : "09:00"
              }
              className="rounded-sm border border-line bg-panel/60 px-2 py-2 font-mono text-xs outline-none focus:border-glow-b"
            />
            <input
              type="time"
              name="end"
              aria-label="End time (optional)"
              defaultValue={
                editing?.ends_at ? format(new Date(editing.ends_at), "HH:mm") : ""
              }
              className="rounded-sm border border-line bg-panel/60 px-2 py-2 font-mono text-xs outline-none focus:border-glow-b"
            />
          </div>
          <input
            name="notes"
            defaultValue={editing?.notes ?? ""}
            placeholder="Notes (optional)"
            aria-label="Notes"
            className="w-full rounded-sm border border-line bg-panel/60 px-3 py-2 text-sm outline-none placeholder:text-ink-dim/50 focus:border-glow-b"
          />
          <div className="flex gap-2">
            <GlowButton type="submit">{editing ? "Save" : "Add"}</GlowButton>
            {editing && (
              <GlowButton variant="ghost" onClick={() => del(editing.id)}>
                Delete
              </GlowButton>
            )}
            <GlowButton
              variant="ghost"
              onClick={() => {
                setSelected(null);
                setEditing(null);
              }}
            >
              Close
            </GlowButton>
          </div>
        </form>
      )}
      <Notice text={notice} />
    </HudPanel>
  );
}
