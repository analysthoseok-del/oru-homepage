export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  /** 이미지 URL 목록 (최대 3장) */
  images: string[];
  createdAt: string;
  updatedAt: string;
}

/** 비밀번호를 포함한 서버 내부 저장 형태 */
export interface StoredPost extends Post {
  password: string;
}

export interface PostListResponse {
  items: Post[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface PostInput {
  title: string;
  content: string;
  author: string;
  password: string;
  images: string[];
}

export const MAX_IMAGES = 3;
