import type { ReactNode } from "react";

type CaseStudyImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function CaseStudyImage({
  src,
  alt,
  className = "",
  priority = false,
}: CaseStudyImageProps) {
  return (
    <figure className={`case-study-media ${className}`.trim()}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="case-study-media-img"
        loading={priority ? "eager" : "lazy"}
        draggable={false}
      />
    </figure>
  );
}

type CaseStudyImageGridProps = {
  images: { src: string; alt: string }[];
  className?: string;
};

export function CaseStudyImageGrid({
  images,
  className = "",
}: CaseStudyImageGridProps) {
  return (
    <div className={`case-study-media-grid ${className}`.trim()}>
      {images.map((image) => (
        <CaseStudyImage key={image.src} src={image.src} alt={image.alt} />
      ))}
    </div>
  );
}

type CaseStudySectionHeaderProps = {
  label?: string;
  headline: string;
  intro?: string | ReactNode;
};

export function CaseStudySectionHeader({
  label,
  headline,
  intro,
}: CaseStudySectionHeaderProps) {
  return (
    <header className="case-study-section-header">
      {label ? (
        <p className="type-nav mb-4 text-black/45">{label}</p>
      ) : null}
      <h2 className="case-study-headline">{headline}</h2>
      {intro ? (
        typeof intro === "string" ? (
          <p className="type-body mt-5 max-w-[42rem] text-black/72">{intro}</p>
        ) : (
          intro
        )
      ) : null}
    </header>
  );
}

type CaseStudyMethodTagProps = {
  label: string;
};

export function CaseStudyMethodTag({ label }: CaseStudyMethodTagProps) {
  return <span className="case-study-method-tag type-nav">{label}</span>;
}
