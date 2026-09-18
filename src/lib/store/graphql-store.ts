import {
  gql,
  GraphQLRequestError,
  toImagePath,
  toImageUrl,
} from "@/lib/graphql/client";
import type { PostInput, StoredPost } from "@/lib/types";
import type { PostListResult, PostStore, UpdateResult } from "./adapter";

/**
 * 코드캠프 실습 백엔드(GraphQL) 저장소.
 * 게시글·이미지가 모두 원격에 저장되므로 배포 환경에 별도 DB/스토리지가 필요 없다.
 */

/** fetchBoards 는 페이지당 10건 고정이다. */
export const GRAPHQL_PAGE_SIZE = 10;

interface BoardDto {
  _id: string;
  writer: string | null;
  title: string;
  contents: string;
  images: (string | null)[] | null;
  createdAt: string;
  updatedAt: string | null;
}

const BOARD_FIELDS = `
  _id
  writer
  title
  contents
  images
  createdAt
  updatedAt
`;

function toPost(board: BoardDto): StoredPost {
  return {
    id: board._id,
    title: board.title,
    content: board.contents,
    author: board.writer ?? "익명",
    images: (board.images ?? [])
      .filter((src): src is string => Boolean(src))
      .map(toImageUrl),
    // 비밀번호는 백엔드가 검증하므로 클라이언트로 내려오지 않는다.
    password: "",
    createdAt: board.createdAt,
    updatedAt: board.updatedAt ?? board.createdAt,
  };
}

/** 백엔드 에러 메시지를 화면 처리용으로 분류한다. */
function classify(cause: unknown): "not-found" | "invalid-password" | null {
  if (!(cause instanceof GraphQLRequestError)) return null;
  const message = cause.message ?? "";
  if (/비밀번호|password/i.test(message)) return "invalid-password";
  if (/등록되지|존재하지|찾을 수 없|not found/i.test(message)) return "not-found";
  return null;
}

export const graphqlStore: PostStore = {
  async list(page: number): Promise<PostListResult> {
    const data = await gql<{ fetchBoards: BoardDto[]; fetchBoardsCount: number }>(
      `query fetchBoards($page: Int) {
         fetchBoards(page: $page) { ${BOARD_FIELDS} }
         fetchBoardsCount
       }`,
      { page },
    );

    const items = data.fetchBoards.map(toPost);
    const total = data.fetchBoardsCount;
    return {
      items,
      page,
      limit: GRAPHQL_PAGE_SIZE,
      total,
      // 공용 게시판이라 조회 사이에 글이 지워지면 fetchBoardsCount 가 실제보다
      // 클 수 있다. 빈 페이지가 오면 개수와 무관하게 끝으로 처리한다.
      hasMore:
        items.length > 0 &&
        (page - 1) * GRAPHQL_PAGE_SIZE + items.length < total,
    };
  },

  async get(id: string) {
    try {
      const data = await gql<{ fetchBoard: BoardDto }>(
        `query fetchBoard($boardId: ID!) {
           fetchBoard(boardId: $boardId) { ${BOARD_FIELDS} }
         }`,
        { boardId: id },
      );
      return toPost(data.fetchBoard);
    } catch (cause) {
      // 없는 글이면 GraphQL 에러가 오므로 undefined 로 바꿔 404 처리한다.
      if (cause instanceof GraphQLRequestError) return undefined;
      throw cause;
    }
  },

  async create(input: PostInput) {
    const data = await gql<{ createBoard: BoardDto }>(
      `mutation createBoard($createBoardInput: CreateBoardInput!) {
         createBoard(createBoardInput: $createBoardInput) { ${BOARD_FIELDS} }
       }`,
      {
        createBoardInput: {
          writer: input.author,
          password: input.password,
          title: input.title,
          contents: input.content,
          images: input.images.map(toImagePath),
        },
      },
    );
    return toPost(data.createBoard);
  },

  async update(
    id: string,
    input: Omit<PostInput, "author">,
  ): Promise<UpdateResult> {
    try {
      const data = await gql<{ updateBoard: BoardDto }>(
        `mutation updateBoard(
           $boardId: ID!
           $password: String
           $updateBoardInput: UpdateBoardInput!
         ) {
           updateBoard(
             boardId: $boardId
             password: $password
             updateBoardInput: $updateBoardInput
           ) { ${BOARD_FIELDS} }
         }`,
        {
          boardId: id,
          password: input.password,
          // 작성자명(writer)은 수정 입력에 포함하지 않는다.
          updateBoardInput: {
            title: input.title,
            contents: input.content,
            images: input.images.map(toImagePath),
          },
        },
      );
      return { ok: true, post: toPost(data.updateBoard) };
    } catch (cause) {
      const reason = classify(cause);
      if (reason) return { ok: false, reason };
      throw cause;
    }
  },

  async remove(id: string) {
    try {
      await gql<{ deleteBoard: string }>(
        `mutation deleteBoard($boardId: ID!) { deleteBoard(boardId: $boardId) }`,
        { boardId: id },
      );
      return true;
    } catch (cause) {
      if (classify(cause) === "not-found") return false;
      throw cause;
    }
  },
};
