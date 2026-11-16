import type { Metadata } from "next";
import localFont from "next/font/local";
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

/**
 * 문서 골격과 폰트만 담당한다.
 * 화면 틀은 라우트 그룹이 나눠 가진다 — (board): 사이드바 셸, (brand): 브랜드 사이트 헤더/푸터.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${suit.variable} h-full scroll-smooth`}>
      <body className="min-h-full bg-bg-deep">{children}</body>
    </html>
  );
}
