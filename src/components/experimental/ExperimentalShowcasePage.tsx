"use client";

import {
  ShowcaseGallery,
  ShowcaseHero,
} from "@/components/experimental/showcase/ShowcaseHero";
import { ShowcaseNav } from "@/components/experimental/showcase/ShowcaseNav";
import { ShowcaseSlides } from "@/components/experimental/showcase/ShowcaseSlides";
import type { ExperimentalShowcase } from "@/lib/experimental/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function ExperimentalShowcasePage({
  showcase,
}: {
  showcase: ExperimentalShowcase;
}) {
  const { locale } = useLocale();
  const summary =
    locale === "zh-TW" ? (showcase.zh?.summary ?? showcase.summary) : showcase.summary;

  return (
    <div className="lab-showcase-page">
      <div className="site-nav-page-shell page-shell mx-auto w-full max-w-[1440px]">
        <ShowcaseNav />
      </div>
      <article className="lab-showcase-article">
        <ShowcaseHero showcase={showcase} />
        {summary && summary.length > 0 ? (
          <section className="lab-showcase-summary" aria-label="Project summary">
            {summary.map((item) => (
              <div className="lab-showcase-summary-item" key={item.label}>
                <p className="lab-showcase-summary-label">{item.label}</p>
                <p className="lab-showcase-summary-text">{item.text}</p>
              </div>
            ))}
          </section>
        ) : null}
        <ShowcaseGallery blocks={showcase.blocks} />
        {showcase.slides && showcase.slides.length > 0 ? (
          <ShowcaseSlides
            slides={showcase.slides}
            label={`${showcase.title} slides`}
          />
        ) : null}
      </article>
    </div>
  );
}
