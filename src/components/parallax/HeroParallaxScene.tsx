"use client";

import { useFitText } from "@/hooks/useFitText";
import {
  HERO_TITLE_FIT_RATIO,
  HERO_TITLE_FIT_TEXT,
  HERO_TITLE_LETTER_SPACING,
  HERO_TITLE_ROW_GAP_EM,
} from "@/lib/animation/heroTitleLayout";

/**
 * Hero title. Continuous scroll values arrive as CSS custom properties
 * written by {@link ParallaxEngineProvider}, so this never re-renders while
 * scrolling.
 */
export function HeroParallaxScene() {
  const {
    widthRef: titleFitRef,
    fontRef: titleFontRef,
    fontSize: titleFontSize,
  } = useFitText<HTMLDivElement, HTMLHeadingElement>(
    HERO_TITLE_FIT_TEXT,
    HERO_TITLE_FIT_RATIO,
  );

  return (
    <div className="hero-scene relative flex min-h-0 flex-1 flex-col">
      <div
        ref={titleFitRef}
        data-hero-intro-title
        className="hero-title-stage relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-visible pt-6 pb-2 sm:pt-8 md:py-8 lg:py-12"
      >
        <div
          className="relative flex w-full justify-center overflow-visible will-change-transform"
          style={{
            transform:
              "translateY(calc(var(--hero-title-y, 0) * 1px))",
            transformOrigin: "center center",
          }}
        >
          <h1
            ref={titleFontRef}
            className="type-display w-fit max-w-full text-center text-black"
            style={{
              ["--hero-rowgap" as string]: String(HERO_TITLE_ROW_GAP_EM),
              ["--type-display-row-gap" as string]:
                "calc(var(--hero-rowgap, 0.2) * 1em)",
              letterSpacing: HERO_TITLE_LETTER_SPACING,
              ...(titleFontSize ? { fontSize: `${titleFontSize}px` } : {}),
            }}
            aria-label="Lanting Ko"
          >
            <div className="type-display-hero relative">
              <span
                data-hero-intro-line
                className="block leading-none"
              >
                LAN TING
              </span>
              <span
                data-hero-intro-line
                className="block leading-none"
              >
                KO
              </span>
            </div>
          </h1>
        </div>
      </div>
    </div>
  );
}
