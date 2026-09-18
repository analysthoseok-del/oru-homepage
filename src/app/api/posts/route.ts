import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createPost, listPosts, StorageReadOnlyError } from "@/lib/store";
import { MAX_IMAGES } from "@/lib/types";
import { toPublicPost } from "@/lib/serialize";

/** GET /api/posts?page=1&limit=10 — 페이지네이션 목록 (무한 스크롤용) */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit") ?? 10) || 10),
  );

  const result = await listPosts(page, limit);
  return NextResponse.json({
    ...result,
    items: result.items.map(toPublicPost),
  });
}

/** POST /api/posts — 게시글 등록 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { message: "잘못된 요청입니다." },
      { status: 400 },
    );
  }

  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "").trim();
  const author = String(body.author ?? "").trim();
  const password = String(body.password ?? "");
  const images = Array.isArray(body.images)
    ? body.images.filter((src: unknown) => typeof src === "string").slice(0, MAX_IMAGES)
    : [];

  if (!title || !content || !author || !password) {
    return NextResponse.json(
      { message: "제목, 내용, 작성자, 비밀번호를 모두 입력해 주세요." },
      { status: 400 },
    );
  }

  try {
    const post = await createPost({ title, content, author, password, images });
    return NextResponse.json(toPublicPost(post), { status: 201 });
  } catch (cause) {
    if (cause instanceof StorageReadOnlyError) {
      return NextResponse.json({ message: cause.message }, { status: 503 });
    }
    throw cause;
  }
}
