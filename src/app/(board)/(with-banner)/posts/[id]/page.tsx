import { notFound } from "next/navigation";
import { MdAccountCircle } from "react-icons/md";
import { PostDetailActions } from "@/components/board/PostDetailActions";
import { getPost } from "@/lib/store";

/** 목록에서 클릭한 게시글 ID로 상세를 조회한다. */
export default async function PostDetailPage({
  params,
}: PageProps<"/posts/[id]">) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const hasImages = post.images.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <article className="rounded-2xl bg-white px-8 py-9 shadow-[0_1px_6px_rgba(0,0,0,0.03)] lg:px-10 lg:py-10">
        <h1 className="text-[20px] font-bold text-font-strong">{post.title}</h1>
        <hr className="mt-6 border-line" />

        {/* 이미지가 없으면 빈 영역 없이 작성자/내용이 바로 이어진다. */}
        {hasImages && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {post.images.map((src, index) => (
              // 런타임 업로드 이미지라 최적화 없이 그대로 노출한다.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${src}-${index}`}
                src={src}
                alt={`${post.title} 첨부 이미지 ${index + 1}`}
                className="h-[110px] w-full rounded-lg object-cover sm:h-[130px]"
              />
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-8">
          <div className="flex shrink-0 items-center gap-2 sm:w-[150px]">
            <MdAccountCircle size={26} className="text-main" />
            <span className="text-[15px] font-bold text-font-strong">
              {post.author}
            </span>
          </div>
          <p className="min-w-0 flex-1 whitespace-pre-wrap text-[15px] leading-[1.75] text-font-base">
            {post.content}
          </p>
        </div>
      </article>

      <PostDetailActions id={post.id} />
    </div>
  );
}
