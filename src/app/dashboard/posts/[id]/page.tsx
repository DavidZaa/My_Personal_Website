import { notFound } from "next/navigation";
import { PostEditor } from "@/components/dashboard/PostEditor";
import { getPostById } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();
  return <PostEditor post={post} />;
}
