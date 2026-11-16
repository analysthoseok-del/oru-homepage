import { PostForm } from "@/components/board/PostForm";

/** 게시글 작성 — 배너 없이 폼만 노출 */
export default function NewPostPage() {
  return <PostForm mode="create" />;
}
