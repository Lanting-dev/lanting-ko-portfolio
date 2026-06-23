"use client";

import { useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { CrossStitchScatterCanvas } from "@/components/dither/CrossStitchScatterCanvas";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { createSandPileRaster } from "@/lib/footer/sandPileRaster";
import { getFooterScrollValues } from "@/lib/footer/footerScroll";
import { cardStitchBufferLayout, CROSS_STITCH_FOOTER_PILE_BAND } from "@/lib/dither/constants";
import { FooterSandBloom } from "@/components/footer/FooterSandBloom";

type FooterSandGardenProps = {
  footerProgress: number;
  sandImpactRef: RefObject<HTMLDivElement | null>;
  sandEntryRef: RefObject<HTMLDivElement | null>;
  /** Keep a live grain shimmer after the pile has fully settled. */
  ambientNoise?: boolean;
  bloom?: boolean;
};

export function FooterSandGarden({
  footerProgress,
  sandImpactRef,
  sandEntryRef,
  ambientNoise = false,
  bloom = false,
}: FooterSandGardenProps) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const sandProgressRef = useRef(0);
  const sandDriftRef = useRef(0);
  const [layout, setLayout] = useState({ w: 0, h: 0 });

  const values = useMemo(() => {
    if (reducedMotion) {
      return getFooterScrollValues(1);
    }
    return getFooterScrollValues(footerProgress);
  }, [footerProgress, reducedMotion]);

  sandProgressRef.current = values.sandProgress;
  sandDriftRef.current = values.sandDrift;

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      setLayout({
        w: Math.max(1, Math.round(rect.width)),
        h: Math.max(1, Math.round(rect.height)),
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const sourceImage = useMemo(() => {
    if (layout.w <= 0 || layout.h <= 0) return null;
    const { bufferW, bufferH } = cardStitchBufferLayout(layout.w, layout.h);
    return createSandPileRaster(bufferW, bufferH);
  }, [layout.w, layout.h]);

  const sandAnimating =
    !reducedMotion &&
    (ambientNoise || values.sandProgress < 1 || values.sandDrift > 0.01);

  return (
    <div ref={containerRef} className="footer-sand-garden" aria-hidden="true">
      <div
        ref={sandEntryRef}
        className="footer-sand-entry-slot"
        aria-hidden="true"
      />
      <div
        ref={sandImpactRef}
        className="footer-sand-impact-slot"
        aria-hidden="true"
      />

      {sourceImage ? (
        <CrossStitchScatterCanvas
          sourceImage={sourceImage}
          progressRef={sandProgressRef}
          driftRef={ambientNoise ? undefined : sandDriftRef}
          fit="cover"
          useCardStitchLayout
          revealByCell
          animateNoise={sandAnimating}
          ambientSandMotion={ambientNoise}
          shuffleSeed={41}
          sandPile
          pileBand={CROSS_STITCH_FOOTER_PILE_BAND}
          className="footer-sand-canvas"
          alt=""
        />
      ) : null}
      {bloom ? <FooterSandBloom /> : null}
    </div>
  );
}
