"use client";

/** 백엔드(코드캠프 GraphQL) 응답 실패 시 보여줄 화면 */
export default function BoardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // 원인은 서버 로그로만 남기고 화면에는 노출하지 않는다.
  console.error("[board] 목록/상세 조회 실패", error);

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl bg-white px-8 py-20 text-center shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col gap-2">
        <p className="text-[20px] font-bold text-font-strong">
          게시글을 불러오지 못했습니다.
        </p>
        <p className="text-[15px] text-font-sub">
          잠시 후 다시 시도해 주세요. 문제가 계속되면 백엔드 상태를 확인해 주세요.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-[42px] min-w-[104px] items-center justify-center rounded-full bg-bt-primary px-7 text-[15px] font-bold text-white transition-colors hover:bg-[#5300d6]"
      >
        다시 시도
      </button>
    </div>
  );
}
