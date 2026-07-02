"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeGuestbookEntry } from "../actions";

export function DeleteEntryButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label="Delete entry"
        className="text-ink-dim/40 transition-colors hover:text-danger"
      >
        ✕
      </button>
    );
  }

  return (
    <span className="flex shrink-0 items-center gap-2 font-mono text-[10px]">
      <button
        type="button"
        className="text-danger hover:underline"
        onClick={() =>
          startTransition(async () => {
            await removeGuestbookEntry(id);
            router.refresh();
          })
        }
      >
        delete
      </button>
      <button
        type="button"
        className="text-ink-dim hover:underline"
        onClick={() => setConfirming(false)}
      >
        keep
      </button>
    </span>
  );
}
