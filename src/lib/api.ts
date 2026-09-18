import type { Post, PostListResponse } from "./types";

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? "요청을 처리하지 못했습니다.");
  }
  return (await response.json()) as T;
}

export async function fetchPosts(page: number, limit = 10) {
  const response = await fetch(`/api/posts?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });
  return parse<PostListResponse>(response);
}

export async function createPost(input: {
  title: string;
  content: string;
  author: string;
  password: string;
  images: string[];
}) {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parse<Post>(response);
}

export async function updatePost(
  id: string,
  input: { title: string; content: string; password: string; images: string[] },
) {
  const response = await fetch(`/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parse<Post>(response);
}

export async function deletePost(id: string) {
  const response = await fetch(`/api/posts/${id}`, { method: "DELETE" });
  return parse<{ ok: boolean }>(response);
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  return parse<{ url: string }>(response);
}
