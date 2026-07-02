"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GlowButton } from "@/components/ui/GlowButton";
import { Notice, writeError } from "@/components/dashboard/DemoNotice";
import { upsertPost } from "@/app/dashboard/actions";
import type { Post } from "@/lib/types";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export function PostEditor({ post }: { post: Post | null }) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content_md ?? "");
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();

  const effectiveSlug = useMemo(
    () => (slugTouched ? slug : slugify(title)),
    [slug, slugTouched, title],
  );

  const save = (status: "draft" | "published") => {
    if (!title.trim() || !effectiveSlug) {
      setNotice("Title (and slug) required before saving.");
      return;
    }
    startTransition(async () => {
      const result = await upsertPost({
        id: post?.id,
        title: title.trim(),
        slug: effectiveSlug,
        excerpt: excerpt.trim(),
        content_md: content,
        status,
        published_at:
          status === "published"
            ? (post?.published_at ?? new Date().toISOString())
            : null,
      });
      setNotice(
        writeError(result) ??
          (status === "published" ? "Published — live on /blog." : "Draft saved."),
      );
      if (result.ok && !post) {
        router.push(`/dashboard/posts/${result.id}`);
      } else {
        router.refresh();
      }
    });
  };

  const field =
    "w-full rounded-sm border border-line bg-panel/60 px-3 py-2 text-sm outline-none placeholder:text-ink-dim/50 focus:border-glow-b";

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title…"
          aria-label="Post title"
          className={`${field} text-base font-semibold`}
        />
        <input
          value={effectiveSlug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          placeholder="slug"
          aria-label="Slug"
          className={`${field} font-mono text-xs`}
        />
      </div>
      <input
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="One-line excerpt shown on the blog index…"
        aria-label="Excerpt"
        className={field}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="hud-label mb-2">markdown</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={22}
            aria-label="Post content (markdown)"
            placeholder={"Write in markdown…\n\n## Headings\n`code`, **bold**, tables, fenced blocks all work."}
            className={`${field} resize-y font-mono text-[13px] leading-relaxed`}
          />
        </div>
        <div className="min-w-0">
          <p className="hud-label mb-2">live preview</p>
          <div className="prose-hud hud-panel h-full max-h-[540px] overflow-y-auto rounded-sm p-4 text-sm">
            {content ? (
              <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
            ) : (
              <p className="font-mono text-xs text-ink-dim">
                preview appears here
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <GlowButton onClick={() => save("published")} disabled={busy}>
          {post?.status === "published" ? "Update live post" : "Publish"}
        </GlowButton>
        <GlowButton variant="ghost" onClick={() => save("draft")} disabled={busy}>
          {post?.status === "published" ? "Unpublish to draft" : "Save draft"}
        </GlowButton>
        {post?.status === "published" && (
          <a
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-glow-b hover:underline"
          >
            view live ↗
          </a>
        )}
      </div>
      <Notice text={notice} />
    </div>
  );
}
