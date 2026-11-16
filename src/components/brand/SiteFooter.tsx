import Image from "next/image";
import { BRAND_NAV, COMPANY, LOGO } from "@/lib/brand";

export function SiteFooter() {
  const company = COMPANY.filter((item) => item.value !== null);

  return (
    <footer className="bg-oru-ink text-oru-sand">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-12 px-5 py-16 md:flex-row md:justify-between md:px-10 md:py-20">
        <div>
          <Image
            src={LOGO.white}
            alt={LOGO.alt}
            width={LOGO.width}
            height={LOGO.height}
            sizes="100px"
            className="h-10 w-auto"
          />
          <p className="mt-4 text-[12px] uppercase tracking-[0.22em] text-oru-sand/60">
            Longevity · Well-aging · Emotional Wellness
          </p>
        </div>

        <nav aria-label="푸터 메뉴">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-3 md:grid-cols-1">
            {BRAND_NAV.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-[12px] uppercase tracking-[0.22em] text-oru-sand/70 transition-colors hover:text-oru-sand"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-oru-sand/15">
        <div className="mx-auto max-w-[1320px] px-5 py-8 text-[12px] leading-6 text-oru-sand/55 md:px-10">
          {company.length > 0 && (
            <dl className="mb-4 flex flex-wrap gap-x-6 gap-y-1">
              {company.map(({ label, value }) => (
                <div key={label} className="flex gap-2">
                  <dt>{label}</dt>
                  <dd className="text-oru-sand/80">{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <p>© {new Date().getFullYear()} Oru. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
