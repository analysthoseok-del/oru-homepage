import { BannerCarousel } from "@/components/layout/BannerCarousel";

/** 배너가 노출되는 화면(목록 / 상세)의 레이아웃 */
export default function WithBannerLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <div className="flex flex-col gap-6">
      <BannerCarousel />
      {children}
    </div>
  );
}
