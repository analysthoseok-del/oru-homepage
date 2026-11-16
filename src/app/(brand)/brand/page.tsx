import type { Metadata } from "next";
import Image from "next/image";
import { AmbientVideo } from "@/components/brand/AmbientVideo";
import {
  ABOUT,
  FILM,
  HERO,
  PHILOSOPHY,
  RITUAL,
  SANCTUARY,
  STORY,
} from "@/lib/brand";

export const metadata: Metadata = {
  title: "Brand",
};

const SECTION = "scroll-mt-16 md:scroll-mt-[72px]";
const EYEBROW =
  "text-[11px] font-medium uppercase tracking-[0.32em] text-oru-gold md:text-[12px]";
const TITLE =
  "text-[28px] font-light leading-[1.4] tracking-[-0.02em] md:text-[40px]";
const BODY = "text-[15px] leading-[1.9] text-oru-forest/80 md:text-[16px]";

function Lines({ lines }: { lines: readonly string[] }) {
  return lines.map((line) => (
    <span key={line} className="block">
      {line}
    </span>
  ));
}

export default function BrandPage() {
  return (
    <>
      {/* 1. Hero — 카피가 들어간 키 비주얼. 잘리지 않도록 원본 비율을 그대로 쓴다. */}
      <section aria-labelledby="hero-heading" className="bg-oru-forest">
        <h1 id="hero-heading" className="sr-only">
          {HERO.heading}
        </h1>
        <Image
          src={HERO.image}
          alt={HERO.alt}
          width={HERO.width}
          height={HERO.height}
          preload
          sizes="100vw"
          className="mx-auto h-auto w-full max-w-[1920px]"
        />
      </section>

      {/* 2. About — 브랜드 선언문 */}
      <section
        id="about"
        className={`${SECTION} mx-auto max-w-[760px] px-5 py-24 text-center md:py-40`}
      >
        <p className={EYEBROW}>{ABOUT.eyebrow}</p>
        <h2 className={`${TITLE} mt-6`}>
          <Lines lines={ABOUT.title} />
        </h2>
        <div className={`${BODY} mt-10 flex flex-col gap-5`}>
          {ABOUT.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* 3. Story — 이미지 + 텍스트 2단 */}
      <section id="story" className={`${SECTION} bg-white/60`}>
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-32">
          <Image
            src={STORY.image}
            alt={STORY.alt}
            width={STORY.width}
            height={STORY.height}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="h-auto w-full"
          />
          <div className="md:max-w-[480px]">
            <p className={EYEBROW}>{STORY.eyebrow}</p>
            <h2 className={`${TITLE} mt-6`}>
              <Lines lines={STORY.title} />
            </h2>
            <div className={`${BODY} mt-8 flex flex-col gap-5`}>
              {STORY.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Philosophy — 3개의 기준 */}
      <section
        id="philosophy"
        className={`${SECTION} mx-auto max-w-[1320px] px-5 py-24 md:px-10 md:py-40`}
      >
        <div className="text-center">
          <p className={EYEBROW}>{PHILOSOPHY.eyebrow}</p>
          <h2 className="mt-6 text-[26px] font-light uppercase tracking-[0.2em] md:text-[36px]">
            {PHILOSOPHY.title}
          </h2>
          <p className={`${BODY} mt-6`}>{PHILOSOPHY.lead}</p>
        </div>
        <ol className="mt-16 grid gap-px bg-oru-stone md:mt-24 md:grid-cols-3">
          {PHILOSOPHY.pillars.map((pillar) => (
            <li key={pillar.index} className="bg-oru-sand px-2 py-10 md:px-10 md:py-4">
              <p className="text-[12px] tracking-[0.2em] text-oru-moss">
                {pillar.index}
              </p>
              <h3 className="mt-5 text-[20px] font-light tracking-[0.06em] md:text-[24px]">
                {pillar.name}
              </h3>
              <p className="mt-2 text-[14px] font-semibold text-oru-forest">
                {pillar.label}
              </p>
              <p className={`${BODY} mt-5`}>{pillar.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. Film — 풀블리드 영상 + 한 줄 카피 */}
      <section
        aria-label={FILM.label}
        className="relative flex h-[60vh] min-h-[360px] items-center justify-center overflow-hidden bg-oru-forest md:h-[80vh]"
      >
        <AmbientVideo
          src={FILM.video}
          label={FILM.label}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-oru-ink/35" />
        <p className="relative px-5 text-center text-[22px] font-light leading-[1.6] text-white md:text-[34px]">
          <Lines lines={FILM.quote} />
        </p>
      </section>

      {/* 6. Ritual — 사용 리추얼 3단계 */}
      <section id="ritual" className={`${SECTION} bg-oru-stone/50`}>
        <div className="mx-auto grid max-w-[1320px] gap-14 px-5 py-24 md:grid-cols-[1fr_1.4fr] md:gap-20 md:px-10 md:py-40">
          <div>
            <p className={EYEBROW}>{RITUAL.eyebrow}</p>
            <h2 className={`${TITLE} mt-6`}>
              <Lines lines={RITUAL.title} />
            </h2>
          </div>
          <ol className="flex flex-col">
            {RITUAL.steps.map((step) => (
              <li
                key={step.index}
                className="grid grid-cols-[48px_1fr] gap-x-4 border-t border-oru-forest/20 py-8 last:border-b md:grid-cols-[72px_180px_1fr] md:gap-x-6 md:py-10"
              >
                <span className="text-[12px] leading-8 tracking-[0.2em] text-oru-moss">
                  {step.index}
                </span>
                <h3 className="text-[20px] font-light md:text-[22px]">
                  {step.label}
                  <span className="ml-3 text-[11px] uppercase tracking-[0.24em] text-oru-moss">
                    {step.name}
                  </span>
                </h3>
                <p className={`${BODY} col-start-2 mt-3 md:col-start-3 md:mt-0`}>
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. Sanctuary — 브랜드의 근원 */}
      <section
        id="sanctuary"
        className={`${SECTION} bg-oru-forest text-oru-sand`}
      >
        <div className="mx-auto max-w-[760px] px-5 py-24 text-center md:py-40">
          <p className={EYEBROW}>{SANCTUARY.eyebrow}</p>
          <h2 className={`${TITLE} mt-6`}>
            <Lines lines={SANCTUARY.title} />
          </h2>
          <div className="mt-10 flex flex-col gap-5 text-[15px] leading-[1.9] text-oru-sand/75 md:text-[16px]">
            {SANCTUARY.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
