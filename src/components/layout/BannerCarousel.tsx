"use client";

import { useCallback, useEffect, useState } from "react";
import { BANNER_SLIDES } from "@/lib/banners";

const AUTOPLAY_MS = 4000;

/** 레이아웃에 포함되는 배너 캐러셀 (3장 자동 롤링 + 인디케이터) */
export function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = BANNER_SLIDES.length;

  const goTo = useCallback((next: number) => {
    setIndex(((next % BANNER_SLIDES.length) + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, total]);

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
      {BANNER_SLIDES.map((slide, slideIndex) => (
        <div
          key={slide.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${slideIndex + 1} / ${total}`}
          aria-hidden={slideIndex !== index}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
            slideIndex === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          style={slide.src ? undefined : { backgroundImage: slide.gradient }}
        >
          {slide.src ? (
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
      ))}

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
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
