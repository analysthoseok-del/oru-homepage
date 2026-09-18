import type { PostInput, StoredPost } from "@/lib/types";

export interface PostListResult {
  items: StoredPost[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export type UpdateResult =
  | { ok: true; post: StoredPost }
  | { ok: false; reason: "not-found" | "invalid-password" };

/** 저장소 구현이 지켜야 하는 계약. 파일 / Postgres 두 가지 구현이 있다. */
export interface PostStore {
  list(page: number, limit: number): Promise<PostListResult>;
  get(id: string): Promise<StoredPost | undefined>;
  create(input: PostInput): Promise<StoredPost>;
  update(id: string, input: Omit<PostInput, "author">): Promise<UpdateResult>;
  remove(id: string): Promise<boolean>;
}
