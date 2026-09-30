import { OruWordmark } from "@/components/ui/OruWordmark";

/** ORU 로고 — 세리프 워드마크 */
export function Logo({ className = "" }: { className?: string }) {
  return <OruWordmark className={`h-7 text-font-base ${className}`} />;
}
