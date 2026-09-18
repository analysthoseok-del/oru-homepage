import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

/** POST /api/upload — 이미지 업로드 후 public URL 반환 */
export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "이미지 파일이 필요합니다." },
      { status: 400 },
    );
  }

  const ext = EXTENSIONS[file.type];
  if (!ext) {
    return NextResponse.json(
      { message: "png, jpg, webp, gif, svg 형식만 업로드할 수 있습니다." },
      { status: 415 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { message: "이미지 용량은 5MB 이하만 가능합니다." },
      { status: 413 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), buffer);

  return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 });
}
