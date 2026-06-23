"use client";

import { useMemo, useRef, type RefObject } from "react";
import { FlowerGraphicClient } from "@/components/FlowerGraphicClient";
import { getHeroParallaxValues } from "@/lib/parallax/heroParallax";
import { pinballBioNudge } from "@/lib/animation/pinballBounce";
import { useFitText } from "@/hooks/useFitText";

type HeroParallaxSceneProps = {
  progress: number;
  anchorRef: RefObject<HTMLSpanElement | null>;
  bioShelfRef: RefObject<HTMLDivElement | null>;
  bioCopyRef: RefObject<HTMLParagraphElement | null>;
  /** Hide when FloatingOrb renders the flower (avoids duplicate). */
  hideInlineFlower?: boolean;
};

export function HeroParallaxScene({
  progress,
  anchorRef,
  bioShelfRef,
  bioCopyRef,
  hideInlineFlower = false,
}: HeroParallaxSceneProps) {
  const bioBlockRef = useRef<HTMLDivElement>(null);
  // Size "LANTING" (the wider line) to fill the title column edge-to-edge.
  const {
    widthRef: titleFitRef,
    fontRef: titleFontRef,
    fontSize: titleFontSize,
  } = useFitText<HTMLDivElement, HTMLHeadingElement>("LANTING");
  const values = useMemo(() => getHeroParallaxValues(progress), [progress]);
  const unifiedOpacity = 1 - values.splitOpacity;
  const bioNudge =
    values.fallPhase > 0 ? pinballBioNudge(values.fallPhase) : 0;

  return (
    <div className="hero-scene relative flex min-h-0 flex-1 flex-col">
      <div
        ref={titleFitRef}
        className="hero-title-stage relative flex min-h-0 flex-1 flex-col justify-center overflow-visible pt-4 pb-2 sm:pt-6 md:py-6 lg:py-10"
      >
        <div
          className="relative w-full overflow-visible will-change-transform"
          style={{
            transform: `translateY(${values.titleYOffset}px) scale(${values.titleScale})`,
            transformOrigin: "left center",
          }}
        >
          <h1
            ref={titleFontRef}
            className="type-display text-black"
            style={{
              ["--type-display-row-gap" as string]: `${values.rowGapEm}em`,
              ...(titleFontSize ? { fontSize: `${titleFontSize}px` } : {}),
            }}
            aria-label="Lanting Ko"
          >
            <div className="type-display-hero relative">
              <span ref={anchorRef} className="relative block leading-none">
                <span
                  className="block"
                  style={{ opacity: values.splitOpacity }}
                  aria-hidden={unifiedOpacity > 0.5}
                >
                  LAN<span className="ml-[0.18em]">TING</span>
                </span>
                <span
                  className="absolute inset-0 block leading-none"
                  style={{ opacity: unifiedOpacity }}
                  aria-hidden={values.splitOpacity > 0.5}
                >
                  LANTING
                </span>

                {!hideInlineFlower && values.ballMix < 0.98 ? (
                  <span
                    className="pointer-events-none absolute z-10 [isolation:isolate]"
                    style={{
                      width: `calc(var(--figma-flower-size) * ${values.orbFlowerScale})`,
                      height: `calc(var(--figma-flower-size) * ${values.orbFlowerScale})`,
                      left: `${values.orbLeftEm}em`,
                      top: `${values.orbTopEm}em`,
                      transform: "translate(-50%, -50%)",
                    }}
                    aria-hidden="true"
                  >
                    <FlowerGraphicClient className="h-full w-full" />
                  </span>
                ) : null}
              </span>

              <span className="block leading-none">KO</span>
            </div>
          </h1>
        </div>
      </div>

      <div
        ref={bioBlockRef}
        className="hero-bio-block pointer-events-none flex w-full min-w-0 max-w-full flex-col"
        style={{
          transform: `translateY(${values.bioTranslateY + bioNudge}px)`,
          opacity: values.bioOpacity,
        }}
      >
        <div
          ref={bioShelfRef}
          className="hero-bio-shelf shrink-0"
          style={{ height: "var(--figma-ball-size)" }}
          aria-hidden="true"
        />
        <p
          ref={bioCopyRef}
          className="hero-bio-copy type-body text-right text-black"
          style={{
            transform: `translateY(calc((100% - var(--hero-bio-peek, 1.9em)) * ${1 - values.bioReveal}))`,
          }}
        >
          Lan-Ting is a product designer who shapes how things are structured,
          function, and look. She creates digital experiences that are clear,
          structured, and human-centered.
        </p>
      </div>
    </div>
  );
}
