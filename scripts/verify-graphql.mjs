#!/usr/bin/env node
/**
 * 코드캠프 GraphQL 백엔드 연동 점검 스크립트.
 *
 *   node scripts/verify-graphql.mjs           # 읽기만 확인 (기본)
 *   node scripts/verify-graphql.mjs --write   # 등록/수정/삭제/업로드까지 확인 후 정리
 */
const ENDPOINT =
  process.env.GRAPHQL_ENDPOINT ??
  "https://backend-practice.codebootcamp.co.kr/graphql";

const WRITE = process.argv.includes("--write");

let passed = 0;
let failed = 0;

function ok(label, detail = "") {
  passed += 1;
  console.log(`  ✅ ${label}${detail ? ` — ${detail}` : ""}`);
}
function ng(label, detail = "") {
  failed += 1;
  console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
}

async function gql(query, variables) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apollo-require-preflight": "true",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json().catch(() => null);
  if (!json) throw new Error(`응답 해석 실패 (HTTP ${res.status})`);
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

/** 앱이 실제로 사용하는 필드/인자 목록 */
const EXPECTED = {
  Board: ["_id", "writer", "title", "contents", "images", "createdAt", "updatedAt"],
  CreateBoardInput: ["writer", "password", "title", "contents", "images"],
  UpdateBoardInput: ["title", "contents", "images"],
  Query: ["fetchBoards", "fetchBoard", "fetchBoardsCount"],
  Mutation: ["createBoard", "updateBoard", "deleteBoard", "uploadFile"],
};

async function main() {
  console.log(`\n엔드포인트: ${ENDPOINT}\n`);

  console.log("[1] 스키마 확인");
  const schema = await gql(`
    query {
      __schema {
        queryType { name }
        types {
          name
          kind
          fields { name args { name } }
          inputFields { name }
        }
      }
    }
  `);

  const byName = Object.fromEntries(
    schema.__schema.types.map((type) => [type.name, type]),
  );

  for (const [typeName, expected] of Object.entries(EXPECTED)) {
    const type = byName[typeName];
    if (!type) {
      ng(`${typeName} 타입 없음`);
      continue;
    }
    const actual = new Set(
      [...(type.fields ?? []), ...(type.inputFields ?? [])].map((f) => f.name),
    );
    const missing = expected.filter((name) => !actual.has(name));
    if (missing.length) ng(`${typeName}`, `누락: ${missing.join(", ")}`);
    else ok(`${typeName}`, `${expected.length}개 필드 확인`);
  }

  // 앱이 넘기는 인자 이름 확인
  const mutation = byName.Mutation;
  const updateArgs = new Set(
    (mutation?.fields ?? [])
      .find((f) => f.name === "updateBoard")
      ?.args.map((a) => a.name) ?? [],
  );
  const needed = ["boardId", "password", "updateBoardInput"];
  const missingArgs = needed.filter((name) => !updateArgs.has(name));
  if (missingArgs.length) ng("updateBoard 인자", `누락: ${missingArgs.join(", ")}`);
  else ok("updateBoard 인자", needed.join(", "));

  console.log("\n[2] 읽기 동작");
  const list = await gql(
    `query { fetchBoards(page: 1) { _id writer title contents images createdAt updatedAt } fetchBoardsCount }`,
  );
  ok("fetchBoards(page: 1)", `${list.fetchBoards.length}건`);
  ok("fetchBoardsCount", `전체 ${list.fetchBoardsCount}건`);

  const sample = list.fetchBoards[0];
  if (sample) {
    const detail = await gql(
      `query fetchBoard($boardId: ID!) { fetchBoard(boardId: $boardId) { _id title contents writer images } }`,
      { boardId: sample._id },
    );
    ok("fetchBoard(boardId)", detail.fetchBoard.title);
  }

  const withImages = list.fetchBoards.find((b) => b.images?.some(Boolean));
  if (withImages) {
    const raw = withImages.images.find(Boolean);
    const url = /^https?:\/\//.test(raw)
      ? raw
      : `https://storage.googleapis.com/${raw}`;
    const res = await fetch(url, { method: "HEAD" });
    if (res.ok) ok("이미지 URL 접근", url.slice(0, 72) + "…");
    else ng("이미지 URL 접근", `HTTP ${res.status} — ${url}`);
  } else {
    console.log("  ℹ️  이미지가 붙은 게시글이 1페이지에 없어 URL 확인은 건너뜁니다.");
  }

  if (!WRITE) {
    console.log("\n쓰기 동작까지 확인하려면: node scripts/verify-graphql.mjs --write");
  } else {
    console.log("\n[3] 쓰기 동작 (테스트 글은 마지막에 삭제됩니다)");
    const password = "test1234";

    // 이미지 업로드
    let uploaded = null;
    try {
      const png = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        "base64",
      );
      const form = new FormData();
      form.append(
        "operations",
        JSON.stringify({
          query: `mutation uploadFile($file: Upload!) { uploadFile(file: $file) { url } }`,
          variables: { file: null },
        }),
      );
      form.append("map", JSON.stringify({ 0: ["variables.file"] }));
      form.append("0", new Blob([png], { type: "image/png" }), "pixel.png");

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "apollo-require-preflight": "true",
          "x-apollo-operation-name": "uploadFile",
        },
        body: form,
      });
      const json = await res.json();
      if (json.errors?.length) throw new Error(json.errors[0].message);
      uploaded = json.data.uploadFile.url;
      ok("uploadFile", uploaded);
    } catch (cause) {
      ng("uploadFile", cause.message);
    }

    const created = await gql(
      `mutation createBoard($createBoardInput: CreateBoardInput!) {
         createBoard(createBoardInput: $createBoardInput) { _id title writer images }
       }`,
      {
        createBoardInput: {
          writer: "연동점검",
          password,
          title: "[자동 점검] 삭제 예정 글",
          contents: "verify-graphql.mjs 가 생성한 임시 글입니다.",
          images: uploaded ? [uploaded] : [],
        },
      },
    );
    const boardId = created.createBoard._id;
    ok("createBoard", boardId);

    const updated = await gql(
      `mutation updateBoard($boardId: ID!, $password: String, $updateBoardInput: UpdateBoardInput!) {
         updateBoard(boardId: $boardId, password: $password, updateBoardInput: $updateBoardInput) { _id title writer }
       }`,
      {
        boardId,
        password,
        updateBoardInput: { title: "[자동 점검] 수정됨", contents: "수정 확인" },
      },
    );
    ok("updateBoard", updated.updateBoard.title);
    if (updated.updateBoard.writer === "연동점검") {
      ok("작성자 유지", "수정 후에도 writer 가 그대로입니다");
    } else {
      ng("작성자 유지", `writer 가 ${updated.updateBoard.writer} 로 바뀜`);
    }

    try {
      await gql(
        `mutation updateBoard($boardId: ID!, $password: String, $updateBoardInput: UpdateBoardInput!) {
           updateBoard(boardId: $boardId, password: $password, updateBoardInput: $updateBoardInput) { _id }
         }`,
        { boardId, password: "wrong", updateBoardInput: { title: "x" } },
      );
      ng("잘못된 비밀번호 거절", "에러 없이 통과했습니다");
    } catch (cause) {
      const matched = /비밀번호|password/i.test(cause.message);
      if (matched) ok("잘못된 비밀번호 거절", cause.message);
      else ng("비밀번호 에러 메시지 패턴", `앱의 분류 규칙과 다름: "${cause.message}"`);
    }

    await gql(`mutation deleteBoard($boardId: ID!) { deleteBoard(boardId: $boardId) }`, {
      boardId,
    });
    ok("deleteBoard", "테스트 글 정리 완료");
  }

  console.log(`\n결과: 성공 ${passed} / 실패 ${failed}\n`);
  process.exit(failed ? 1 : 0);
}

main().catch((cause) => {
  console.error(`\n중단: ${cause.message}\n`);
  process.exit(1);
});
