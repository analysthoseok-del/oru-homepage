import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { IMAGE_EXTENSIONS, MAX_IMAGE_SIZE, saveImage } from "@/lib/storage";

/** POST /api/upload — 이미지 업로드 후 공개 URL 반환 */
export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "이미지 파일이 필요합니다." },
      { status: 400 },
    );
  }

  const ext = IMAGE_EXTENSIONS[file.type];
  if (!ext) {
    return NextResponse.json(
      { message: "png, jpg, webp, gif, svg 형식만 업로드할 수 있습니다." },
      { status: 415 },
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { message: "이미지 용량은 5MB 이하만 가능합니다." },
      { status: 413 },
    );
  }

  try {
    const url = await saveImage(file, ext);
    return NextResponse.json({ url }, { status: 201 });
  } catch (cause) {
    console.error("[upload] 실패", cause);
    return NextResponse.json(
      { message: "이미지를 저장하지 못했습니다." },
      { status: 500 },
    );
  }
}
