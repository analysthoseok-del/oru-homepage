"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { deletePost } from "@/lib/api";

/** 상세 하단 액션 — 글목록 / 수정 / 삭제 */
export function PostDetailActions({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm("이 게시글을 삭제할까요?")) return;
    setPending(true);
    setError(null);
    try {
      await deletePost(id);
      // 삭제 완료 후 목록 페이지로 이동
      router.push("/");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "삭제하지 못했습니다.");
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-3">
        <Button type="button" onClick={() => router.push("/")}>
          글목록
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push(`/posts/${id}/edit`)}
        >
          수정
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleDelete}
          disabled={pending}
        >
          삭제
        </Button>
      </div>
      {error && <p className="text-[14px] text-main">{error}</p>}
    </div>
  );
}
