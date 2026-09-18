import type { PostInput } from "@/lib/types";
import { fileStore } from "./file-store";
import { GRAPHQL_PAGE_SIZE, graphqlStore } from "./graphql-store";
import { getConnectionString, postgresStore } from "./postgres-store";

export type { PostListResult, UpdateResult } from "./adapter";
export { StorageReadOnlyError } from "./errors";

export type BoardBackend = "graphql" | "postgres" | "file";

/**
 * 백엔드 선택 (`BOARD_BACKEND` 환경변수).
 * - `graphql` (기본값) — 코드캠프 실습 백엔드. 별도 DB/스토리지 없이 동작한다.
 * - `postgres` — Postgres + Vercel Blob
 * - `file` — 로컬 파일(`data/posts.json`)
 */
export function getBackend(): BoardBackend {
  const configured = process.env.BOARD_BACKEND?.toLowerCase();
  if (configured === "postgres" || configured === "file") return configured;
  if (configured === "graphql") return "graphql";
  // 값이 없을 때: Postgres 연결 문자열이 있으면 Postgres, 아니면 GraphQL
  return getConnectionString() ? "postgres" : "graphql";
}

/** 목록 페이지 크기. GraphQL 백엔드는 페이지당 10건 고정이다. */
export const PAGE_SIZE = GRAPHQL_PAGE_SIZE;

function store() {
  switch (getBackend()) {
    case "postgres":
      return postgresStore;
    case "file":
      return fileStore;
    default:
      return graphqlStore;
  }
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
