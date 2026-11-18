"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * 스크롤에 맞춰 아래에서 떠오르는 요소.
 * 가장 가까운 `[data-rise-scope]`(없으면 자기 자신)가 화면 아래에서 올라오는 만큼
 * 위로 올라오며 또렷해진다. 스크롤을 되돌리면 다시 가라앉는다.
 * '동작 줄이기' 설정에서는 움직이지 않는다.
 */
export function RiseOnScroll({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scope = el.closest<HTMLElement>("[data-rise-scope]") ?? el;

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const progress = Math.min(
        1,
        Math.max(0, (vh - scope.getBoundingClientRect().top) / (vh * 0.95)),
      );
      const eased = 1 - Math.pow(1 - progress, 3);
      el.style.transform = `translate3d(0, ${((1 - eased) * vh * 0.5).toFixed(1)}px, 0) scale(${(0.9 + 0.1 * eased).toFixed(3)})`;
      el.style.opacity = Math.min(1, progress * 1.8).toFixed(3);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div ref={ref} data-rise="" className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
