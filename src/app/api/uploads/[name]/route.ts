import { createReadStream } from "fs";
import { promises as fs } from "fs";
import path from "path";
import { Readable } from "stream";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { IMAGE_EXTENSIONS, LOCAL_UPLOAD_DIR } from "@/lib/storage";

const CONTENT_TYPES: Record<string, string> = Object.fromEntries(
  Object.entries(IMAGE_EXTENSIONS).map(([type, ext]) => [ext, type]),
);

// 경로 조작(../)을 막기 위해 허용된 파일명 형태만 통과시킨다.
const SAFE_NAME = /^[a-z0-9]+-[a-z0-9]+\.(png|jpg|webp|gif|svg)$/i;

/**
 * GET /api/uploads/:name — 로컬 개발 환경에서 업로드 이미지를 서빙한다.
 * (Vercel Blob 을 쓰는 배포 환경에서는 Blob 의 공개 URL 을 직접 사용한다.)
 */
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/uploads/[name]">,
) {
  const { name } = await ctx.params;

  if (!SAFE_NAME.test(name)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const filePath = path.join(LOCAL_UPLOAD_DIR, name);
  const stat = await fs.stat(filePath).catch(() => null);
  if (!stat?.isFile()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const ext = name.split(".").pop()!.toLowerCase();
  const stream = Readable.toWeb(
    createReadStream(filePath),
  ) as ReadableStream<Uint8Array>;

  return new NextResponse(stream, {
    headers: {
      "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
      "Content-Length": String(stat.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
