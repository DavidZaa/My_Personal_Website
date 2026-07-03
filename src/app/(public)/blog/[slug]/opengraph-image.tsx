import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/data";
import { OgCard, OG_SIZE } from "@/lib/og";

export const alt = "Blog post by David Zhang";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return new ImageResponse(
    (
      <OgCard
        label="david's log · blog"
        title={post?.title ?? "David's Log"}
        subtitle={post?.excerpt || undefined}
      />
    ),
    size,
  );
}
