import { notFound } from "next/navigation";
import { PostForm } from "@/components/board/PostForm";
import { getPost } from "@/lib/store";
import { toPublicPost } from "@/lib/serialize";

/** 게시글 수정 — 기존 값을 기본값으로 불러온다. */
export default async function EditPostPage({
  params,
}: PageProps<"/posts/[id]/edit">) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return <PostForm mode="edit" post={toPublicPost(post)} />;
}
