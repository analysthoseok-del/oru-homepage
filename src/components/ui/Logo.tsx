import {
  ORU_WORDMARK_VARIANTS,
  OruWordmark,
  type OruWordmarkVariant,
} from "@/components/ui/OruWordmark";

/** 로고 시안 전환 — NEXT_PUBLIC_ORU_LOGO=breath | sanctuary | vessel | classic */
const envVariant = process.env.NEXT_PUBLIC_ORU_LOGO as OruWordmarkVariant;
const LOGO_VARIANT: OruWordmarkVariant = ORU_WORDMARK_VARIANTS.includes(
  envVariant,
)
  ? envVariant
  : "vessel";

/** ORU 로고 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <OruWordmark
      variant={LOGO_VARIANT}
      strokeScale={1.6}
      className={`h-8 text-font-base ${className}`}
    />
  );
}
