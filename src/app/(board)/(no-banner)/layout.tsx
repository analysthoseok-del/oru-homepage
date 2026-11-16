/** 배너가 노출되지 않는 화면(작성 / 수정)의 레이아웃 */
export default function NoBannerLayout({ children }: LayoutProps<"/">) {
  return <div className="flex flex-col gap-6">{children}</div>;
}
