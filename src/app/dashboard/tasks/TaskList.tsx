"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { HudPanel } from "@/components/ui/HudPanel";
import { GlowButton } from "@/components/ui/GlowButton";
import { Notice, writeError } from "@/components/dashboard/DemoNotice";
import { createTask, removeTask, setTaskDone } from "../actions";
import type { Task } from "@/lib/types";

export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const open = tasks.filter((t) => !t.done);
  const closed = tasks.filter((t) => t.done);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const optimistic: Task = {
      id: `tmp-${Date.now()}`,
      title: title.trim(),
      done: false,
      due_date: due || null,
      position: tasks.length,
      created_at: new Date().toISOString(),
    };
    setTasks((t) => [...t, optimistic]);
    setTitle("");
    setDue("");
    startTransition(async () => {
      const result = await createTask(optimistic.title, optimistic.due_date);
      setNotice(writeError(result));
      if (result.ok && result.id) {
        setTasks((t) =>
          t.map((x) => (x.id === optimistic.id ? { ...x, id: result.id! } : x)),
        );
      }
    });
  };

  const toggle = (task: Task) => {
    setTasks((t) =>
      t.map((x) => (x.id === task.id ? { ...x, done: !task.done } : x)),
    );
    startTransition(async () => {
      const result = await setTaskDone(task.id, !task.done);
      setNotice(writeError(result));
    });
  };

  const remove = (id: string) => {
    setTasks((t) => t.filter((x) => x.id !== id));
    startTransition(async () => {
      const result = await removeTask(id);
      setNotice(writeError(result));
    });
  };

  const Row = ({ task }: { task: Task }) => (
    <li className="group flex items-center gap-3 border-b border-line/50 py-2.5 last:border-0">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => toggle(task)}
        aria-label={`Mark "${task.title}" ${task.done ? "open" : "done"}`}
        className="h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-line-bright bg-transparent transition-colors checked:border-glow-b checked:bg-glow-b/40"
      />
      <span
        className={`flex-1 text-sm ${task.done ? "text-ink-dim line-through" : ""}`}
      >
        {task.title}
      </span>
      {task.due_date && !task.done && (
        <span className="font-mono text-[10px] text-glow-warm">
          {format(new Date(`${task.due_date}T00:00:00`), "MMM d")}
        </span>
      )}
      <button
        type="button"
        onClick={() => remove(task.id)}
        aria-label={`Delete "${task.title}"`}
        className="text-ink-dim/40 opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
      >
        ✕
      </button>
    </li>
  );

  return (
    <div className="space-y-5">
      <HudPanel title="Mission checklist">
        <form onSubmit={add} className="flex flex-wrap gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task…"
            aria-label="New task title"
            className="min-w-0 flex-1 rounded-sm border border-line bg-panel/60 px-3 py-2 text-sm outline-none placeholder:text-ink-dim/50 focus:border-glow-b"
          />
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            aria-label="Due date"
            className="rounded-sm border border-line bg-panel/60 px-3 py-2 font-mono text-xs outline-none focus:border-glow-b"
          />
          <GlowButton type="submit" disabled={!title.trim()}>
            Add
          </GlowButton>
        </form>
        <Notice text={notice} />

        <ul className="mt-5">
          {open.map((t) => (
            <Row key={t.id} task={t} />
          ))}
          {open.length === 0 && (
            <p className="py-3 text-center font-mono text-xs text-ink-dim">
              queue clear 🛰
            </p>
          )}
        </ul>
      </HudPanel>

      {closed.length > 0 && (
        <HudPanel title={`Completed · ${closed.length}`}>
          <ul>
            {closed.map((t) => (
              <Row key={t.id} task={t} />
            ))}
          </ul>
        </HudPanel>
      )}
    </div>
  );
}
