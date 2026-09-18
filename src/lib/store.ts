import { promises as fs } from "fs";
import path from "path";
import type { PostInput, StoredPost } from "./types";

/**
 * 파일 기반 저장소.
 * 별도 DB 없이 동작하도록 `data/posts.json` 에 게시글을 영속화한다.
 * 최초 실행 시 시드 데이터를 생성한다.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "posts.json");

const SEED_CONTENT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae eget in tincidunt vitae sed. Sollicitudin pharetra, eros, maecenas sed. Proin venenatis aliquet neque in ut. Non mattis dolor sed ultricies a turpis purus, etiam morbi.";

const SEED_IMAGES = [
  "/samples/sample-1.svg",
  "/samples/sample-2.svg",
  "/samples/sample-3.svg",
];

/** 무한 스크롤 확인이 가능하도록 27건을 시드한다. */
function createSeed(): StoredPost[] {
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

let writeQueue: Promise<unknown> = Promise.resolve();

/** 동시 요청으로 인한 파일 덮어쓰기를 막기 위한 직렬화 큐 */
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(task, task);
  writeQueue = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<StoredPost[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as StoredPost[];
  } catch {
    const seed = createSeed();
    await writeAll(seed);
    return seed;
  }
}

async function writeAll(posts: StoredPost[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

/** 최신순 정렬 목록 */
export async function listPosts(page: number, limit: number) {
  const posts = await readAll();
  const sorted = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const start = (page - 1) * limit;
  const items = sorted.slice(start, start + limit);
  return {
    items,
    page,
    limit,
    total: sorted.length,
    hasMore: start + items.length < sorted.length,
  };
}

export async function getPost(id: string): Promise<StoredPost | undefined> {
  const posts = await readAll();
  return posts.find((post) => post.id === id);
}

export async function createPost(input: PostInput): Promise<StoredPost> {
  return enqueue(async () => {
    const posts = await readAll();
    const now = new Date().toISOString();
    const post: StoredPost = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      title: input.title,
      content: input.content,
      author: input.author,
      password: input.password,
      images: input.images,
      createdAt: now,
      updatedAt: now,
    };
    await writeAll([post, ...posts]);
    return post;
  });
}

export type UpdateResult =
  | { ok: true; post: StoredPost }
  | { ok: false; reason: "not-found" | "invalid-password" };

export async function updatePost(
  id: string,
  input: Omit<PostInput, "author">,
): Promise<UpdateResult> {
  return enqueue(async () => {
    const posts = await readAll();
    const index = posts.findIndex((post) => post.id === id);
    if (index === -1) return { ok: false, reason: "not-found" as const };
    if (posts[index].password !== input.password) {
      return { ok: false, reason: "invalid-password" as const };
    }
    // 작성자명은 수정 대상에서 제외한다.
    const updated: StoredPost = {
      ...posts[index],
      title: input.title,
      content: input.content,
      images: input.images,
      updatedAt: new Date().toISOString(),
    };
    posts[index] = updated;
    await writeAll(posts);
    return { ok: true as const, post: updated };
  });
}

export async function deletePost(id: string): Promise<boolean> {
  return enqueue(async () => {
    const posts = await readAll();
    const next = posts.filter((post) => post.id !== id);
    if (next.length === posts.length) return false;
    await writeAll(next);
    return true;
  });
}
