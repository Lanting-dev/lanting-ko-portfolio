import type { ReactNode } from "react";
import { CaseStudyReveal } from "@/components/case-study/CaseStudyReveal";
import { CaseStudyParallax } from "@/components/case-study/CaseStudyParallax";
import { CaseStudyParallaxReveal } from "@/components/case-study/CaseStudyParallaxReveal";

type CaseStudySectionProps = {
  id?: string;
  label?: string;
  headline: string;
  body?: string | readonly string[];
  className?: string;
  children?: ReactNode;
};

export function CaseStudySection({
  id,
  label,
  headline,
  body,
  className = "",
  children,
}: CaseStudySectionProps) {
  const bodyContent = Array.isArray(body) ? body : body ? [body] : [];

  return (
    <section
      id={id}
      className={`case-study-section ${className}`.trim()}
    >
      {label ? (
        <CaseStudyReveal>
          <p className="case-study-section-label type-nav">{label}</p>
        </CaseStudyReveal>
      ) : null}

      <CaseStudyReveal motion="scale">
        <h2 className="case-study-section-headline">{headline}</h2>
      </CaseStudyReveal>

      {bodyContent.length > 0 ? (
        <CaseStudyReveal className="case-study-section-body" delay={0.05}>
          {bodyContent.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="type-body text-black/65">
              {paragraph}
            </p>
          ))}
        </CaseStudyReveal>
      ) : null}

      {children ? (
        <div className="case-study-section-media">{children}</div>
      ) : null}
    </section>
  );
}

type CaseStudyFigureProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  delay?: number;
  parallax?: boolean;
  /** Fixed-aspect viewport; image scrolls inside on page scroll. */
  revealAspect?: number;
};

export function CaseStudyFigure({
  src,
  alt,
  caption,
  className = "",
  parallax = true,
  revealAspect,
}: CaseStudyFigureProps) {
  const image = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src={src} alt={alt} className="case-study-figure-img" loading="lazy" draggable={false} />
  );

  return (
    <figure className={`case-study-figure ${className}`.trim()}>
      {revealAspect ? (
        <CaseStudyParallaxReveal
          className="case-study-figure-frame"
          viewportAspect={revealAspect}
        >
          {image}
        </CaseStudyParallaxReveal>
      ) : parallax ? (
        <CaseStudyParallax
          className="case-study-figure-frame"
          strength={110}
          offset={64}
        >
          {image}
        </CaseStudyParallax>
      ) : (
        <div className="case-study-figure-frame case-study-figure-frame--plain">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="case-study-figure-img" loading="lazy" draggable={false} />
        </div>
      )}
      {caption ? (
        <figcaption className="case-study-figure-caption type-nav">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

type CaseStudyFigureGridProps = {
  images: { src: string; alt: string; caption?: string }[];
  className?: string;
  delay?: number;
};

export function CaseStudyFigureGrid({
  images,
  className = "",
}: CaseStudyFigureGridProps) {
  return (
    <div className={`case-study-figure-grid ${className}`.trim()}>
      {images.map((image, i) => (
        <figure key={image.src} className="case-study-figure">
          <CaseStudyParallax
            className="case-study-figure-frame"
            strength={i % 2 === 0 ? 100 : -130}
            offset={72}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className="case-study-figure-img"
              loading="lazy"
              draggable={false}
            />
          </CaseStudyParallax>
          {image.caption ? (
            <figcaption className="case-study-figure-caption type-nav">
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
