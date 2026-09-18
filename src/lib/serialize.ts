import type { Post, StoredPost } from "./types";

/** 비밀번호를 제외한 공개 응답 형태로 변환 */
export function toPublicPost(post: StoredPost): Post {
  const { password: _password, ...rest } = post;
  void _password;
  return rest;
}
