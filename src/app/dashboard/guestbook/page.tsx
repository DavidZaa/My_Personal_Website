import { formatDistanceToNow } from "date-fns";
import { HudPanel } from "@/components/ui/HudPanel";
import { getGuestbookEntries } from "@/lib/data";
import { DeleteEntryButton } from "./DeleteEntryButton";

export default async function GuestbookModerationPage() {
  const entries = await getGuestbookEntries();

  return (
    <HudPanel title={`Received signals · ${entries.length}`}>
      <ul className="divide-y divide-line/50">
        {entries.map((e) => (
          <li key={e.id} className="flex items-start gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <span className="font-medium">{e.author_name}</span>{" "}
                <span className="font-mono text-[10px] text-ink-dim">
                  {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}
                </span>
              </p>
              <p className="mt-1 text-sm text-ink-dim">{e.message}</p>
            </div>
            <DeleteEntryButton id={e.id} />
          </li>
        ))}
        {entries.length === 0 && (
          <p className="py-6 text-center font-mono text-xs text-ink-dim">
            channel silent
          </p>
        )}
      </ul>
    </HudPanel>
  );
}
