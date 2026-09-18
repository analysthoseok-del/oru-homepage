import type { Metadata } from "next";
import localFont from "next/font/local";
import { Sidebar } from "@/components/layout/Sidebar";
import "./globals.css";

/** SUIT Variable — https://sun.fo/suit/ (self-host) */
const suit = localFont({
  src: "../assets/fonts/SUIT-Variable.woff2",
  variable: "--font-suit",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TALKR 게시판",
  description: "TALKR 게시판 — 게시글 작성/조회/수정/삭제",
};

/** 사이드바(메뉴)는 모든 화면이 공유하는 레이아웃 구조 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${suit.variable} h-full`}>
      <body className="min-h-full bg-bg-deep">
        <div className="mx-auto min-h-screen w-full max-w-[1280px] px-4 py-6 lg:px-8 lg:py-10">
          <div className="min-h-[calc(100vh-80px)] rounded-2xl bg-bg p-4 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
              <Sidebar />
              <main className="min-w-0 flex-1">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
