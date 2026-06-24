"use client";

import { useFitText } from "@/hooks/useFitText";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/**
 * Hero title + bio. Continuous scroll values arrive as CSS custom properties
 * written by {@link ParallaxEngineProvider}, so this never re-renders while
 * scrolling.
 */
export function HeroParallaxScene() {
  const { home } = useLocale();
  // Size "LANTING" (the wider line) to fill the title column edge-to-edge.
  const {
    widthRef: titleFitRef,
    fontRef: titleFontRef,
    fontSize: titleFontSize,
  } = useFitText<HTMLDivElement, HTMLHeadingElement>("LANTING");

  return (
    <div className="hero-scene relative flex min-h-0 flex-1 flex-col">
      <div
        ref={titleFitRef}
        className="hero-title-stage relative flex min-h-0 flex-1 flex-col justify-center overflow-visible pt-6 pb-2 sm:pt-8 md:py-8 lg:py-12"
      >
        <div
          className="relative w-full overflow-visible will-change-transform"
          style={{
            transform:
              "translateX(clamp(1rem, 1.5vw, 1.75rem)) translateY(calc(var(--hero-title-y, 0) * 1px)) scale(var(--hero-title-scale, 1))",
            transformOrigin: "left center",
          }}
        >
          <h1
            ref={titleFontRef}
            className="type-display text-black"
            style={{
              ["--type-display-row-gap" as string]:
                "calc(var(--hero-rowgap, 0.2) * 1em)",
              ...(titleFontSize ? { fontSize: `${titleFontSize}px` } : {}),
            }}
            aria-label="Lanting Ko"
          >
            <div className="type-display-hero relative">
              <span className="relative block leading-none">
                <span
                  className="block"
                  style={{ opacity: "var(--hero-split, 0)" }}
                  aria-hidden="true"
                >
                  LAN<span className="ml-[0.18em]">TING</span>
                </span>
                <span
                  className="absolute inset-0 block leading-none"
                  style={{ opacity: "calc(1 - var(--hero-split, 0))" }}
                  aria-hidden="true"
                >
                  LANTING
                </span>
              </span>

              <span className="block leading-none">KO</span>
            </div>
          </h1>
        </div>
      </div>

      <div
        className="hero-bio-block pointer-events-none flex w-full min-w-0 max-w-full flex-col"
        style={{
          transform: "translateY(calc(var(--hero-bio-ty, 0) * 1px))",
          opacity: "var(--hero-bio-opacity, 1)",
        }}
      >
        <p
          className="hero-bio-copy type-body text-right text-black"
          style={{
            transform:
              "translateY(calc((100% - var(--hero-bio-peek, 1.9em)) * (1 - var(--hero-bio-reveal, 0))))",
          }}
        >
          {home.heroBio}
        </p>
      </div>
    </div>
  );
}
