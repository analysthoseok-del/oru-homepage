"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldBase =
  "w-full rounded-md border border-line bg-white px-4 text-[15px] text-font-base placeholder:text-font-sub outline-none transition-colors focus:border-main disabled:bg-bg-deep disabled:text-font-sub";

/** Figma Input 규칙: 기본 / 클릭(포커스, main border) / 비활성화 / 완료 */
export function TextField(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input className={`${fieldBase} h-[48px] ${className}`} {...rest} />;
}

export function TextAreaField(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      className={`${fieldBase} resize-none py-4 leading-relaxed ${className}`}
      {...rest}
    />
  );
}

export function FieldRow({
  label,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-6 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="mt-[14px] w-[64px] shrink-0 text-[15px] font-bold text-font-strong"
      >
        {label}
      </label>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
