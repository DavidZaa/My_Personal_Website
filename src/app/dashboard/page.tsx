import Link from "next/link";
import { endOfDay, format, startOfDay } from "date-fns";
import { HudPanel } from "@/components/ui/HudPanel";
import { getAllPosts, getEvents, getNowStatus, getTasks } from "@/lib/data";

export default async function DashboardOverview() {
  const todayStart = startOfDay(new Date()).toISOString();
  const todayEnd = endOfDay(new Date()).toISOString();
  const [tasks, events, posts, now] = await Promise.all([
    getTasks(),
    getEvents(todayStart, todayEnd),
    getAllPosts(),
    getNowStatus(),
  ]);

  const openTasks = tasks.filter((t) => !t.done);
  const drafts = posts.filter((p) => p.status === "draft");
  const latest = posts[0];

  return (
    <div className="space-y-5">
      <h1 className="font-mono text-sm font-semibold tracking-[0.2em] text-ink-dim">
        OVERVIEW · {format(new Date(), "EEE MMM d").toUpperCase()}
      </h1>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <HudPanel title="Today's schedule">
          {events.length === 0 ? (
            <p className="text-sm text-ink-dim">clear skies — nothing scheduled</p>
          ) : (
            <ul className="space-y-2">
              {events.map((e) => (
                <li key={e.id} className="flex items-baseline gap-3 text-sm">
                  <span className="font-mono text-xs text-glow-b">
                    {format(new Date(e.starts_at), "HH:mm")}
                  </span>
                  {e.title}
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/dashboard/calendar"
            className="mt-4 inline-block font-mono text-xs text-glow-a hover:underline"
          >
            calendar →
          </Link>
        </HudPanel>

        <HudPanel title="Task queue">
          <p className="font-mono text-3xl font-semibold">
            {openTasks.length}
            <span className="ml-2 text-sm font-normal text-ink-dim">open</span>
          </p>
          {openTasks[0] && (
            <p className="mt-2 truncate text-sm text-ink-dim">
              next: {openTasks[0].title}
            </p>
          )}
          <Link
            href="/dashboard/tasks"
            className="mt-4 inline-block font-mono text-xs text-glow-a hover:underline"
          >
            tasks →
          </Link>
        </HudPanel>

        <HudPanel title="Transmissions">
          <p className="text-sm">
            {drafts.length > 0
              ? `${drafts.length} draft${drafts.length > 1 ? "s" : ""} awaiting launch`
              : "no drafts pending"}
          </p>
          {latest && (
            <p className="mt-2 truncate text-sm text-ink-dim">
              latest: {latest.title}{" "}
              <span className="font-mono text-[10px]">({latest.status})</span>
            </p>
          )}
          <Link
            href="/dashboard/posts"
            className="mt-4 inline-block font-mono text-xs text-glow-a hover:underline"
          >
            editor →
          </Link>
        </HudPanel>
      </div>

      <HudPanel title="Public 'now' feed">
        <p className="text-sm leading-relaxed">{now.focus}</p>
        <p className="mt-1 text-sm text-ink-dim">building: {now.building}</p>
        <Link
          href="/dashboard/now"
          className="mt-4 inline-block font-mono text-xs text-glow-a hover:underline"
        >
          update →
        </Link>
      </HudPanel>
    </div>
  );
}
