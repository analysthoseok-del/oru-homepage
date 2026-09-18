/**
 * 코드캠프 실습용 GraphQL 백엔드 클라이언트.
 * 서버(RSC / Route Handler)에서 호출하므로 브라우저 CORS 이슈가 없다.
 */
export const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT ??
  "https://backend-practice.codebootcamp.co.kr/graphql";

/** 업로드 결과가 경로만 돌아올 때 붙이는 스토리지 호스트 */
const STORAGE_PREFIX = "https://storage.googleapis.com/";

export interface GraphQLErrorItem {
  message: string;
  extensions?: { code?: string };
}

export class GraphQLRequestError extends Error {
  readonly errors: GraphQLErrorItem[];

  constructor(message: string, errors: GraphQLErrorItem[] = []) {
    super(message);
    this.name = "GraphQLRequestError";
    this.errors = errors;
  }
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLErrorItem[];
}

export async function gql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Apollo CSRF 방지 설정이 켜져 있어도 통과하도록 preflight 헤더를 붙인다.
      "apollo-require-preflight": "true",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const payload = (await response
    .json()
    .catch(() => null)) as GraphQLResponse<T> | null;

  if (!payload) {
    throw new GraphQLRequestError(
      `GraphQL 응답을 해석하지 못했습니다. (HTTP ${response.status})`,
    );
  }

  if (payload.errors?.length) {
    throw new GraphQLRequestError(payload.errors[0].message, payload.errors);
  }

  if (!payload.data) {
    throw new GraphQLRequestError("GraphQL 응답에 data 가 없습니다.");
  }

  return payload.data;
}

/**
 * GraphQL multipart request 규격으로 파일을 업로드한다.
 * (uploadFile(file: Upload!): FileInfo!)
 */
export async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append(
    "operations",
    JSON.stringify({
      query: `mutation uploadFile($file: Upload!) { uploadFile(file: $file) { url } }`,
      variables: { file: null },
    }),
  );
  form.append("map", JSON.stringify({ "0": ["variables.file"] }));
  form.append("0", file, file.name);

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "apollo-require-preflight": "true",
      "x-apollo-operation-name": "uploadFile",
    },
    body: form,
  });

  const payload = (await response.json().catch(() => null)) as GraphQLResponse<{
    uploadFile: { url: string };
  }> | null;

  if (!payload) {
    throw new GraphQLRequestError(
      `업로드 응답을 해석하지 못했습니다. (HTTP ${response.status})`,
    );
  }
  if (payload.errors?.length) {
    throw new GraphQLRequestError(payload.errors[0].message, payload.errors);
  }

  const url = payload.data?.uploadFile?.url;
  if (!url) throw new GraphQLRequestError("업로드 결과에 url 이 없습니다.");
  return url;
}

/** 저장된 값(경로 또는 URL)을 화면에서 쓸 수 있는 URL 로 바꾼다. */
export function toImageUrl(value: string): string {
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;
  return `${STORAGE_PREFIX}${value}`;
}

/** 백엔드에 저장할 때는 호스트를 떼고 경로만 보낸다. */
export function toImagePath(value: string): string {
  return value.startsWith(STORAGE_PREFIX)
    ? value.slice(STORAGE_PREFIX.length)
    : value;
}
