/**
 * Oru 브랜드 페이지(/brand)의 문구와 구성.
 * 카피·순서·이미지는 이 파일만 고치면 된다. 섹션 마크업은 `app/(brand)/brand/page.tsx`.
 *
 * 1차 시안: 문구는 배너에 이미 쓰인 브랜드 키워드
 * (Skincare Redefined / Longevity · Well-aging · Emotional Wellness / 지리산 · Namwon Sanctuary)를
 * 풀어 쓴 초안이며, 확정 카피가 아니다.
 */

export const BRAND_NAV = [
  { href: "#about", label: "About" },
  { href: "#story", label: "Story" },
  { href: "#philosophy", label: "Philosophy" },
  { href: "#ritual", label: "Ritual" },
  { href: "#sanctuary", label: "Sanctuary" },
] as const;

export const HERO = {
  image: "/banners/banner-1.webp",
  width: 1198,
  height: 592,
  /** 이미지 안에 카피가 들어 있으므로, 같은 내용을 스크린리더용 제목으로도 제공한다. */
  heading: "스킨케어를 넘어, 오롯이 나에게 집중하는 치유의 시간",
  alt: "안개가 내려앉은 지리산 남원의 숲 전경",
};

export const ABOUT = {
  eyebrow: "About Oru",
  title: ["오롯이,", "나에게로"],
  body: [
    "Oru는 바르는 순간보다 그 순간에 머무는 시간을 먼저 생각합니다.",
    "하루의 소음에서 한 걸음 물러나 피부와 호흡, 마음의 결을 함께 고르는 일. 우리는 그것을 스킨케어의 다음 정의라고 믿습니다.",
  ],
};

export const STORY = {
  eyebrow: "Brand Story",
  title: ["고요가 머무는 자리에서", "시작합니다"],
  body: [
    "모래 위에 번지는 물결처럼, 좋은 변화는 서두르지 않습니다. 덜어낼수록 선명해지는 것들이 있고, 피부도 그렇습니다.",
    "Oru는 더 많이 바르는 대신 더 깊이 머무는 방식을 제안합니다. 꼭 필요한 것만 남긴 제형, 손끝의 온도, 그리고 나를 위한 몇 분의 여백.",
  ],
  image: "/banners/banner-2.png",
  width: 598,
  height: 394,
  alt: "모래 결 위에 놓인 두 개의 돌",
};

export const PHILOSOPHY = {
  eyebrow: "Philosophy",
  title: "Skincare Redefined",
  lead: "Oru가 스킨케어를 다시 정의하는 세 가지 기준",
  pillars: [
    {
      index: "01",
      name: "Longevity",
      label: "오래 건강한 피부",
      body: "당장의 변화보다 오래 지속되는 건강함을 봅니다. 피부가 스스로 균형을 지키는 힘에 집중합니다.",
    },
    {
      index: "02",
      name: "Well-aging",
      label: "나답게 흐르는 시간",
      body: "시간을 거스르기보다 잘 지나가는 법을 고민합니다. 지금의 나에게 가장 편안한 결을 찾습니다.",
    },
    {
      index: "03",
      name: "Emotional Wellness",
      label: "마음까지 닿는 케어",
      body: "향과 촉감, 호흡의 속도까지 리추얼의 일부입니다. 피부를 돌보는 시간이 마음을 돌보는 시간이 되도록.",
    },
  ],
};

export const FILM = {
  video: "/banners/banner-3.mp4",
  label: "물결이 번지는 브랜드 영상",
  quote: ["잔물결이 가라앉듯,", "하루의 끝을 고요하게"],
};

export const RITUAL = {
  eyebrow: "The Oru Ritual",
  title: ["나에게 집중하는", "세 번의 호흡"],
  steps: [
    {
      index: "01",
      name: "Pause",
      label: "멈춤",
      body: "손을 씻고 조명을 낮춥니다. 하루를 내려놓는 것으로 리추얼을 시작합니다.",
    },
    {
      index: "02",
      name: "Breathe",
      label: "숨",
      body: "손바닥에 제형을 덜어 온기를 더하고, 향과 함께 천천히 세 번 호흡합니다.",
    },
    {
      index: "03",
      name: "Absorb",
      label: "스밈",
      body: "얼굴 안쪽에서 바깥으로 감싸듯 눌러 줍니다. 서두르지 않고 스며드는 시간을 기다립니다.",
    },
  ],
};

export const SANCTUARY = {
  eyebrow: "Namwon Sanctuary",
  title: ["지리산,", "남원의 숲에서"],
  body: [
    "안개가 능선을 넘어오는 아침, 숲은 아무것도 재촉하지 않습니다.",
    "Oru는 지리산 자락 남원의 그 고요함에서 출발했습니다. 도시의 일상 한가운데에서도 그 숲의 속도를 떠올릴 수 있기를 바랍니다.",
  ],
};

/** 푸터 사업자 정보. 값이 null 인 항목은 화면에 노출하지 않는다 — 확정되면 채워 넣는다. */
export const COMPANY: { label: string; value: string | null }[] = [
  { label: "상호", value: null },
  { label: "대표", value: null },
  { label: "사업자등록번호", value: null },
  { label: "통신판매업신고", value: null },
  { label: "주소", value: null },
  { label: "고객센터", value: null },
  { label: "이메일", value: null },
];
