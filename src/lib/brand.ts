/**
 * Oru 브랜드 페이지(/brand)의 문구와 구성.
 * 카피·순서·이미지는 이 파일만 고치면 된다. 섹션 마크업은 `app/(brand)/brand/page.tsx`.
 *
 * 1차 시안: 문구는 배너에 이미 쓰인 브랜드 키워드
 * (Skincare Redefined / Longevity · Ritual · Emotional Wellness / 지리산 · Namwon Sanctuary)를
 * 풀어 쓴 초안이며, 확정 카피가 아니다.
 */

export const BRAND_NAV = [
  { href: "#product", label: "Product" },
  { href: "#about", label: "About" },
  { href: "#story", label: "Story" },
  { href: "#philosophy", label: "Philosophy" },
  { href: "#ritual", label: "Ritual" },
  { href: "#sanctuary", label: "Sanctuary" },
] as const;

/** 로고 워드마크. 원본 로고 파일에서 글자만 따 흰색/짙은색 두 벌로 만들었다. */
export const LOGO = {
  white: "/brand/oru-logo-white.png",
  ink: "/brand/oru-logo-ink.png",
  width: 622,
  height: 263,
  alt: "Oru",
};

export const HERO = {
  /** 4K 로 화질을 높인 물결 영상에서 박혀 있던 글자를 지우고, 절반 속도로 늦춰 끝과 처음을 이어 붙인 반복 영상 (2560px, 9초, 약 8.5MB) */
  video: "/brand/water.mp4",
  /** 영상이 뜨기 전, 그리고 '동작 줄이기' 설정에서 보이는 정지 화면 */
  poster: "/brand/water-poster.jpg",
  label: "잔잔하게 일렁이는 물결 영상",
  tagline: "Inner Light, Pure Skin",
  keywords: "Longevity · Ritual · Emotional Wellness",
};

/**
 * 대표 제품. 이름·성분·함량·용량은 제품 라벨에 적힌 그대로 옮겼다.
 * 가격과 구매 경로는 정해지지 않아 넣지 않았다.
 */
export const PRODUCT = {
  eyebrow: "Product",
  ritual: "Ritual #1",
  name: "Multi Bubble Serum",
  tagline: "boost your skin with",
  image: "/brand/multi-bubble-serum.jpg",
  width: 1047,
  height: 2000,
  alt: "Oru Multi Bubble Serum 150mL 펌프 용기",
  keyActivesLabel: "Key Actives",
  keyActives: [
    { index: "01", name: "Niacinamide B3", amount: "50,000ppm" },
    { index: "02", name: "5GF-Complex H", amount: "10,000ppm" },
    { index: "03", name: "Panthenol B5", amount: "10,000ppm" },
    { index: "04", name: "Super Centella", amount: "1,000ppm" },
    { index: "05", name: "Centella Asiatica", amount: "병풀잎수 363,862ppm" },
  ],
  supportingLabel: "Supporting Actives",
  supporting:
    "Adenosine · Caffeine · Ceramide NP · Hyaluronic Acid · Madecassoside · Allantoin · Green Tea · Lotus · Yuzu",
  benefits: [
    { ko: "진정", en: "Calming" },
    { ko: "쿨링", en: "Cooling" },
    { ko: "광채", en: "Radiance" },
    { ko: "탄력", en: "Firming" },
    { ko: "장벽", en: "Barrier" },
  ],
  volume: "150 mL / 5.07 fl.oz.",
};

export const ABOUT = {
  eyebrow: "About Oru",
  title: ["오롯이,", "나에게로"],
  body: [
    "Oru는 바르는 순간 그리고 그 순간에 머무는 마음의 시간을 함께 생각합니다.",
    "하루의 소음에서 잠시 벗어나 피부와 호흡, 마음의 결을 함께 어루만지는 시간. Oru가 정의하는 스킨케어입니다.",
  ],
};

export const STORY = {
  eyebrow: "Brand Story",
  title: ["고요가 머무는 자리에서", "시작합니다"],
  body: [
    "모래 위에 번지는 물결 같은 파동을 바라보듯이, 내면의 안정에 잠시 귀 기울여봅니다. 덜어낼수록 선명해지는 것들이 있고, 피부도 그렇습니다.",
    "Oru는 더 많이 바르는 대신 더 깊이 머무는 방식을 제안합니다. 꼭 필요한 것만 남긴 제형, 손끝의 온도, 그리고 나를 위한 몇 분의 여백.",
  ],
  image: "/brand/stones.webp",
  /** 위 사진에서 돌과 받침, 벽은 고정하고 모래 고리만 가운데에서 바깥으로 흘러가게 만든 16초 반복 영상. 사진은 영상이 뜨기 전 정지 화면으로 쓴다. */
  video: "/brand/sand.mp4",
  width: 1536,
  height: 1024,
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
      body: "순간이 아닌 오랜 기간 지속되는 피부의 건강함. 피부가 스스로 균형을 지키는 힘에 집중합니다.",
    },
    {
      index: "02",
      name: "Ritual",
      label: "나를 위한 작은 의식",
      body: "한 번의 특별한 관리보다 Daily Routine을 믿습니다. 나에게 집중하는 일상의 순간, 피부의 안식과 리듬을 만듭니다.",
    },
    {
      index: "03",
      name: "Emotional Wellness",
      label: "마음까지 닿는 케어",
      body: "향과 촉감, 호흡의 속도까지 리추얼의 일부입니다. 피부를 돌보는 시간이 마음을 돌보는 시간이 되도록.",
    },
  ],
};

export const RITUAL = {
  eyebrow: "The Oru Ritual",
  title: ["나에게 집중하는", "세 단계의 리추얼"],
  steps: [
    {
      index: "01",
      name: "Release",
      label: "비움",
      body: "숨을 길게 내쉬며 얼굴을 감싸 줍니다. 손바닥의 온기 아래로 긴장이 풀리고, 피부는 한결 부드러워집니다.",
    },
    {
      index: "02",
      name: "Rest",
      label: "휴식",
      body: "아무것도 더하지 않는 시간을 둡니다. 호흡을 고르고, 피부가 스스로 숨 쉴 여백을 줍니다.",
    },
    {
      index: "03",
      name: "Replenish",
      label: "채움",
      body: "비워 낸 자리에 꼭 필요한 것만 채웁니다. 손끝의 온기로 감싸듯 눌러, 깊이 스며들기를 기다립니다.",
    },
  ],
};

export const SANCTUARY = {
  /** 배너 원본(banners/banner-1.webp)에서 박혀 있던 카피를 지운 숲 이미지 */
  image: "/brand/forest.webp",
  alt: "안개가 내려앉은 지리산 남원의 숲 전경",
  eyebrow: "Namwon Sanctuary",
  title: ["지리산,", "남원의 숲에서"],
  body: [
    "안개가 능선을 넘어오는 아침, 숲은 아무것도 재촉하지 않습니다.",
    "Oru는 지리산 자락 남원의 숲이 건네는 고요를 담았습니다. 분주한 하루의 끝, 그 숲의 공기가 당신의 피부에 닿기를 바랍니다.",
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
