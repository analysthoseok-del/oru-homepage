import type { Metadata } from "next";
import { SiteFooter } from "@/components/brand/SiteFooter";
import { SiteHeader } from "@/components/brand/SiteHeader";

export const metadata: Metadata = {
  title: { default: "Oru", template: "%s | Oru" },
  description:
    "스킨케어를 넘어, 오롯이 나에게 집중하는 치유의 시간. Longevity · Ritual · Emotional Wellness.",
};

/** 브랜드 사이트 틀 — 헤더와 푸터는 브랜드 영역의 모든 화면이 공유한다. */
export default function BrandLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col bg-oru-sand text-oru-ink">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
