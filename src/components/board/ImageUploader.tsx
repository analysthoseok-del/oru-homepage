"use client";

import { useRef, useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import { uploadImage } from "@/lib/api";
import { MAX_IMAGES } from "@/lib/types";

interface ImageUploaderProps {
  value: (string | null)[];
  onChange: (next: (string | null)[]) => void;
}

/**
 * 이미지 업로드 슬롯 3개.
 * - 업로드 시 버튼 영역에 미리보기가 표시된다.
 * - 이미 등록된 이미지를 클릭하면 새 이미지로 교체된다.
 */
export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(index: number, file: File | undefined) {
    if (!file) return;
    setPendingIndex(index);
    setError(null);
    try {
      const { url } = await uploadImage(file);
      const next = [...value];
      next[index] = url;
      onChange(next);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "이미지를 업로드하지 못했습니다.",
      );
    } finally {
      setPendingIndex(null);
      const input = inputsRef.current[index];
      // 같은 파일을 다시 선택해도 change 가 발생하도록 값을 비운다.
      if (input) input.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: MAX_IMAGES }, (_, index) => {
          const src = value[index] ?? null;
          const isPending = pendingIndex === index;
          return (
            <div key={index} className="group relative">
              <button
                type="button"
                onClick={() => inputsRef.current[index]?.click()}
                aria-label={
                  src
                    ? `${index + 1}번째 이미지 변경`
                    : `${index + 1}번째 이미지 업로드`
                }
                className="flex h-[78px] w-[78px] items-center justify-center overflow-hidden rounded-md border border-line bg-bg transition-colors hover:border-main"
              >
                {src ? (
                  // 업로드된 이미지 미리보기
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={`첨부 이미지 ${index + 1} 미리보기`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <MdAddCircleOutline
                    size={24}
                    className={isPending ? "text-main" : "text-font-sub"}
                  />
                )}
              </button>

              {src && (
                <button
                  type="button"
                  onClick={() => {
                    const next = [...value];
                    next[index] = null;
                    onChange(next);
                  }}
                  aria-label={`${index + 1}번째 이미지 삭제`}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-font-sub text-[12px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 hover:bg-main"
                >
                  ×
                </button>
              )}

              <input
                ref={(element) => {
                  inputsRef.current[index] = element;
                }}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                className="sr-file"
                onChange={(event) =>
                  handleSelect(index, event.target.files?.[0])
                }
              />
            </div>
          );
        })}
      </div>
      {error && <p className="text-[13px] text-main">{error}</p>}
    </div>
  );
}
