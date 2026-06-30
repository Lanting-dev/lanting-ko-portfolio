"use client";

import type { ExperimentalMedia, ExperimentalShowcase } from "@/lib/experimental/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function ShowcaseBlock({ block }: { block: ExperimentalMedia }) {
  if (block.type === "video") {
    return (
      <figure className="lab-showcase-figure lab-showcase-figure--video">
        <video
          className="lab-showcase-video"
          src={block.src}
          poster={block.poster}
          width={block.width}
          height={block.height}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <figcaption className="sr-only">{block.alt}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="lab-showcase-figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={block.src}
        alt={block.alt}
        width={block.width}
        height={block.height}
        className="lab-showcase-image"
        loading="lazy"
        draggable={false}
      />
    </figure>
  );
}

export function ShowcaseHero({ showcase }: { showcase: ExperimentalShowcase }) {
  const { ui } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const hero = showcase.blocks[0];
  const heroMedia =
    hero?.type === "video" && !reducedMotion ? (
      <video
        className="lab-showcase-hero-media"
        src={hero.src}
        poster={hero.poster}
        width={hero.width}
        height={hero.height}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={hero.alt}
      />
    ) : hero?.type === "video" && hero.poster ? (
      /* Reduced motion: show the poster still instead of an autoplaying loop. */
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={hero.poster}
        alt={hero.alt}
        width={hero.width}
        height={hero.height}
        className="lab-showcase-hero-media"
        draggable={false}
      />
    ) : hero?.type === "image" ? (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={hero.src}
        alt={hero.alt}
        width={hero.width}
        height={hero.height}
        className="lab-showcase-hero-media"
        draggable={false}
      />
    ) : null;

  return (
    <header className="lab-showcase-hero">
      <div className="lab-showcase-hero-media-wrap">{heroMedia}</div>

      <div className="lab-showcase-hero-copy">
        <p className="lab-showcase-tag">{showcase.tag}</p>
        <h1 className="lab-showcase-title">{showcase.title}</h1>
        <p className="lab-showcase-lede">{showcase.lede}</p>
      </div>

      <aside className="lab-showcase-hero-aside">
        {showcase.with ? (
          <div className="lab-showcase-meta-block">
            <p className="lab-showcase-meta-label">{ui.lab.withLabel}</p>
            <p className="lab-showcase-meta-value">{showcase.with}</p>
          </div>
        ) : null}
        {showcase.role && showcase.role.length > 0 ? (
          <div className="lab-showcase-meta-block">
            <p className="lab-showcase-meta-label">{ui.lab.roleLabel}</p>
            <ul className="lab-showcase-meta-list">
              {showcase.role.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {showcase.stack && showcase.stack.length > 0 ? (
          <div className="lab-showcase-meta-block">
            <p className="lab-showcase-meta-label">{ui.lab.stackLabel}</p>
            <p className="lab-showcase-meta-value">
              {showcase.stack.join(" · ")}
            </p>
          </div>
        ) : null}
        <p className="lab-showcase-meta-year">{showcase.year}</p>
      </aside>
    </header>
  );
}

export function ShowcaseGallery({
  blocks,
}: {
  blocks: readonly ExperimentalMedia[];
}) {
  const gallery = blocks.slice(1);
  if (gallery.length === 0) return null;

  return (
    <div className="lab-showcase-gallery">
      {gallery.map((block) => (
        <ShowcaseBlock key={block.src} block={block} />
      ))}
    </div>
  );
}
