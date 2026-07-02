import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getPostBySlug, recordPageView } from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  void recordPageView(`/blog/${slug}`);

  const html = await renderMarkdown(post.content_md);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/blog"
        className="font-mono text-xs text-ink-dim hover:text-glow-b"
      >
        ← transmission log
      </Link>
      <h1 className="mt-6 text-3xl font-semibold leading-tight glow-text sm:text-4xl">
        {post.title}
      </h1>
      {post.published_at && (
        <p className="mt-3 font-mono text-xs text-ink-dim">
          transmitted{" "}
          <time dateTime={post.published_at}>
            {format(new Date(post.published_at), "MMMM d, yyyy")}
          </time>
        </p>
      )}
      <div
        className="prose-hud mt-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
