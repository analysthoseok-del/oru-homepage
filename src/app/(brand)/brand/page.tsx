import type { Metadata } from "next";
import Image from "next/image";
import { AmbientVideo } from "@/components/brand/AmbientVideo";
import { RiseOnScroll } from "@/components/brand/RiseOnScroll";
import {
  ABOUT,
  HERO,
  LOGO,
  PHILOSOPHY,
  PRODUCT,
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
      {/* 1. Hero — 첫 화면을 채우는 물결 영상 위에 흰색 로고 */}
      <section
        aria-labelledby="hero-heading"
        className="relative flex h-[calc(100svh-64px)] min-h-[480px] flex-col overflow-hidden bg-oru-forest text-white md:h-[calc(100svh-72px)]"
      >
        <AmbientVideo
          src={HERO.video}
          poster={HERO.poster}
          label={HERO.label}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-oru-ink/40 to-transparent"
        />
        <div className="relative flex flex-1 flex-col items-center justify-center px-5 text-center">
          <h1 id="hero-heading">
            <Image
              src={LOGO.white}
              alt={LOGO.alt}
              width={LOGO.width}
              height={LOGO.height}
              preload
              sizes="(min-width: 768px) 340px, 220px"
              className="h-auto w-[220px] md:w-[340px]"
            />
          </h1>
          <p className="mt-5 font-serif text-[20px] tracking-[0.02em] md:mt-7 md:text-[30px]">
            {HERO.tagline}
          </p>
        </div>
        <p className="relative px-5 pb-10 text-center font-serif text-[15px] tracking-[0.04em] text-white md:pb-12 md:text-[18px]">
          {HERO.keywords}
        </p>
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

      {/* Product — About 에서 아래로 내리면 제품이 떠오른다. 넓은 화면에서는 제품이 고정된 채 정보가 흐른다. */}
      <section
        id="product"
        data-rise-scope=""
        className={`${SECTION} overflow-x-clip bg-gradient-to-b from-oru-sand via-[#ebe6eb] to-[#dcd6dd]`}
      >
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 md:grid-cols-2 md:gap-20 md:px-10">
          <div className="flex items-center justify-center pt-16 md:sticky md:top-[72px] md:h-[calc(100svh-72px)] md:pt-0">
            <RiseOnScroll>
              <Image
                src={PRODUCT.image}
                alt={PRODUCT.alt}
                width={PRODUCT.width}
                height={PRODUCT.height}
                sizes="(min-width: 768px) 260px, 50vw"
                className="h-auto max-h-[78svh] w-auto max-w-full drop-shadow-[0_30px_40px_rgba(60,50,70,0.28)]"
              />
            </RiseOnScroll>
          </div>
          <div className="pb-24 md:max-w-[520px] md:py-[22vh]">
            <p className={EYEBROW}>{PRODUCT.eyebrow}</p>
            <p className="mt-8 text-[11px] uppercase tracking-[0.32em] text-oru-moss">
              {PRODUCT.ritual}
            </p>
            <h2 className="mt-3 font-serif text-[36px] leading-[1.15] md:text-[52px]">
              {PRODUCT.name}
            </h2>
            <p className="mt-3 font-serif text-[20px] italic text-oru-forest/80 md:text-[24px]">
              {PRODUCT.tagline}
            </p>

            <h3 className="mt-10 text-[11px] uppercase tracking-[0.28em] text-oru-moss">
              {PRODUCT.keyActivesLabel}
            </h3>
            <ul className="mt-3 border-t border-oru-forest/25">
              {PRODUCT.keyActives.map((item) => (
                <li
                  key={item.index}
                  className="flex items-baseline gap-4 border-b border-oru-forest/25 py-3"
                >
                  <span className="w-6 text-[11px] tracking-[0.1em] text-oru-moss">
                    {item.index}
                  </span>
                  <span className="flex-1 font-serif text-[19px] font-semibold md:text-[21px]">
                    {item.name}
                  </span>
                  <span className="text-right font-serif text-[16px] text-oru-forest md:text-[18px]">
                    {item.amount}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-[11px] uppercase tracking-[0.28em] text-oru-moss">
              {PRODUCT.supportingLabel}
            </h3>
            <p className="mt-3 font-serif text-[17px] leading-[1.7] text-oru-forest md:text-[18px]">
              {PRODUCT.supporting}
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
              {PRODUCT.benefits.map((benefit) => (
                <li
                  key={benefit.en}
                  className="border-l border-oru-forest/30 pl-3 first:border-l-0 first:pl-0"
                >
                  <span className="block text-[15px] font-semibold">
                    {benefit.ko}
                  </span>
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-oru-moss">
                    {benefit.en}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[12px] tracking-[0.14em] text-oru-forest/70">
              {PRODUCT.volume}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Story — 이미지 + 텍스트 2단 */}
      <section id="story" className={`${SECTION} bg-white/60`}>
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-32">
          <div className="relative overflow-hidden">
            <AmbientVideo
              src={STORY.video}
              poster={STORY.image}
              label={STORY.alt}
              className="aspect-[3/2] w-full object-cover saturate-[1.08] contrast-[1.04]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 shadow-[inset_0_0_80px_rgba(60,45,25,0.22)]"
            />
          </div>
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
          <h2 className="mt-6 font-serif text-[32px] tracking-[0.01em] md:text-[48px]">
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
              <h3 className="mt-5 font-serif text-[24px] tracking-normal md:text-[30px]">
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

      {/* 5. Ritual — 사용 리추얼 3단계 */}
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

      {/* 6. Sanctuary — 브랜드의 근원. 숲 이미지를 배경으로 깔고 그 위에 글 */}
      <section
        id="sanctuary"
        className={`${SECTION} relative overflow-hidden bg-oru-forest text-white`}
      >
        <Image
          src={SANCTUARY.image}
          alt={SANCTUARY.alt}
          fill
          sizes="(min-width: 768px) 100vw, 200vw"
          className="object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-oru-ink/45" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-[760px] flex-col items-center justify-center px-5 py-24 text-center md:min-h-[88vh] md:py-40">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#e6d3a3] md:text-[12px]">
            {SANCTUARY.eyebrow}
          </p>
          <h2 className={`${TITLE} mt-6`}>
            <Lines lines={SANCTUARY.title} />
          </h2>
          <div className="mt-10 flex flex-col gap-5 text-[15px] leading-[1.9] text-white/90 md:text-[16px]">
            {SANCTUARY.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
