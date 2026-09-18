"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiMessageRoundedAdd, BiSolidMessageRoundedAdd } from "react-icons/bi";
import { MdFormatListBulleted } from "react-icons/md";
import { Logo } from "@/components/ui/Logo";

const MENUS = [
  {
    href: "/",
    label: "전체 글 보기",
    ActiveIcon: MdFormatListBulleted,
    InactiveIcon: MdFormatListBulleted,
    match: (pathname: string) => pathname === "/" || pathname.startsWith("/posts/"),
  },
  {
    href: "/posts/new",
    label: "새 글 작성",
    ActiveIcon: BiSolidMessageRoundedAdd,
    InactiveIcon: BiMessageRoundedAdd,
    match: (pathname: string) =>
      pathname === "/posts/new" || pathname.endsWith("/edit"),
  },
] as const;

/** 레이아웃 구조로 분리된 사이드바(GNB). 어느 화면에서도 목록/작성으로 이동한다. */
export function Sidebar() {
  const pathname = usePathname();
  // 작성·수정 화면에서는 '새 글 작성'만 활성화되도록 우선순위를 둔다.
  const activeHref = MENUS.slice()
    .reverse()
    .find((menu) => menu.match(pathname))?.href;

  return (
    <aside className="w-full shrink-0 lg:w-[248px] lg:self-stretch">
      <nav className="h-full rounded-2xl bg-white px-7 py-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <Link href="/" aria-label="TALKR 홈">
          <Logo />
        </Link>

        <hr className="my-6 border-line" />

        <ul className="flex flex-col gap-5">
          {MENUS.map(({ href, label, ActiveIcon, InactiveIcon }) => {
            const isActive = activeHref === href;
            const Icon = isActive ? ActiveIcon : InactiveIcon;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className="group flex items-center gap-3"
                >
                  <Icon
                    size={22}
                    className={
                      isActive
                        ? "text-main"
                        : "text-font-sub transition-colors group-hover:text-main"
                    }
                  />
                  <span
                    className={`text-[15px] font-bold transition-colors ${
                      isActive
                        ? "text-font-strong"
                        : "text-font-sub group-hover:text-font-strong"
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
