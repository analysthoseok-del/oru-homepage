import { promises as fs } from "fs";
import path from "path";
import { uploadFile as uploadToGraphQL } from "@/lib/graphql/client";
import { getBackend } from "@/lib/store";

/**
 * 로컬 업로드 보관 위치.
 * `public/` 에 쓰면 프로덕션 빌드(`next start`) 에서 빌드 이후 생성된 파일이
 * 정적 자산으로 잡히지 않아 404 가 나므로, 빌드 산출물 밖에 저장하고
 * `/api/uploads/:name` 라우트로 서빙한다.
 */
export const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * 이미지 저장. 게시글 백엔드와 같은 곳에 저장한다.
 * - graphql  → 코드캠프 백엔드의 uploadFile 뮤테이션
 * - postgres → Vercel Blob (토큰이 있을 때)
 * - file     → `data/uploads` 에 저장하고 `/api/uploads/:name` 로 서빙
 */
export async function saveImage(file: File, ext: string): Promise<string> {
  if (getBackend() === "graphql") {
    return uploadToGraphQL(file);
  }

  const name = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  if (hasBlobToken()) {
    // 번들 크기를 위해 필요할 때만 로드한다.
    const { put } = await import("@vercel/blob");
    const blob = await put(`posts/${name}`, file, {
      access: "public",
      contentType: file.type,
    });
    return blob.url;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_UPLOAD_DIR, name), buffer);
  return `/api/uploads/${name}`;
}
