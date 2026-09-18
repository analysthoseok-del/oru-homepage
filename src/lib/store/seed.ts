import type { StoredPost } from "@/lib/types";

const SEED_CONTENT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae eget in tincidunt vitae sed. Sollicitudin pharetra, eros, maecenas sed. Proin venenatis aliquet neque in ut. Non mattis dolor sed ultricies a turpis purus, etiam morbi.";

const SEED_IMAGES = [
  "/samples/sample-1.svg",
  "/samples/sample-2.svg",
  "/samples/sample-3.svg",
];

/** 무한 스크롤을 바로 확인할 수 있도록 27건을 시드한다. */
export function createSeed(): StoredPost[] {
  const base = new Date("2022-03-28T13:00:00+09:00").getTime();
  return Array.from({ length: 27 }, (_, i) => {
    const createdAt = new Date(base - i * 60 * 60 * 1000).toISOString();
    return {
      id: `seed-${String(27 - i).padStart(2, "0")}`,
      title: "글 제목",
      content: SEED_CONTENT,
      author: "작성자명",
      // 이미지가 없는 상세 화면도 확인할 수 있도록 3건마다 비워 둔다.
      images: i % 3 === 2 ? [] : SEED_IMAGES,
      password: "1234",
      createdAt,
      updatedAt: createdAt,
    };
  });
}

export function createId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
