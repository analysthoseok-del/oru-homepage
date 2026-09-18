/**
 * 저장소에 쓸 수 없을 때 발생한다.
 * 예: Postgres/Blob 을 연결하지 않은 채 Vercel 에 배포한 경우
 * (서버리스 파일시스템이 읽기 전용이라 파일 저장소가 동작하지 않는다.)
 */
export class StorageReadOnlyError extends Error {
  constructor() {
    super(
      "저장소가 읽기 전용이라 글을 저장할 수 없습니다. Vercel 프로젝트에 Postgres(POSTGRES_URL)와 Blob(BLOB_READ_WRITE_TOKEN)을 연결한 뒤 다시 배포해 주세요.",
    );
    this.name = "StorageReadOnlyError";
  }
}
