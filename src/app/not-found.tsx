import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl bg-white px-8 py-20 text-center">
      <p className="text-[20px] font-bold text-font-strong">
        요청하신 게시글을 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        className="inline-flex h-[42px] min-w-[104px] items-center justify-center rounded-full bg-bt-primary px-7 text-[15px] font-bold text-white hover:bg-[#5300d6]"
      >
        글목록
      </Link>
    </div>
  );
}
