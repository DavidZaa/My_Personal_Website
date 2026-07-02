import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { Reveal } from "@/components/ui/Reveal";
import { getPublishedPosts, recordPageView } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Transmission log — writing on research, systems, and building.",
};

export const revalidate = 60;

export default async function BlogIndex() {
  const posts = await getPublishedPosts();
  void recordPageView("/blog");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Reveal>
        <p className="hud-label mb-3">transmission log</p>
        <h1 className="text-3xl font-semibold glow-text sm:text-4xl">Blog</h1>
      </Reveal>

      {posts.length === 0 ? (
        <p className="mt-16 text-center font-mono text-sm text-ink-dim">
          transmission log empty · check back soon
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-line">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.05}>
              <li>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block py-6"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h2 className="text-lg font-semibold transition-colors group-hover:text-glow-b">
                      {post.title}
                    </h2>
                    {post.published_at && (
                      <time
                        dateTime={post.published_at}
                        className="font-mono text-xs text-ink-dim"
                      >
                        {format(new Date(post.published_at), "yyyy·MM·dd")}
                      </time>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">
                    {post.excerpt}
                  </p>
                  <span className="mt-3 inline-block font-mono text-xs text-glow-a opacity-0 transition-opacity group-hover:opacity-100">
                    read transmission →
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}
