import Link from "next/link";
import { format } from "date-fns";
import { HudPanel } from "@/components/ui/HudPanel";
import { GlowButton } from "@/components/ui/GlowButton";
import { getAllPosts } from "@/lib/data";
import { DeletePostButton } from "./DeletePostButton";

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <HudPanel title="Transmissions">
      <div className="mb-5 flex justify-end">
        <GlowButton href="/dashboard/posts/new">New post</GlowButton>
      </div>
      <ul className="divide-y divide-line/50">
        {posts.map((p) => (
          <li key={p.id} className="flex items-center gap-4 py-3">
            <span
              className={`w-20 shrink-0 rounded-sm border px-1.5 py-0.5 text-center font-mono text-[10px] uppercase tracking-widest ${
                p.status === "published"
                  ? "border-glow-b/40 text-glow-b"
                  : "border-glow-warm/40 text-glow-warm"
              }`}
            >
              {p.status}
            </span>
            <Link
              href={`/dashboard/posts/${p.id}`}
              className="min-w-0 flex-1 truncate text-sm hover:text-glow-b"
            >
              {p.title}
            </Link>
            <span className="hidden font-mono text-[10px] text-ink-dim sm:block">
              {format(new Date(p.updated_at), "yyyy·MM·dd")}
            </span>
            <DeletePostButton id={p.id} title={p.title} />
          </li>
        ))}
        {posts.length === 0 && (
          <p className="py-6 text-center font-mono text-xs text-ink-dim">
            no transmissions yet
          </p>
        )}
      </ul>
    </HudPanel>
  );
}
