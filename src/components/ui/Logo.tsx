/** TALKR 로고 — 보라색 말풍선 심볼 + 워드마크 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M13.6 3.3c-6 0-10.9 4.3-10.9 9.6 0 3 1.6 5.7 4.1 7.5l-1 4.2c-.2.9.8 1.6 1.6 1.1l5-2.9c.4 0 .8.1 1.2.1 6 0 10.9-4.3 10.9-9.6S19.6 3.3 13.6 3.3Z"
          fill="#6400FF"
        />
        <circle cx="21.6" cy="7.2" r="4.5" fill="#6400FF" />
        <circle cx="21.6" cy="7.2" r="1.9" fill="#FFFFFF" />
      </svg>
      <span className="text-[19px] font-extrabold tracking-tight text-font-strong">
        TALKR
      </span>
    </div>
  );
}
