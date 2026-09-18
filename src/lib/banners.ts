export interface BannerSlide {
  id: string;
  /**
   * 배너 이미지 경로.
   * `public/banners/` 에 파일을 넣고 경로만 채우면 바로 반영된다.
   * (예: "/banners/banner-1.webp") — 비워 두면 그라디언트 + 타이틀로 표시된다.
   */
  src: string | null;
  /**
   * 배너 영상 경로. 지정하면 이미지 대신 무음 반복 재생된다.
   * 용량이 크므로 해당 슬라이드가 처음 노출될 때만 불러온다.
   */
  video?: string;
  alt: string;
  title: string;
  /** 이미지가 없을 때 사용할 배경 그라디언트 */
  gradient: string;
  /** 크롭 기준점. 카피가 잘리지 않도록 슬라이드마다 조정한다. */
  objectPosition?: string;
  /** 다음 슬라이드로 넘어가기까지의 시간(ms). 기본 4000 */
  durationMs?: number;
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
    src: "/banners/banner-2.png",
    alt: "젠 가든의 돌과 모래 결 — 고요한 웰니스 무드",
    title: "Carousel 🎨",
    gradient: "linear-gradient(97deg, #4B00C2 0%, #7C34FF 55%, #B58CFF 100%)",
    objectPosition: "center",
  },
  {
    id: "slide-3",
    src: null,
    video: "/banners/banner-3.mp4",
    alt: "물결이 번지는 브랜드 영상",
    title: "Carousel ✨",
    // 영상이 로드되기 전 잠깐 보일 배경
    gradient: "linear-gradient(97deg, #6400FF 0%, #A56BFF 50%, #E0CCFF 100%)",
    objectPosition: "center",
    // 5초 영상이 한 바퀴 돈 뒤 넘어가도록 조금 길게 잡는다.
    durationMs: 6000,
  },
];
