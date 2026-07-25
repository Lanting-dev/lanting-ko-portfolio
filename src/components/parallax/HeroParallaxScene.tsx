"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useFitText } from "@/hooks/useFitText";
import {
  HERO_TITLE_FIT_RATIO,
  HERO_TITLE_FIT_TEXT,
  HERO_TITLE_LETTER_SPACING,
} from "@/lib/animation/heroTitleLayout";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { HeroFigure } from "./HeroFigure";

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
   * The nav sits in flow above the sticky hero, so at rest the composition
   * starts that far down the viewport while still claiming a full 100dvh , the
   * bottom-anchored pieces would fall off-screen. Publish the offset so they
   * can sit on the visible edge instead of the overflowed one.
   */
  const compositionRef = useRef<HTMLDivElement | null>(null);
  const syncBottomOffset = useCallback(() => {
    const el = compositionRef.current;
    if (!el) return;
    const overflow = el.getBoundingClientRect().bottom - window.innerHeight;
    const inset = `${Math.max(0, overflow)}px`;
    el.style.setProperty("--hero-bottom-inset", inset);
    /**
     * Same quantity seen from the other end: what hangs off the bottom is
     * exactly the nav band the composition starts below. The composition
     * reaches back up by this much so its white fill and its clip edge meet
     * the viewport top , without it, a title pushed above the box gets cut on
     * a line partway down the screen instead of bleeding off it.
     */
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
          transform: "translateY(calc(var(--hero-title-y, 0) * 1px))",
        }}
      >
        <HeroFigure />

        <h1
          ref={titleFontRef}
          className="hero-title-cut"
          style={{
            letterSpacing: HERO_TITLE_LETTER_SPACING,
            ...(titleFontSize ? { fontSize: `${titleFontSize}px` } : {}),
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
