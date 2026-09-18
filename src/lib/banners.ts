export interface BannerSlide {
  id: string;
  /**
   * 배너 이미지 경로.
   * `public/banners/` 에 이미지를 넣고 경로만 채우면 바로 반영된다.
   * (예: "/banners/banner-1.webp") — 비워 두면 그라디언트 + 타이틀로 표시된다.
   */
  src: string | null;
  alt: string;
  title: string;
  /** 이미지가 없을 때 사용할 배경 그라디언트 */
  gradient: string;
  /** 크롭 기준점. 카피가 잘리지 않도록 슬라이드마다 조정한다. */
  objectPosition?: string;
}

export const BANNER_SLIDES: BannerSlide[] = [
  {
    id: "slide-1",
    src: "/banners/banner-1.webp",
    alt: "지리산 남원의 숲 전경 — 스킨케어를 넘어, 오롯이 나에게 집중하는 치유의 시간",
    title: "Carousel 🚀",
    gradient: "linear-gradient(97deg, #6400FF 0%, #9B5CFF 55%, #C4A2FF 100%)",
    objectPosition: "center bottom",
  },
  {
    id: "slide-2",
    src: null,
    alt: "두 번째 배너",
    title: "Carousel 🎨",
    gradient: "linear-gradient(97deg, #4B00C2 0%, #7C34FF 55%, #B58CFF 100%)",
  },
  {
    id: "slide-3",
    src: null,
    alt: "세 번째 배너",
    title: "Carousel ✨",
    gradient: "linear-gradient(97deg, #6400FF 0%, #A56BFF 50%, #E0CCFF 100%)",
  },
];
