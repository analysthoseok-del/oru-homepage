import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  deletePost,
  getPost,
  StorageReadOnlyError,
  updatePost,
} from "@/lib/store";
import { MAX_IMAGES } from "@/lib/types";
import { toPublicPost } from "@/lib/serialize";

/** GET /api/posts/:id — 상세 조회 */
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/posts/[id]">,
) {
  const { id } = await ctx.params;
  const post = await getPost(id);
  if (!post) {
    return NextResponse.json(
      { message: "게시글을 찾을 수 없습니다." },
      { status: 404 },
    );
  }
  return NextResponse.json(toPublicPost(post));
}

/** PUT /api/posts/:id — 수정 (작성자명은 변경 불가, 비밀번호 확인) */
export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/posts/[id]">,
) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { message: "잘못된 요청입니다." },
      { status: 400 },
    );
  }

  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "").trim();
  const password = String(body.password ?? "");
  const images = Array.isArray(body.images)
    ? body.images.filter((src: unknown) => typeof src === "string").slice(0, MAX_IMAGES)
    : [];

  if (!title || !content || !password) {
    return NextResponse.json(
      { message: "제목, 내용, 비밀번호를 모두 입력해 주세요." },
      { status: 400 },
    );
  }

  const result = await updatePost(id, {
    title,
    content,
    password,
    images,
  }).catch((cause) => {
    if (cause instanceof StorageReadOnlyError) return cause;
    throw cause;
  });
  if (result instanceof StorageReadOnlyError) {
    return NextResponse.json({ message: result.message }, { status: 503 });
  }
  if (!result.ok) {
    return result.reason === "not-found"
      ? NextResponse.json(
          { message: "게시글을 찾을 수 없습니다." },
          { status: 404 },
        )
      : NextResponse.json(
          { message: "비밀번호가 일치하지 않습니다." },
          { status: 403 },
        );
  }

  return NextResponse.json(toPublicPost(result.post));
}

/** DELETE /api/posts/:id — 삭제 */
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/posts/[id]">,
) {
  const { id } = await ctx.params;
  const deleted = await deletePost(id).catch((cause) => {
    if (cause instanceof StorageReadOnlyError) return cause;
    throw cause;
  });
  if (deleted instanceof StorageReadOnlyError) {
    return NextResponse.json({ message: deleted.message }, { status: 503 });
  }
  if (!deleted) {
    return NextResponse.json(
      { message: "게시글을 찾을 수 없습니다." },
      { status: 404 },
    );
  }
  return NextResponse.json({ ok: true });
}
