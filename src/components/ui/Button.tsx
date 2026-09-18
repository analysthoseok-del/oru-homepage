"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

/** Figma BT 규칙: Main #6400FF / Disabled·Secondary #999999, pill 형태 */
export function Button({
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex h-[42px] min-w-[104px] items-center justify-center rounded-full px-7 text-[15px] font-bold text-white transition-colors disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-bt-primary hover:bg-[#5300d6] disabled:bg-bt-disabled"
      : "bg-bt-disabled hover:bg-[#8a8a8a]";

  return (
    <button
      className={`${base} ${styles} ${className}`}
      disabled={disabled}
      {...props}
    />
  );
}
