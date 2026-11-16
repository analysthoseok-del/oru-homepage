"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 배경용 무음 반복 영상.
 * 파일이 크므로 화면 근처에 왔을 때만 불러오고, '동작 줄이기' 설정에서는 불러오지 않는다.
 */
export function AmbientVideo({
  src,
  label,
  className = "",
}: {
  src: string;
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

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      aria-label={label}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      className={className}
    />
  );
}
