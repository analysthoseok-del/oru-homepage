# TALKR 게시판 (oru-homepage)

Figma 시안(게시물 조회 / 목록 / 규칙 정의 / 게시물 작성·수정)을 기준으로 구현한 Next.js 게시판입니다.

## 기술 스택

| 영역 | 선택 | 비고 |
| --- | --- | --- |
| 프레임워크 | Next.js 16 (App Router) | `pnpm create next-app` 으로 생성 |
| 언어 | TypeScript | strict |
| 스타일 | Tailwind CSS v4 | Figma 규칙을 `@theme` 디자인 토큰으로 정의 |
| 아이콘 | react-icons (Material / Boxicons) | Figma 아이콘과 가장 유사한 아이콘 사용 |
| 폰트 | [SUIT](https://sun.fo/suit/) Variable | `next/font/local` 로 self-host |
| 백엔드 | Next.js Route Handlers | 저장소 어댑터 (파일 / Postgres) |
| DB | Postgres (`pg`) | Vercel 배포 시 자동 선택 |
| 이미지 | Vercel Blob / 로컬 파일 | 환경변수로 자동 선택 |

## 실행

```bash
pnpm install
pnpm dev      # http://localhost:3000 → 게시글 목록이 첫 화면
```

```bash
pnpm build && pnpm start   # 프로덕션 실행
pnpm lint                  # ESLint
```

환경변수 없이 바로 실행됩니다. 최초 실행 시 27건의 시드 게시글이 생성되어 무한 스크롤을 바로 확인할 수 있습니다.
(시드 게시글의 비밀번호는 모두 `1234` 입니다.)

## 저장소 전환 (로컬 ↔ Vercel)

같은 코드가 환경변수에 따라 저장소를 자동으로 고릅니다. 페이지·API 코드는 바뀌지 않습니다.

| | 게시글 | 이미지 | 선택 조건 |
| --- | --- | --- | --- |
| 로컬 | `data/posts.json` | `data/uploads/` → `/api/uploads/:name` | 기본값 |
| Vercel | Postgres `posts` 테이블 | Vercel Blob 공개 URL | `POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN` |

`posts` 테이블과 시드 데이터는 첫 요청 시 자동 생성됩니다(`CREATE TABLE IF NOT EXISTS`). 별도 마이그레이션 명령이 필요 없습니다.

## Vercel 배포

1. **저장소 연결** — Vercel → Add New → Project → 이 GitHub 저장소 Import → 브랜치 선택
2. **Postgres 연결** — 프로젝트 → Storage → Marketplace 의 **Neon**(구 Vercel Postgres) 생성 후 프로젝트에 연결
   → `POSTGRES_URL` / `DATABASE_URL` 이 자동 주입됩니다
3. **Blob 연결** — 프로젝트 → Storage → **Blob** 생성 후 연결
   → `BLOB_READ_WRITE_TOKEN` 이 자동 주입됩니다
4. **재배포** — Deployments → Redeploy (환경변수를 반영하기 위해 한 번 필요합니다)

Build Command·Output Directory는 기본값 그대로 두면 됩니다. 이 브랜치가 저장소의 기본 브랜치이므로
Import 직후 바로 프로덕션 배포가 됩니다.

2·3번을 건너뛴 상태로 배포하면 서버리스 파일시스템이 읽기 전용이라 파일 저장소를 쓸 수 없습니다.
이 경우에도 앱이 죽지 않고 **목록·상세는 시드 데이터로 정상 렌더링**되며, 등록·수정·삭제 요청만
503 과 함께 "Postgres/Blob 을 연결해 주세요" 안내를 돌려줍니다.

## 배너 이미지 교체

배너는 3장 캐러셀입니다. 1번 슬라이드에는 브랜드 배너(`public/banners/banner-1.webp`)가 적용되어 있고,
2·3번은 그라디언트 플레이스홀더입니다. 이미지를 추가하려면

1. `public/banners/` 에 이미지를 저장하고
2. `src/lib/banners.ts` 의 해당 슬라이드 `src` 를 `"/banners/파일명.webp"` 으로 채우면 됩니다.

배너 이미지는 가로 2:1 비율(예: 1200×600)을 권장합니다. 화면이 좁아지면 배너가 2:1 비율로
따라 줄어들어 이미지 안의 카피가 좌우로 잘리지 않습니다. 크롭 기준점은 슬라이드별
`objectPosition` 으로 조정할 수 있습니다.

## 디자인 토큰 (Figma `규칙 정의` 시트)

`src/app/globals.css` 의 `@theme` 에 1:1로 정의되어 있습니다.

| 토큰 | 값 | Tailwind 유틸 |
| --- | --- | --- |
| Main | `#6400FF` | `text-main` / `bg-main` |
| BT (기본 / 비활성) | `#6400FF` / `#999999` | `bg-bt-primary` / `bg-bt-disabled` |
| Font | `#000000` / `#333333` / `#999999` | `text-font-strong` / `text-font-base` / `text-font-sub` |
| Border | `#E5E5E5` | `border-line` |
| BG | `#FAFAFA` | `bg-bg` |

Input 은 기본 / 클릭(포커스 시 Main 보더) / 비활성화 / 완료 4가지 상태를 `src/components/ui/Field.tsx` 에서 처리합니다.

## 라우팅 구조

레이아웃 구조로 사이드바와 배너를 분리했습니다.
사이드바는 루트 레이아웃에, 배너는 `(with-banner)` 라우트 그룹에만 존재하므로 **작성/수정 페이지에는 배너가 표시되지 않습니다.**

```
src/app
├─ layout.tsx                        # 사이드바(GNB) 공통 레이아웃 + SUIT 폰트
├─ (with-banner)/
│  ├─ layout.tsx                     # 캐러셀 배너
│  ├─ page.tsx                       # "/"      게시글 목록 (첫 화면)
│  └─ posts/[id]/page.tsx            # "/posts/:id"       상세 (다이나믹 라우팅)
├─ (no-banner)/
│  ├─ layout.tsx                     # 배너 없음
│  └─ posts/
│     ├─ new/page.tsx                # "/posts/new"       작성
│     └─ [id]/edit/page.tsx          # "/posts/:id/edit"  수정
└─ api/
   ├─ posts/route.ts                 # GET(목록·페이지네이션) / POST(등록)
   ├─ posts/[id]/route.ts            # GET(상세) / PUT(수정) / DELETE(삭제)
   └─ upload/route.ts                # POST(이미지 업로드)
```

`PostForm` 하나를 **작성/수정 페이지가 공유**합니다 (`mode="create" | "edit"`).

## 기능 요건 대응표

| 요건 | 구현 |
| --- | --- |
| CLI로 프로젝트 생성 | `pnpm create next-app` |
| 사이드바·배너를 레이아웃 구조로 | 루트 레이아웃 + `(with-banner)` / `(no-banner)` 라우트 그룹 |
| 작성 페이지에 배너 미노출 | `(no-banner)` 그룹 |
| 캐러셀 배너 3장 | `BannerCarousel` (4초 자동 롤링, 인디케이터 클릭 이동, hover 시 정지) |
| `localhost:3000` 첫 화면 = 목록 | `(with-banner)/page.tsx` |
| 다이나믹 라우팅(경로 파라미터 = 게시글 ID) | `/posts/[id]` |
| 어느 화면에서든 [전체 글 보기] / [새 글 작성] | 루트 레이아웃 사이드바 |
| 무한 스크롤 | `IntersectionObserver` + `/api/posts?page=&limit=10`, 끝까지 도달 시 종료 |
| 상세: 제목·내용·작성자명·이미지 | `/posts/[id]` |
| 이미지 없으면 빈 영역 없이 렌더 | `post.images.length > 0` 조건부 렌더 |
| [글목록] 버튼 | 목록으로 이동 |
| 삭제 후 목록 이동 | `DELETE /api/posts/:id` → `router.push("/")` |
| 작성/수정 페이지 컴포넌트 재사용 | `PostForm` |
| 제목·내용·작성자·비밀번호 필수 | 클라이언트 검증 + 서버 400 |
| 작성 후 상세로 이동 후 조회 | `router.push("/posts/{id}")` |
| 수정 시 기존 값 로딩 | 서버에서 조회 후 폼 기본값 주입 |
| 수정 시 작성자명 변경 불가 | `disabled` + 서버에서 author 갱신 제외 |
| 수정 후 상세 반영 | `PUT` 후 상세로 이동 (`router.refresh()`) |
| 수정 [취소] → 해당 글 상세 | `router.push("/posts/{id}")` |
| (Advance) 이미지 업로드 | `POST /api/upload` → `public/uploads` |
| (Advance) 업로드 즉시 미리보기 | 업로드 버튼 영역에 썸네일 표시 |
| (Advance) 수정 시 기존 이미지 기본값 | 폼 진입 시 기존 이미지 로딩 |
| (Advance) 기존 이미지 클릭 시 교체 | 썸네일 클릭 → 파일 선택 → 교체 (hover 시 × 로 제거) |

## API

| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/api/posts?page=1&limit=10` | 최신순 목록 (페이지네이션) |
| POST | `/api/posts` | 등록 |
| GET | `/api/posts/:id` | 상세 |
| PUT | `/api/posts/:id` | 수정 (비밀번호 확인, 작성자 변경 불가) |
| DELETE | `/api/posts/:id` | 삭제 |
| POST | `/api/upload` | 이미지 업로드 (5MB, png/jpg/webp/gif/svg) |
| GET | `/api/uploads/:name` | 로컬 업로드 이미지 서빙 (배포 시엔 Blob URL 사용) |

응답에는 비밀번호가 포함되지 않습니다(`toPublicPost`).
