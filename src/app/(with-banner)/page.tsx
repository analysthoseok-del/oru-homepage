import { connection } from "next/server";
import { PostList } from "@/components/board/PostList";
import { listPosts } from "@/lib/store";
import { toPublicPost } from "@/lib/serialize";

const PAGE_SIZE = 10;

/** http://localhost:3000 첫 화면 = 게시글 목록 */
export default async function HomePage() {
  // 목록은 항상 최신 데이터를 보여줘야 하므로 요청 시점에 렌더링한다.
  await connection();
  const { items, hasMore } = await listPosts(1, PAGE_SIZE);

  return (
    <PostList
      initialPosts={items.map(toPublicPost)}
      initialHasMore={hasMore}
      pageSize={PAGE_SIZE}
    />
  );
}
