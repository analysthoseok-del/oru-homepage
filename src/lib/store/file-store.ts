import { promises as fs } from "fs";
import path from "path";
import type { PostInput, StoredPost } from "@/lib/types";
import type { PostListResult, PostStore, UpdateResult } from "./adapter";
import { createId, createSeed } from "./seed";
import { StorageReadOnlyError } from "./errors";

/**
 * 로컬 개발용 파일 저장소.
 * DB 환경변수가 없을 때 사용하며, `data/posts.json` 에 영속화한다.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "posts.json");

/**
 * 파일시스템에 쓸 수 없는 환경(스토리지를 연결하지 않은 Vercel 배포 등)에서는
 * 읽기 전용으로 내려앉는다. 목록·상세는 시드 데이터로 정상 렌더링되고,
 * 쓰기 요청만 명확한 안내와 함께 거절된다.
 */
let readOnlySeed: StoredPost[] | null = null;

let writeQueue: Promise<unknown> = Promise.resolve();

/** 동시 요청으로 인한 파일 덮어쓰기를 막기 위한 직렬화 큐 */
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(task, task);
  writeQueue = run.catch(() => undefined);
  return run;
}

async function writeAll(posts: StoredPost[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

async function readAll(): Promise<StoredPost[]> {
  if (readOnlySeed) return readOnlySeed;

  try {
    return JSON.parse(await fs.readFile(DATA_FILE, "utf-8")) as StoredPost[];
  } catch {
    const seed = createSeed();
    try {
      await writeAll(seed);
    } catch (cause) {
      console.warn(
        "[store] 파일 저장소에 쓸 수 없어 읽기 전용으로 동작합니다.",
        cause,
      );
      readOnlySeed = seed;
    }
    return seed;
  }
}

function assertWritable(): void {
  if (readOnlySeed) throw new StorageReadOnlyError();
}

export const fileStore: PostStore = {
  async list(page: number, limit: number): Promise<PostListResult> {
    const posts = await readAll();
    const sorted = [...posts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
  },

  async get(id: string) {
    const posts = await readAll();
    return posts.find((post) => post.id === id);
  },

  create(input: PostInput) {
    return enqueue(async () => {
      const posts = await readAll();
      assertWritable();
      const now = new Date().toISOString();
      const post: StoredPost = {
        id: createId(),
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
  },

  update(id: string, input: Omit<PostInput, "author">): Promise<UpdateResult> {
    return enqueue(async () => {
      const posts = await readAll();
      assertWritable();
      const index = posts.findIndex((post) => post.id === id);
      if (index === -1) return { ok: false as const, reason: "not-found" as const };
      if (posts[index].password !== input.password) {
        return { ok: false as const, reason: "invalid-password" as const };
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
  },

  remove(id: string) {
    return enqueue(async () => {
      const posts = await readAll();
      assertWritable();
      const next = posts.filter((post) => post.id !== id);
      if (next.length === posts.length) return false;
      await writeAll(next);
      return true;
    });
  },
};
