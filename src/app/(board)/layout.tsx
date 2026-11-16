import { Sidebar } from "@/components/layout/Sidebar";

/** 게시판 화면의 공통 셸 — 사이드바(메뉴)는 게시판의 모든 화면이 공유한다. */
export default function BoardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1280px] px-4 py-6 lg:px-8 lg:py-10">
      <div className="min-h-[calc(100vh-80px)] rounded-2xl bg-bg p-4 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <Sidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
