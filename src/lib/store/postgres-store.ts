import { Pool } from "pg";
import type { PostInput, StoredPost } from "@/lib/types";
import type { PostListResult, PostStore, UpdateResult } from "./adapter";
import { createId, createSeed } from "./seed";

/**
 * Vercel 배포용 Postgres 저장소.
 * Vercel Marketplace 의 Neon(구 Vercel Postgres) 연결 문자열을 그대로 사용한다.
 * 서버리스에서 커넥션이 폭증하지 않도록 풀을 전역에 1개만 유지한다.
 */
interface PostRow {
  id: string;
  title: string;
  content: string;
  author: string;
  password: string;
  images: string[] | null;
  created_at: Date;
  updated_at: Date;
}

const globalForPg = globalThis as typeof globalThis & {
  __oruPgPool?: Pool;
  __oruPgReady?: Promise<void>;
};

export function getConnectionString(): string | undefined {
  return (
    process.env.POSTGRES_URL ??
    process.env.DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL
  );
}

function getPool(): Pool {
  if (!globalForPg.__oruPgPool) {
    const connectionString = getConnectionString();
    if (!connectionString) {
      throw new Error(
        "POSTGRES_URL(또는 DATABASE_URL) 환경변수가 설정되어 있지 않습니다.",
      );
    }
    globalForPg.__oruPgPool = new Pool({
      connectionString,
      // 서버리스 인스턴스당 커넥션 1개 (Neon pooler 뒤에서 동작)
      max: 1,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      ssl: connectionString.includes("sslmode=disable")
        ? undefined
        : { rejectUnauthorized: false },
    });
  }
  return globalForPg.__oruPgPool;
}

/** 테이블 생성 + 최초 1회 시드. 인스턴스당 한 번만 실행된다. */
function ready(): Promise<void> {
  if (!globalForPg.__oruPgReady) {
    globalForPg.__oruPgReady = (async () => {
      const pool = getPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id         TEXT PRIMARY KEY,
          title      TEXT NOT NULL,
          content    TEXT NOT NULL,
          author     TEXT NOT NULL,
          password   TEXT NOT NULL,
          images     JSONB NOT NULL DEFAULT '[]'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `);
      await pool.query(
        `CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts (created_at DESC)`,
      );

      const { rows } = await pool.query<{ count: string }>(
        "SELECT count(*)::text AS count FROM posts",
      );
      if (Number(rows[0]?.count ?? 0) > 0) return;

      for (const post of createSeed()) {
        await pool.query(
          `INSERT INTO posts (id, title, content, author, password, images, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [
            post.id,
            post.title,
            post.content,
            post.author,
            post.password,
            JSON.stringify(post.images),
            post.createdAt,
            post.updatedAt,
          ],
        );
      }
    })().catch((cause) => {
      // 실패한 초기화를 캐시하면 이후 요청이 모두 막히므로 초기화한다.
      globalForPg.__oruPgReady = undefined;
      throw cause;
    });
  }
  return globalForPg.__oruPgReady;
}

function toPost(row: PostRow): StoredPost {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    author: row.author,
    password: row.password,
    images: row.images ?? [],
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export const postgresStore: PostStore = {
  async list(page: number, limit: number): Promise<PostListResult> {
    await ready();
    const pool = getPool();
    const offset = (page - 1) * limit;

    const [{ rows: items }, { rows: counted }] = await Promise.all([
      pool.query<PostRow>(
        "SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2",
        [limit, offset],
      ),
      pool.query<{ count: string }>("SELECT count(*)::text AS count FROM posts"),
    ]);

    const total = Number(counted[0]?.count ?? 0);
    return {
      items: items.map(toPost),
      page,
      limit,
      total,
      hasMore: offset + items.length < total,
    };
  },

  async get(id: string) {
    await ready();
    const { rows } = await getPool().query<PostRow>(
      "SELECT * FROM posts WHERE id = $1",
      [id],
    );
    return rows[0] ? toPost(rows[0]) : undefined;
  },

  async create(input: PostInput) {
    await ready();
    const now = new Date().toISOString();
    const { rows } = await getPool().query<PostRow>(
      `INSERT INTO posts (id, title, content, author, password, images, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)
       RETURNING *`,
      [
        createId(),
        input.title,
        input.content,
        input.author,
        input.password,
        JSON.stringify(input.images),
        now,
        now,
      ],
    );
    return toPost(rows[0]);
  },

  async update(
    id: string,
    input: Omit<PostInput, "author">,
  ): Promise<UpdateResult> {
    await ready();
    const pool = getPool();

    const { rows: found } = await pool.query<{ password: string }>(
      "SELECT password FROM posts WHERE id = $1",
      [id],
    );
    if (!found[0]) return { ok: false, reason: "not-found" };
    if (found[0].password !== input.password) {
      return { ok: false, reason: "invalid-password" };
    }

    // 작성자명(author)은 갱신 대상에서 제외한다.
    const { rows } = await pool.query<PostRow>(
      `UPDATE posts
          SET title = $2, content = $3, images = $4::jsonb, updated_at = now()
        WHERE id = $1
        RETURNING *`,
      [id, input.title, input.content, JSON.stringify(input.images)],
    );
    return { ok: true, post: toPost(rows[0]) };
  },

  async remove(id: string) {
    await ready();
    const result = await getPool().query("DELETE FROM posts WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
