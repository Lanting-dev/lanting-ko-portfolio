"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { rasterizeDisplayText } from "@/lib/dither/rasterizeDisplayText";
import { CrossStitchScatterCanvas } from "./CrossStitchScatterCanvas";

type StitchDisplayTextProps = {
  lines: readonly string[];
  rowGapEm?: number;
  className?: string;
  shuffleSeed?: number;
};

/** Static cross-stitch display type — material fill at progress 1, not a reveal. */
export function StitchDisplayText({
  lines,
  rowGapEm = 0.2,
  className = "",
  shuffleSeed = 17,
}: StitchDisplayTextProps) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(1);
  const [sourceImage, setSourceImage] = useState<ImageData | null>(null);

  const rebuild = useCallback(async () => {
    const measureEl = measureRef.current;
    if (!measureEl) return;

    const rect = measureEl.getBoundingClientRect();
    const cssW = Math.ceil(rect.width);
    const cssH = Math.ceil(rect.height);
    if (cssW < 8 || cssH < 8) return;

    const style = getComputedStyle(measureEl);
    const fontSizePx = parseFloat(style.fontSize);
    if (!Number.isFinite(fontSizePx) || fontSizePx <= 0) return;

    const data = await rasterizeDisplayText({
      lines,
      cssW,
      cssH,
      fontSizePx,
      fontFamily: style.fontFamily,
      letterSpacing: style.letterSpacing,
      lineGapPx: rowGapEm * fontSizePx,
    });

    if (data) setSourceImage(data);
  }, [lines, rowGapEm]);

  useLayoutEffect(() => {
    rebuild();

    const measureEl = measureRef.current;
    const containerEl = containerRef.current;
    if (!measureEl && !containerEl) return;

    const ro = new ResizeObserver(() => {
      rebuild();
    });

    if (measureEl) ro.observe(measureEl);
    if (containerEl) ro.observe(containerEl);
    window.addEventListener("resize", rebuild);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", rebuild);
    };
  }, [rebuild]);

  useEffect(() => {
    if (!document.fonts?.ready) return;
    document.fonts.ready.then(() => rebuild()).catch(() => rebuild());
  }, [rebuild]);

  if (reducedMotion) {
    return (
      <div
        className={`type-display type-display-hero w-full ${className}`.trim()}
        style={{
          ["--type-display-row-gap" as string]: `${rowGapEm}em`,
        }}
      >
        {lines.map((line) => (
          <span key={line} className="block leading-none">
            {line}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`stitch-display-text relative w-full ${className}`.trim()}
    >
      <div
        ref={measureRef}
        className="type-display type-display-hero invisible w-full"
        style={{
          ["--type-display-row-gap" as string]: `${rowGapEm}em`,
        }}
        aria-hidden="true"
      >
        {lines.map((line) => (
          <span key={line} className="block leading-none">
            {line}
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0">
        <CrossStitchScatterCanvas
          sourceImage={sourceImage}
          progressRef={progressRef}
          fit="contain"
          useIntroLayout
          revealByCell
          animateNoise={false}
          shuffleSeed={shuffleSeed}
          className="h-full w-full"
          alt={lines.join(" ")}
        />
      </div>
    </div>
  );
}
