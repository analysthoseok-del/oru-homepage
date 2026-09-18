import type { PostInput } from "@/lib/types";
import { fileStore } from "./file-store";
import { getConnectionString, postgresStore } from "./postgres-store";

export type { PostListResult, UpdateResult } from "./adapter";
export { StorageReadOnlyError } from "./errors";

/**
 * 저장소 선택.
 * - Postgres 연결 문자열이 있으면(Vercel 배포) Postgres
 * - 없으면 파일 저장소(로컬 개발) — 별도 세팅 없이 `pnpm dev` 로 바로 실행된다.
 */
function store() {
  return getConnectionString() ? postgresStore : fileStore;
}

export function listPosts(page: number, limit: number) {
  return store().list(page, limit);
}

export function getPost(id: string) {
  return store().get(id);
}

export function createPost(input: PostInput) {
  return store().create(input);
}

export function updatePost(id: string, input: Omit<PostInput, "author">) {
  return store().update(id, input);
}

export function deletePost(id: string) {
  return store().remove(id);
}
