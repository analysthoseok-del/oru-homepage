"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BRAND_NAV, LOGO } from "@/lib/brand";

/** 브랜드 사이트 GNB — 로고 + 섹션 내비게이션. 좁은 화면에서는 펼침 메뉴로 바뀐다. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-oru-stone bg-oru-sand/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 md:h-[72px] md:px-10">
        <Link href="/brand" aria-label="Oru 브랜드 홈">
          <Image
            src={LOGO.ink}
            alt=""
            width={LOGO.width}
            height={LOGO.height}
            sizes="80px"
            className="h-7 w-auto md:h-8"
          />
        </Link>

        <nav aria-label="브랜드 메뉴" className="hidden md:block">
          <ul className="flex items-center gap-10">
            {BRAND_NAV.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-[12px] font-medium uppercase tracking-[0.22em] text-oru-forest/70 transition-colors hover:text-oru-ink"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="brand-mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
        >
          <span className="sr-only">{open ? "메뉴 닫기" : "메뉴 열기"}</span>
          <span aria-hidden="true" className="relative block h-3 w-6">
            <span
              className={`absolute left-0 h-px w-6 bg-oru-ink transition-transform ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-6 bg-oru-ink transition-transform ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav
          id="brand-mobile-nav"
          aria-label="브랜드 메뉴"
          className="border-t border-oru-stone md:hidden"
        >
          <ul className="flex flex-col px-5 py-3">
            {BRAND_NAV.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-[13px] font-medium uppercase tracking-[0.22em] text-oru-forest"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
