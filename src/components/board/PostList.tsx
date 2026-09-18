"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchPosts } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { Post } from "@/lib/types";

interface PostListProps {
  initialPosts: Post[];
  initialHasMore: boolean;
  pageSize: number;
}

/** 게시글 목록 + 무한 스크롤 (1페이지는 서버에서 렌더링된 값을 그대로 사용) */
export function PostList({
  initialPosts,
  initialHasMore,
  pageSize,
}: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  // 이미 붙인 글 id. 공용 게시판이라 페이지 사이에 중복이 섞일 수 있다.
  const seenRef = useRef(new Set(initialPosts.map((post) => post.id)));

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const data = await fetchPosts(nextPage, pageSize);
      const fresh = data.items.filter((post) => !seenRef.current.has(post.id));
      fresh.forEach((post) => seenRef.current.add(post.id));

      setPosts((current) => [...current, ...fresh]);
      setPage(nextPage);
      // 새로 붙은 글이 하나도 없으면 더 요청하지 않는다(빈 페이지 반복 방지).
      setHasMore(data.hasMore && fresh.length > 0);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "목록을 불러오지 못했습니다.",
      );
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore, page, pageSize]);

  // 목록 하단(끝)에 도달하면 다음 페이지를 자동으로 불러온다.
  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "160px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="sr-only">전체 글 보기</h1>

      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="flex items-center justify-between gap-4 rounded-xl bg-white px-7 py-5 shadow-[0_1px_6px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_3px_14px_rgba(100,0,255,0.12)]"
        >
          <span className="truncate text-[15px] font-bold text-font-base">
            {post.title}
          </span>
          <time
            dateTime={post.createdAt}
            className="shrink-0 text-[13px] text-font-sub"
          >
            {formatDateTime(post.createdAt)}
          </time>
        </Link>
      ))}

      {error && <p className="py-6 text-center text-[14px] text-main">{error}</p>}

      {loading && (
        <p className="py-6 text-center text-[14px] text-font-sub">불러오는 중…</p>
      )}

      {posts.length === 0 && !loading && (
        <p className="rounded-xl bg-white py-16 text-center text-[15px] text-font-sub">
          등록된 게시글이 없습니다.
        </p>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="py-6 text-center text-[13px] text-font-sub">
          마지막 게시글입니다.
        </p>
      )}

      <div ref={sentinelRef} aria-hidden className="h-1 w-full" />
    </div>
  );
}
