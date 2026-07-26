"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useFitText } from "@/hooks/useFitText";
import { useViewportHeight } from "@/hooks/useViewportHeight";
import {
  HERO_TITLE_FIT_RATIO,
  HERO_TITLE_FIT_TEXT,
  HERO_TITLE_LETTER_SPACING,
  HERO_TITLE_MAX_HEIGHT_RATIO,
  measureHeroTitleMetrics,
} from "@/lib/animation/heroTitleLayout";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { HeroFigure } from "./HeroFigure";

/** Must match `.hero-title-line`'s line-height. */
const TITLE_LINE_HEIGHT = 0.78;

/**
 * Hero. The name brackets the figure , "LAN TING" bleeding off the top corners,
 * "KO" cut by the bottom edge , with the copy sitting in the negative space on
 * the right. Continuous scroll values arrive as CSS custom properties written
 * by {@link ParallaxEngineProvider}, so this never re-renders while scrolling.
 */
export function HeroParallaxScene() {
  const { home } = useLocale();
  const {
    widthRef: titleFitRef,
    fontRef: titleFontRef,
    fontSize: titleFontSize,
  } = useFitText<HTMLDivElement, HTMLHeadingElement>(
    HERO_TITLE_FIT_TEXT,
    HERO_TITLE_FIT_RATIO,
  );

  /**
   * The fit only knows about width. Hold the name to a share of the height too,
   * or on a wide, short viewport it and "KO" take 58% of the screen between
   * them and the band and figure have nowhere to go.
   */
  const viewportHeight = useViewportHeight();
  const titleSize =
    titleFontSize != null
      ? Math.min(titleFontSize, viewportHeight * HERO_TITLE_MAX_HEIGHT_RATIO)
      : null;

  /**
   * The nav sits in flow above the sticky hero, so at rest the composition
   * starts that far down the viewport while still claiming a full 100dvh , the
   * bottom-anchored pieces would fall off-screen. Publish the offset so they
   * can sit on the visible edge instead of the overflowed one.
   */
  const compositionRef = useRef<HTMLDivElement | null>(null);
  const syncBottomOffset = useCallback(() => {
    const el = compositionRef.current;
    if (!el) return;
    /**
     * Measure the nav band itself, not the composition's own overflow. Both
     * insets are the same quantity , the strip the sticky hero starts below and
     * therefore hangs past the fold by , but reading it off the composition
     * makes it circular: the box grows itself past the fold to hold "KO", which
     * would feed straight back into the number that positions "KO".
     */
    const navBand = document
      .querySelector("[data-nav-band]")
      ?.getBoundingClientRect().height;
    const inset = `${Math.max(0, navBand ?? 0)}px`;
    el.style.setProperty("--hero-bottom-inset", inset);
    el.style.setProperty("--hero-top-inset", inset);
  }, []);

  useLayoutEffect(syncBottomOffset, [syncBottomOffset]);
  useEffect(() => {
    window.addEventListener("resize", syncBottomOffset);
    return () => window.removeEventListener("resize", syncBottomOffset);
  }, [syncBottomOffset]);

  /**
   * The figure is sized to the "KO" line, so the portrait sits exactly inside
   * the word. Measured rather than guessed: the title font-size is itself fit
   * to the viewport, so no static length tracks it. Published as a custom
   * property , CSS keeps a static fallback for the first paint and for no-JS.
   */
  const tailRef = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const tail = tailRef.current;
    const composition = compositionRef.current;
    if (!tail || !composition) return;

    const syncKoWidth = () => {
      const { width } = tail.getBoundingClientRect();
      if (width > 0) {
        composition.style.setProperty("--hero-ko-width", `${width}px`);
      }
    };

    syncKoWidth();
    // Fires for viewport resize, the fit-text pass and web-font swap alike.
    const observer = new ResizeObserver(syncKoWidth);
    observer.observe(tail);
    return () => observer.disconnect();
  }, []);

  /**
   * Publish the title's real vertical metrics. The rhythm below the name hangs
   * off its baseline, and `line-height: 0.78` means the caps overrun their line
   * box , both are font-specific, and every em-fraction estimate of them has
   * been wrong by enough to shear the caps or leave "KO" floating off the fold.
   */
  const titleFontElRef = titleFontRef;
  useLayoutEffect(() => {
    const composition = compositionRef.current;
    const fontEl = titleFontElRef.current;
    if (!composition || !fontEl || titleSize == null) return;

    const { fontFamily, fontWeight } = getComputedStyle(fontEl);
    const metrics = measureHeroTitleMetrics(
      titleSize,
      fontFamily,
      fontWeight,
      TITLE_LINE_HEIGHT,
    );
    if (!metrics) return;

    composition.style.setProperty("--hero-cap-height", `${metrics.capHeight}px`);
    composition.style.setProperty(
      "--hero-ink-top-inset",
      `${metrics.inkTopInset}px`,
    );
    composition.style.setProperty(
      "--hero-baseline-to-box-bottom",
      `${metrics.baselineToBoxBottom}px`,
    );
  }, [titleSize, titleFontElRef]);

  return (
    <div className="hero-scene relative flex min-h-0 w-full flex-1 flex-col">
      <div
        ref={(node) => {
          titleFitRef.current = node;
          compositionRef.current = node;
        }}
        data-hero-intro-title
        className="hero-composition"
        style={{
          ...(titleSize
            ? { ["--hero-title-size" as string]: `${titleSize}px` }
            : {}),
        }}
      >
        <HeroFigure />

        <h1
          ref={titleFontRef}
          className="hero-title-cut"
          style={{
            letterSpacing: HERO_TITLE_LETTER_SPACING,
            ...(titleSize ? { fontSize: `${titleSize}px` } : {}),
          }}
          aria-label="Lanting Ko"
        >
          <span
            data-hero-intro-line
            className="hero-title-line hero-title-line--lead"
          >
            LAN TING
          </span>
          <span
            ref={tailRef}
            data-hero-intro-line
            className="hero-title-line hero-title-line--tail"
          >
            KO
          </span>
        </h1>

        <div className="hero-intro-copy">
          <p className="hero-kicker">{home.heroKicker}</p>
          <p>{home.heroBio}</p>
        </div>
      </div>
    </div>
  );
}
