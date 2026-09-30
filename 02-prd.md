# 미니 노션 (Mini Notion) — PRD

| 항목 | 내용 |
| --- | --- |
| 문서 버전 | v0.1 (MVP) |
| 작성일 | 2026-09-28 |
| 대상 사용자 | 개인 업무를 관리하고 싶은 1인 사용자 |
| 기술 스택(가정) | Next.js 16 (App Router), React 19, Tailwind CSS 4, PostgreSQL(`pg`), Vercel Blob |

---

## 1. 배경 및 목적 (Problem)

### 1.1 문제 정의
- 상용 업무 관리 툴(Notion 등)은 개인이 쓰기에 기능이 과하고, 고급 기능은 유료 요금제에 묶여 있다.
- 범용 툴은 "나의 업무 방식"에 맞춰 기능을 바꾸거나 더할 수 없다.

### 1.2 사용 목적
1. **무료 사용**: 개인용 업무 관리 툴을 직접 만들어 구독료 없이 사용한다.
2. **개인 최적화**: 나에게 필요한 기능만 골라 계속 확장할 수 있는 기반을 만든다.

### 1.3 성공 기준 (MVP)
| 지표 | 목표 |
| --- | --- |
| 핵심 흐름 완주 | 로그인 → 새 글 생성 → 제목/내용 작성 → 목록 확인 → 삭제를 막힘 없이 수행 |
| 새 글 생성 속도 | `/page` 입력 후 1초 이내 새 글 상세 화면 진입 |
| 데이터 유실 | 작성 내용 자동 저장, 새로고침 후에도 내용 유지 |
| 운영 비용 | 무료 티어(Vercel / DB / Blob) 범위 내 운영 |

---

## 2. 사용자 (Persona)

**"혼자 일하는 실무자"**
- 할 일, 회의 메모, 아이디어를 한 곳에 빠르게 적어 두고 싶다.
- 복잡한 설정 없이 구글 계정으로 바로 쓰고 싶다.
- 쓰다 보면 필요한 기능(태그, 검색, 체크리스트 등)을 직접 붙이고 싶다.

### 핵심 사용자 스토리
| ID | 스토리 |
| --- | --- |
| US-01 | 사용자로서, 구글 계정으로 한 번에 로그인하고 싶다. |
| US-02 | 사용자로서, 내 별명과 프로필 이미지를 바꾸고 싶다. |
| US-03 | 사용자로서, `/page`만 입력해 새 글을 바로 만들고 싶다. |
| US-04 | 사용자로서, 목록에서 글을 클릭해 상세 내용을 보고 싶다. |
| US-05 | 사용자로서, 상세 화면에서 제목과 내용을 자유롭게 입력하고 싶다. |
| US-06 | 사용자로서, 필요 없어진 글을 삭제하고 싶다. |

---

## 3. 범위 (Scope)

### 3.1 MVP 포함
- 구글 로그인 / 로그아웃
- 마이 페이지: 별명 변경, 프로필 이미지 변경
- 업무 페이지: 글 목록, `/page` 명령으로 새 글 생성, 글 상세(제목·내용 편집), 글 삭제

### 3.2 MVP 제외 (향후 확장 후보)
- 다중 사용자 협업, 공유 링크, 권한 관리
- 하위 페이지(트리 구조), 블록 단위 에디터(이미지·표·토글 등)
- 검색, 태그, 즐겨찾기, 휴지통 복구
- 모바일 앱, 오프라인 모드

---

## 4. 정보 구조 (IA) 및 라우팅

```
/login                 로그인 페이지 (비로그인 전용)
/                      → 로그인 여부에 따라 /login 또는 /pages 로 리다이렉트
/pages                 업무 페이지 (글 목록 + /page 명령 입력)
/pages/[pageId]        글 상세 (제목·내용 편집, 삭제)
/me                    마이 페이지 (별명, 프로필 이미지)
```

- `/login`을 제외한 모든 경로는 로그인 필수. 비로그인 접근 시 `/login`으로 이동.
- 공통 레이아웃: 좌측 사이드바(글 목록) + 상단 헤더(프로필 아바타 → 마이 페이지 / 로그아웃).

---

## 5. 기능 요구사항

### 5.1 로그인 페이지 (`/login`)
| ID | 요구사항 | 우선순위 |
| --- | --- | --- |
| F-LOGIN-01 | "Google로 계속하기" 버튼 제공 (Google OAuth 2.0) | P0 |
| F-LOGIN-02 | 최초 로그인 시 사용자 레코드 자동 생성 (구글 이름 → 별명, 구글 프로필 사진 → 프로필 이미지 기본값) | P0 |
| F-LOGIN-03 | 로그인 성공 시 `/pages`로 이동 | P0 |
| F-LOGIN-04 | 이미 로그인한 사용자가 `/login` 접근 시 `/pages`로 리다이렉트 | P1 |
| F-LOGIN-05 | 로그인 실패/취소 시 안내 메시지 표시 | P1 |
| F-LOGIN-06 | 헤더에서 로그아웃 가능 | P0 |

**수용 기준**
- 구글 계정 선택 후 3초 이내 업무 페이지 진입.
- 세션은 HttpOnly·Secure 쿠키로 유지되며, 브라우저를 닫았다 열어도 유효기간 내 로그인 유지.

### 5.2 마이 페이지 (`/me`)
| ID | 요구사항 | 우선순위 |
| --- | --- | --- |
| F-ME-01 | 현재 별명, 프로필 이미지, 이메일(읽기 전용) 표시 | P0 |
| F-ME-02 | 별명 변경: 1~20자, 앞뒤 공백 제거, 빈 값 불가 | P0 |
| F-ME-03 | 프로필 이미지 업로드: JPG/PNG/WebP, 최대 2MB | P0 |
| F-ME-04 | 업로드 전 미리보기, 저장 시 헤더 아바타 즉시 반영 | P1 |
| F-ME-05 | 프로필 이미지 삭제 시 기본 아바타(별명 첫 글자)로 대체 | P2 |

**수용 기준**
- 유효하지 않은 입력(빈 별명, 20자 초과, 허용 외 파일 형식/용량)은 저장되지 않고 필드 하단에 오류 메시지 표시.
- 저장 성공 시 토스트 "저장되었습니다" 표시.

### 5.3 업무 페이지 (`/pages`)
| ID | 요구사항 | 우선순위 |
| --- | --- | --- |
| F-PAGE-01 | 내 글 목록을 최근 수정순으로 표시 (제목, 최종 수정 시각) | P0 |
| F-PAGE-02 | 입력창에 `/page` 입력 후 Enter → 새 글 생성 후 해당 글 상세로 이동 | P0 |
| F-PAGE-03 | `/` 입력 시 명령어 팝업(현재 `/page` 1개) 노출, 방향키·Enter로 선택 | P1 |
| F-PAGE-04 | 제목이 비어 있는 글은 목록에 "제목 없음"으로 표시 | P0 |
| F-PAGE-05 | 글 항목 클릭 시 `/pages/[pageId]`로 이동 | P0 |
| F-PAGE-06 | 글이 없을 때 빈 상태 안내("`/page`를 입력해 첫 글을 만들어 보세요") | P1 |

### 5.4 글 상세 (`/pages/[pageId]`)
| ID | 요구사항 | 우선순위 |
| --- | --- | --- |
| F-DETAIL-01 | 제목 입력 (한 줄, 최대 100자, placeholder "제목 없음") | P0 |
| F-DETAIL-02 | 내용 입력 (여러 줄 텍스트, 최대 50,000자) | P0 |
| F-DETAIL-03 | 자동 저장: 입력 멈춘 뒤 800ms 디바운스 저장 + 페이지 이탈 시 저장 | P0 |
| F-DETAIL-04 | 저장 상태 표시 ("저장 중…" / "저장됨" / "저장 실패 · 재시도") | P1 |
| F-DETAIL-05 | 글 삭제: 확인 모달 후 삭제, 완료 시 `/pages`로 이동 | P0 |
| F-DETAIL-06 | 본인 글이 아니거나 존재하지 않는 글 접근 시 404 화면 | P0 |
| F-DETAIL-07 | 제목에서 Enter 시 내용 영역으로 포커스 이동 | P2 |

**수용 기준**
- 새로고침 후에도 마지막 입력 내용이 유지된다.
- 삭제된 글은 목록에서 즉시 사라지고 URL로도 접근 불가(404).

---

## 6. 데이터 모델 (PostgreSQL)

```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_sub      TEXT UNIQUE NOT NULL,        -- 구글 계정 고유 ID
  email           TEXT UNIQUE NOT NULL,
  nickname        VARCHAR(20) NOT NULL,
  avatar_url      TEXT,                         -- Vercel Blob URL 또는 구글 프로필 URL
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(100) NOT NULL DEFAULT '',
  content         TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pages_user_updated ON pages (user_id, updated_at DESC);
```

- 모든 `pages` 조회/수정/삭제 쿼리는 `user_id = 현재 세션 사용자` 조건을 강제한다.
- 확장 대비: 추후 `parent_id`(하위 페이지), `deleted_at`(휴지통), `tags` 테이블 추가를 고려.

---

## 7. API / 서버 액션 명세

| 동작 | 방식 | 입력 | 결과 |
| --- | --- | --- | --- |
| 구글 로그인 시작 | `GET /api/auth/google` | – | 구글 동의 화면 리다이렉트 |
| 로그인 콜백 | `GET /api/auth/google/callback` | `code`, `state` | 사용자 upsert, 세션 쿠키 발급 → `/pages` |
| 로그아웃 | `POST /api/auth/logout` | – | 세션 삭제 → `/login` |
| 내 정보 조회 | 서버 컴포넌트 | 세션 | `{ nickname, email, avatarUrl }` |
| 별명 변경 | Server Action `updateNickname` | `nickname` | 갱신된 사용자 |
| 프로필 이미지 변경 | Server Action `updateAvatar` | `File` | Blob 업로드 후 `avatar_url` 갱신 |
| 글 목록 | 서버 컴포넌트 | 세션 | `[{ id, title, updatedAt }]` |
| 새 글 생성 | Server Action `createPage` | – | `{ id }` → 상세로 이동 |
| 글 조회 | 서버 컴포넌트 | `pageId` | `{ id, title, content, updatedAt }` 또는 404 |
| 글 수정 | Server Action `updatePage` | `pageId`, `title?`, `content?` | `{ updatedAt }` |
| 글 삭제 | Server Action `deletePage` | `pageId` | 성공 시 `/pages`로 이동 |

> 구현 전 `node_modules/next/dist/docs/`의 Next.js 16 가이드(Server Actions, 라우팅, 캐시 무효화)를 확인하고 해당 버전 규약을 따른다.

---

## 8. 비기능 요구사항

| 구분 | 요구사항 |
| --- | --- |
| 보안 | OAuth `state` 검증, 세션 쿠키 HttpOnly·Secure·SameSite=Lax, 모든 데이터 접근에 소유자 검증, 업로드 파일 MIME/용량 서버 검증 |
| 성능 | 목록·상세 첫 화면 LCP 2.5초 이내, 자동 저장 응답 500ms 이내 |
| 반응형 | 데스크톱 우선, 모바일(375px)에서 사이드바는 햄버거 메뉴로 전환 |
| 접근성 | 키보드만으로 핵심 흐름 수행 가능, 버튼/입력에 레이블 제공 |
| 비용 | Vercel Hobby, 무료 Postgres(Neon/Supabase 등), Vercel Blob 무료 한도 내 운영 |
| 환경 변수 | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`, `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN` |

---

## 9. 디자인 가이드 (디자인 세팅)

- **톤**: Notion처럼 여백이 넉넉하고 텍스트 중심인 미니멀 UI.
- **레이아웃**: 좌측 사이드바 240px(글 목록), 본문 최대 폭 720px 중앙 정렬.
- **타이포**: 본문 16px / 행간 1.6, 제목 입력 32px Bold. 한글은 Pretendard 계열 권장.
- **컬러 토큰** (Tailwind 4 `@theme`로 정의, 라이트/다크 모드 대응)

| 토큰 | 라이트 | 다크 | 용도 |
| --- | --- | --- | --- |
| `--color-bg` | `#FFFFFF` | `#191919` | 페이지 배경 |
| `--color-sidebar` | `#F7F7F5` | `#202020` | 사이드바 배경 |
| `--color-text` | `#37352F` | `#E6E6E4` | 본문 텍스트 |
| `--color-muted` | `#9B9A97` | `#8A8A87` | 보조 텍스트, placeholder |
| `--color-border` | `#E9E9E7` | `#2F2F2F` | 구분선 |
| `--color-hover` | `#EFEFED` | `#2C2C2C` | 목록 hover |
| `--color-accent` | `#2383E2` | `#4C9BE8` | 주요 버튼, 포커스 링 |
| `--color-danger` | `#EB5757` | `#FF6B6B` | 삭제 버튼, 오류 메시지 |

- **컴포넌트**: Button(primary / ghost / danger), Input, Textarea(자동 높이), Avatar, Modal(삭제 확인), Toast, CommandMenu(`/` 팝업), Sidebar, EmptyState.
- **아이콘**: 프로젝트에 설치된 `react-icons` 사용.

---

## 10. 주요 사용자 흐름

```
[최초 사용]
/login → Google 로그인 → 사용자 생성 → /pages (빈 상태)
      → "/page" 입력 + Enter → /pages/{id} → 제목·내용 입력(자동 저장)
      → 사이드바에서 목록 확인

[글 삭제]
/pages/{id} → 삭제 버튼 → 확인 모달 → 삭제 → /pages

[프로필 수정]
헤더 아바타 → /me → 별명 수정 / 이미지 업로드 → 저장 → 헤더 즉시 반영
```

---

## 11. 단계별 로드맵

| 단계 | 기간(목표) | 내용 |
| --- | --- | --- |
| Phase 0 — 디자인 세팅 | 1주 | 컬러·타이포 토큰, 공통 레이아웃, 기본 컴포넌트 |
| Phase 1 — MVP | 2주 | 구글 로그인, 마이 페이지, 글 CRUD, `/page` 명령, 자동 저장 |
| Phase 2 — 생산성 | 2주 | 검색, 휴지통(소프트 삭제·복구), 체크리스트/마크다운 입력 |
| Phase 3 — 개인 최적화 | 지속 | 하위 페이지, 태그, 추가 슬래시 명령(`/todo`, `/today` 등), 단축키 |

---

## 12. 리스크 및 대응

| 리스크 | 영향 | 대응 |
| --- | --- | --- |
| 자동 저장 중 네트워크 오류로 내용 유실 | 높음 | 로컬 임시 저장 + 실패 표시 및 재시도 |
| 무료 티어 한도 초과(DB 용량, Blob 트래픽) | 중간 | 이미지 업로드 전 리사이즈/압축, 사용량 모니터링 |
| Next.js 16 규약 변경으로 인한 구현 오류 | 중간 | 번들 문서(`node_modules/next/dist/docs/`) 기준으로 구현 |
| 구글 OAuth 설정 오류(리다이렉트 URI 등) | 낮음 | 로컬/프로덕션 리다이렉트 URI를 모두 등록하고 체크리스트화 |

---

## 13. 오픈 이슈
- 내용 에디터를 순수 textarea로 시작할지, 마크다운/블록 에디터를 처음부터 도입할지 결정 필요.
- 인증을 직접 구현할지(OAuth + 자체 세션), 인증 라이브러리를 도입할지 결정 필요.
- 로그인 허용 계정을 본인 이메일로 제한(allowlist)할지 여부.
