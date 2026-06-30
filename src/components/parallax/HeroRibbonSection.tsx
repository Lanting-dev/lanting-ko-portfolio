"use client";

import { useCallback, useMemo, useRef, type RefObject } from "react";
import { KineticRibbon } from "@/components/parallax/KineticRibbon";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollTrackVh } from "@/hooks/useScrollTrackVh";
import { useTrackScrollProgress } from "@/hooks/useTrackScrollProgress";
import { clamp } from "@/lib/parallax/interpolate";
import {
  HERO_RIBBON_ARIA,
  RIBBON_TAPES,
  heroRibbonTapeText,
} from "@/lib/ribbon/ribbonTapes";
import { heroRibbonOverlapVh } from "@/lib/scroll/heroPeek";
import { ribbonScrollVh } from "@/lib/scroll/ribbonScroll";
import { HERO_PEEK_VH } from "@/lib/scroll/rhythmSpec";

type HeroRibbonSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
};

export function HeroRibbonSection({ trackRef: externalRef }: HeroRibbonSectionProps) {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const heroTrackVh = useScrollTrackVh("hero");
  const internalRef = useRef<HTMLElement>(null);
  const trackRef = externalRef ?? internalRef;

  const ribbonTrackVh = ribbonScrollVh(isMobile);
  const heroOverlapVh = heroRibbonOverlapVh(heroTrackVh);

  const tapes = useMemo(
    () =>
      RIBBON_TAPES.map((tape) => ({
        ...tape,
        label: heroRibbonTapeText(tape.textKey),
      })),
    [],
  );

  const applyProgress = useCallback(
    (progress: number) => {
      const root = trackRef.current;
      if (!root) return;

      const kinetic = reducedMotion ? 1 : clamp(progress, 0, 1);
      root.style.setProperty("--ribbon-kinetic", kinetic.toFixed(4));
      root.dataset.kinetic = kinetic > 0.04 ? "active" : "idle";
    },
    [reducedMotion, trackRef],
  );

  useTrackScrollProgress(trackRef, applyProgress);

  return (
    <section
      ref={trackRef}
      className="hero-ribbon-pin relative z-[3] w-full"
      data-kinetic="idle"
      data-reduced={reducedMotion ? "true" : undefined}
      style={{
        height: `${ribbonTrackVh}vh`,
        marginTop: `-${heroOverlapVh}vh`,
        ["--hero-track-vh" as string]: String(heroTrackVh),
        ["--hero-peek-vh" as string]: `${HERO_PEEK_VH}vh`,
      }}
      aria-label={HERO_RIBBON_ARIA}
    >
      <div className="hero-ribbon-sticky sticky top-0 h-dvh w-full pointer-events-none">
        <div className="hero-ribbon-stage relative h-full w-full">
          <div className="hero-ribbon-field">
            {tapes.map((tape) => (
              <KineticRibbon
                key={tape.slot}
                label={tape.label}
                variant={tape.variant}
                slot={tape.slot}
                drift={tape.drift}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
