"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { BANNER_SLIDES } from "@/lib/banners";

const DEFAULT_DURATION_MS = 4000;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** 사용자의 '동작 줄이기' 설정 구독 */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION_QUERY);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/** 레이아웃에 포함되는 배너 캐러셀 (3장 자동 롤링 + 인디케이터) */
export function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // 한 번이라도 노출된 슬라이드. 영상은 여기에 들어온 뒤에야 불러온다.
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0]));
  const reducedMotion = usePrefersReducedMotion();
  const total = BANNER_SLIDES.length;

  const goTo = useCallback((next: number) => {
    const target = ((next % total) + total) % total;
    setIndex(target);
    setSeen((current) =>
      current.has(target) ? current : new Set(current).add(target),
    );
  }, [total]);

  useEffect(() => {
    if (paused || reducedMotion || total <= 1) return;
    const duration = BANNER_SLIDES[index].durationMs ?? DEFAULT_DURATION_MS;
    const timer = setTimeout(() => goTo(index + 1), duration);
    return () => clearTimeout(timer);
  }, [goTo, index, paused, reducedMotion, total]);

  return (
    <section
      aria-label="배너"
      aria-roledescription="carousel"
      /* 좁은 화면에서는 배너 비율을 배너 이미지(약 2:1)에 맞춰 카피가 잘리지 않게 한다. */
      className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl md:aspect-auto md:h-[280px] lg:h-[350px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {BANNER_SLIDES.map((slide, slideIndex) => {
        const isActive = slideIndex === index;
        return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} / ${total}`}
            aria-hidden={!isActive}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
              isActive ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={
              slide.src && !slide.video
                ? undefined
                : { backgroundImage: slide.gradient }
            }
          >
            {slide.video ? (
              // 용량이 큰 영상은 해당 슬라이드가 처음 보일 때 붙인다.
              seen.has(slideIndex) && (
                <video
                  src={slide.video}
                  aria-label={slide.alt}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: slide.objectPosition ?? "center" }}
                  // 동작 줄이기 설정이면 자동 재생하지 않고 첫 프레임만 보여준다.
                  autoPlay={!reducedMotion}
                  preload={reducedMotion ? "metadata" : "none"}
                  muted
                  loop
                  playsInline
                />
              )
            ) : slide.src ? (
              // 사용자가 직접 넣는 배너 이미지 (public/banners)
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.src}
                alt={slide.alt}
                className="h-full w-full object-cover"
                style={{ objectPosition: slide.objectPosition ?? "center" }}
              />
            ) : (
              <p className="select-none text-[38px] font-extrabold text-white md:text-[52px] lg:text-[64px]">
                {slide.title}
              </p>
            )}
          </div>
        );
      })}

      {/* 밝은 배너 이미지 위에서도 흰 점이 보이도록 그림자를 준다. */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.45))]">
        {BANNER_SLIDES.map((slide, slideIndex) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`${slideIndex + 1}번 배너로 이동`}
            aria-current={slideIndex === index}
            onClick={() => goTo(slideIndex)}
            className={`h-2 w-2 rounded-full transition-all ${
              slideIndex === index ? "bg-white" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
