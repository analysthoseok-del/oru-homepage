/** Figma 표기( 2022.03.28. 13:00 )에 맞춘 날짜 포맷 */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(
    date.getDate(),
  )}. ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
