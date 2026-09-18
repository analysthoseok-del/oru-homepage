"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUploader } from "@/components/board/ImageUploader";
import { Button } from "@/components/ui/Button";
import { FieldRow, TextAreaField, TextField } from "@/components/ui/Field";
import { createPost, updatePost } from "@/lib/api";
import { MAX_IMAGES, type Post } from "@/lib/types";

type Mode = "create" | "edit";

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-[13px] text-main">{children}</p>;
}

interface PostFormProps {
  mode: Mode;
  post?: Post;
}

/** 작성/수정 화면이 공유하는 단일 폼 컴포넌트 */
export function PostForm({ mode, post }: PostFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [author, setAuthor] = useState(post?.author ?? "");
  const [password, setPassword] = useState("");
  const [images, setImages] = useState<(string | null)[]>(() => {
    const initial: (string | null)[] = Array.from({ length: MAX_IMAGES }, () => null);
    post?.images.slice(0, MAX_IMAGES).forEach((src, index) => {
      initial[index] = src;
    });
    return initial;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // 제목·내용·작성자·비밀번호를 모두 입력해야 등록할 수 있다.
  const missing = {
    title: title.trim().length === 0,
    content: content.trim().length === 0,
    author: author.trim().length === 0,
    password: password.length === 0,
  };
  const isValid = !Object.values(missing).some(Boolean);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (!isValid) {
      setTouched(true);
      setError("제목, 내용, 작성자, 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);
    const payloadImages = images.filter((src): src is string => Boolean(src));

    try {
      if (isEdit && post) {
        const updated = await updatePost(post.id, {
          title: title.trim(),
          content: content.trim(),
          password,
          images: payloadImages,
        });
        router.push(`/posts/${updated.id}`);
      } else {
        const created = await createPost({
          title: title.trim(),
          content: content.trim(),
          author: author.trim(),
          password,
          images: payloadImages,
        });
        router.push(`/posts/${created.id}`);
      }
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "요청을 처리하지 못했습니다.",
      );
      setSubmitting(false);
    }
  }

  const showError = (field: keyof typeof missing) => touched && missing[field];

  function handleCancel() {
    // 수정 취소 시에는 해당 글의 상세로, 작성 취소 시에는 목록으로 이동한다.
    router.push(isEdit && post ? `/posts/${post.id}` : "/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="rounded-2xl bg-white px-8 py-9 shadow-[0_1px_6px_rgba(0,0,0,0.03)] lg:px-10 lg:py-10">
        <h1 className="text-[20px] font-bold text-font-strong">
          {isEdit ? "게시물 수정" : "새 글 작성"}
        </h1>

        {/* Figma 헤딩 언더라인: 작성 = 좌 블랙 / 우 메인, 수정 = 전체 메인 */}
        <div className="mt-5 flex h-[2px] w-full">
          <span
            className={`h-full flex-1 ${isEdit ? "bg-main" : "bg-font-strong"}`}
          />
          <span className="h-full flex-1 bg-main" />
        </div>

        <div className="mt-9 flex flex-col gap-7">
          <FieldRow label="제목" htmlFor="post-title">
            <TextField
              id="post-title"
              value={title}
              placeholder="제목"
              aria-invalid={showError("title")}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
            />
            {showError("title") && <FieldError>제목을 입력해 주세요.</FieldError>}
          </FieldRow>

          <FieldRow label="내용" htmlFor="post-content">
            <TextAreaField
              id="post-content"
              rows={10}
              value={content}
              placeholder="내용"
              aria-invalid={showError("content")}
              onChange={(event) => setContent(event.target.value)}
            />
            {showError("content") && <FieldError>내용을 입력해 주세요.</FieldError>}
          </FieldRow>

          <FieldRow label="이미지">
            <ImageUploader value={images} onChange={setImages} />
          </FieldRow>

          <div className="flex flex-col gap-7 sm:flex-row sm:gap-10">
            <FieldRow label="작성자" htmlFor="post-author" className="flex-1">
              <TextField
                id="post-author"
                value={author}
                // 수정 시 작성자명은 변경할 수 없다.
                disabled={isEdit}
                placeholder="작성자명"
                aria-invalid={showError("author")}
                onChange={(event) => setAuthor(event.target.value)}
                maxLength={20}
              />
              {showError("author") && (
                <FieldError>작성자를 입력해 주세요.</FieldError>
              )}
            </FieldRow>

            <FieldRow label="비밀번호" htmlFor="post-password" className="flex-1">
              <TextField
                id="post-password"
                type="password"
                value={password}
                placeholder="비밀번호"
                aria-invalid={showError("password")}
                onChange={(event) => setPassword(event.target.value)}
                maxLength={30}
              />
              {showError("password") && (
                <FieldError>비밀번호를 입력해 주세요.</FieldError>
              )}
            </FieldRow>
          </div>
        </div>

        {error && <p className="mt-6 text-[14px] text-main">{error}</p>}
      </section>

      <div className="flex items-center justify-center gap-3">
        <Button type="submit" disabled={submitting}>
          {isEdit ? "수정" : "등록"}
        </Button>
        <Button type="button" variant="secondary" onClick={handleCancel}>
          취소
        </Button>
      </div>
    </form>
  );
}
