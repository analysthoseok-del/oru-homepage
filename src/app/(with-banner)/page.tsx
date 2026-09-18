import { PostList } from "@/components/board/PostList";
import { listPosts } from "@/lib/store";
import { toPublicPost } from "@/lib/serialize";

const PAGE_SIZE = 10;

/** http://localhost:3000 첫 화면 = 게시글 목록 */
export default async function HomePage() {
  const { items, hasMore } = await listPosts(1, PAGE_SIZE);

  return (
    <PostList
      initialPosts={items.map(toPublicPost)}
      initialHasMore={hasMore}
      pageSize={PAGE_SIZE}
    />
  );
}
