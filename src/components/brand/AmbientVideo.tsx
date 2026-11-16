"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 배경용 무음 반복 영상.
 * 화면 근처에 왔을 때만 영상을 불러오고, 그 전까지는 poster 를 보여 준다.
 * '동작 줄이기' 설정에서는 영상을 불러오지 않고 poster 만 남긴다.
 */
export function AmbientVideo({
  src,
  poster,
  label,
  className = "",
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // src 가 나중에 붙으면 autoplay 가 동작하지 않는 브라우저가 있어 직접 재생한다.
    // 저전력 모드 등으로 거절되면 poster 가 그대로 남는다.
    if (active) ref.current?.play().catch(() => {});
  }, [active]);

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      preload="none"
      className={className}
    />
  );
}
