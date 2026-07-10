"use client";

import Image from "next/image";
import { useFitText } from "@/hooks/useFitText";
import {
  HERO_TITLE_FIT_RATIO,
  HERO_TITLE_FIT_TEXT,
  HERO_TITLE_LETTER_SPACING,
  HERO_TITLE_ROW_GAP_EM,
} from "@/lib/animation/heroTitleLayout";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const heroPanes = [
  {
    src: "/projects/Amazon Music.png",
    alt: "Amazon Music For Ü project interface preview",
    shellClassName: "hero-photo-pane-shell hero-photo-pane-shell--one",
    paneClassName: "hero-photo-pane hero-photo-pane--one",
  },
  {
    src: "/projects/COPPER.png",
    alt: "COPPER project interface preview",
    shellClassName: "hero-photo-pane-shell hero-photo-pane-shell--two",
    paneClassName: "hero-photo-pane hero-photo-pane--two",
  },
  {
    src: "/projects/GT.png",
    alt: "Gaze Tutor project interface preview",
    shellClassName: "hero-photo-pane-shell hero-photo-pane-shell--three",
    paneClassName: "hero-photo-pane hero-photo-pane--three",
  },
  {
    src: "/projects/NGA.png",
    alt: "NGA project interface preview",
    shellClassName: "hero-photo-pane-shell hero-photo-pane-shell--four",
    paneClassName: "hero-photo-pane hero-photo-pane--four",
  },
  {
    src: "/projects/IONG.png",
    alt: "IONG project interface preview",
    shellClassName: "hero-photo-pane-shell hero-photo-pane-shell--five",
    paneClassName: "hero-photo-pane hero-photo-pane--five",
  },
];

/**
 * Hero title. Continuous scroll values arrive as CSS custom properties
 * written by {@link ParallaxEngineProvider}, so this never re-renders while
 * scrolling.
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

  return (
    <div className="hero-scene relative flex min-h-0 w-full flex-1 flex-col">
      <div
        ref={titleFitRef}
        data-hero-intro-title
        className="hero-title-stage relative flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-visible pt-6 pb-2 sm:pt-8 md:py-8 lg:py-12"
      >
        <div
          className="hero-title-wrap relative z-[2] flex w-full justify-center overflow-visible will-change-transform"
          style={{
            transform:
              "translateY(calc(var(--hero-title-y, 0) * 1px))",
            transformOrigin: "center center",
          }}
        >
          <div className="hero-photo-stack" aria-hidden="true">
            {heroPanes.map((pane, index) => (
              <div className={pane.shellClassName} key={pane.src}>
                <div className={pane.paneClassName}>
                  <Image
                    src={pane.src}
                    alt={pane.alt}
                    fill
                    priority={index === 1}
                    sizes="(max-width: 768px) 24vw, 180px"
                  />
                </div>
              </div>
            ))}
          </div>
          <h1
            ref={titleFontRef}
            className="type-display relative z-[3] w-fit max-w-full text-center text-black"
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
        <div className="hero-intro-copy">
          <p className="hero-kicker">Hi, I&apos;m Lanting</p>
          <p>{home.heroBio}</p>
        </div>
      </div>
    </div>
  );
}
