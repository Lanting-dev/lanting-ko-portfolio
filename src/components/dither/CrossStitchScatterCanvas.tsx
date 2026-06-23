"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  CROSS_STITCH_CELL,
  CROSS_STITCH_CELL_CARD,
  CROSS_STITCH_INSET,
  CROSS_STITCH_INSET_CARD,
  CROSS_STITCH_INTRO_PILE_BAND,
  CROSS_STITCH_THREAD,
  CROSS_STITCH_THREAD_CARD,
  DITHER_PIXEL_SIZE,
  cardStitchBufferLayout,
  ditherBufferLayout,
  introBufferLayout,
} from "@/lib/dither/constants";
import {
  buildStitchCells,
  renderCrossStitchCellScatter,
  type StitchCell,
} from "@/lib/dither/crossStitch";
import { computeImageFit } from "@/lib/dither/imageSample";
import { clamp } from "@/lib/dither/bayer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type CrossStitchScatterCanvasProps = {
  src?: string;
  sourceImage?: ImageData | null;
  progressRef: RefObject<number>;
  shuffleSeed?: number;
  fit?: "cover" | "contain";
  useIntroLayout?: boolean;
  /** Project cards — coarse buffer + 4px X cells. */
  useCardStitchLayout?: boolean;
  /** Intro — reveal one X cell at a time instead of per pixel. */
  revealByCell?: boolean;
  /** 0→1 — stitch threads drift up and dissolve during sharp fade-in. */
  driftRef?: RefObject<number>;
  /** Subtle live grain on stitch threads. */
  animateNoise?: boolean;
  /** Move settled sand cells with a subtle continuous wind. */
  ambientSandMotion?: boolean;
  /** Canvas fill behind stitch threads (defaults to white). */
  backgroundRgb?: [number, number, number];
  /** Heap scatter on drift (footer sand impact). */
  sandPile?: boolean;
  /** Intro exit pile height as a share of canvas height. */
  pileBand?: number;
  className?: string;
  alt?: string;
};

export function CrossStitchScatterCanvas({
  src,
  sourceImage: sourceImageProp = null,
  progressRef,
  shuffleSeed = 17,
  fit = "contain",
  useIntroLayout = false,
  useCardStitchLayout = false,
  revealByCell = false,
  driftRef,
  animateNoise = true,
  ambientSandMotion = false,
  backgroundRgb = [255, 255, 255],
  sandPile,
  pileBand,
  className,
  alt = "Cross stitch",
}: CrossStitchScatterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [loadedSrc, setLoadedSrc] = useState<ImageData | null>(null);
  const [layout, setLayout] = useState({ w: 0, h: 0 });
  const [stitchCells, setStitchCells] = useState<StitchCell[]>([]);

  const sourceImage = sourceImageProp ?? loadedSrc;

  useEffect(() => {
    if (sourceImageProp || !src) {
      setLoadedSrc(null);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    img.onload = () => {
      if (cancelled) return;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const ctx = off.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      setLoadedSrc(ctx.getImageData(0, 0, w, h));
    };

    img.onerror = () => {
      if (!cancelled) setLoadedSrc(null);
    };

    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, sourceImageProp]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      setLayout({ w: Math.round(rect.width), h: Math.round(rect.height) });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const resolveBufferLayout = useCallback(
    (w: number, h: number) => {
      if (useIntroLayout) return introBufferLayout(w, h);
      if (useCardStitchLayout) return cardStitchBufferLayout(w, h);
      return ditherBufferLayout(w, h, DITHER_PIXEL_SIZE);
    },
    [useIntroLayout, useCardStitchLayout],
  );

  const resolveStitchGrid = useCallback(() => {
    if (useCardStitchLayout) {
      return {
        cellSize: CROSS_STITCH_CELL_CARD,
        inset: CROSS_STITCH_INSET_CARD,
        threadWidth: CROSS_STITCH_THREAD_CARD,
      };
    }
    return {
      cellSize: CROSS_STITCH_CELL,
      inset: CROSS_STITCH_INSET,
      threadWidth: CROSS_STITCH_THREAD,
    };
  }, [useCardStitchLayout]);

  useEffect(() => {
    if (!sourceImage || layout.w <= 0 || layout.h <= 0) {
      setStitchCells([]);
      return;
    }

    const { bufferW, bufferH } = resolveBufferLayout(layout.w, layout.h);
    const stitchGrid = resolveStitchGrid();

    const { drawWidth, drawHeight, offsetX, offsetY } = computeImageFit(
      sourceImage.width,
      sourceImage.height,
      bufferW,
      bufferH,
      fit,
    );

    const buildConfig = {
      width: bufferW,
      height: bufferH,
      source: sourceImage,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight,
      shuffleSeed,
      ...stitchGrid,
    };

    setStitchCells(buildStitchCells(buildConfig));
  }, [
    sourceImage,
    layout,
    fit,
    shuffleSeed,
    resolveBufferLayout,
    resolveStitchGrid,
  ]);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const drift = reducedMotion ? 0 : clamp(driftRef?.current ?? 0, 0, 1);
    // Scroll-scrubbed sand must be deterministic — wall clock breaks rewind.
    const scrollScrubbed = Boolean(driftRef && sandPile);
    const sandTimeMs = scrollScrubbed ? drift * 12_000 : performance.now();
    const noiseActive = animateNoise && !reducedMotion;
    const sandClockActive = noiseActive || (scrollScrubbed && drift > 0);
    const renderOptions = {
      backgroundRgb,
      ...(drift > 0 ? { drift } : {}),
      ...(sandClockActive
        ? {
            noise: {
              timeMs: sandTimeMs,
              ...(drift > 0 ? { amplitude: 0, dropout: 0 } : {}),
            },
          }
        : {}),
      enablePile: sandPile ?? !useCardStitchLayout,
      ...(pileBand !== undefined
        ? { pileBand }
        : useIntroLayout
          ? { pileBand: CROSS_STITCH_INTRO_PILE_BAND }
          : {}),
      ...(ambientSandMotion ? { ambientMotion: true } : {}),
    };

    if (stitchCells.length === 0) return;

    renderCrossStitchCellScatter(
      ctx,
      canvas.width,
      canvas.height,
      stitchCells,
      progressRef.current,
      renderOptions,
    );
  }, [
    stitchCells,
    progressRef,
    driftRef,
    animateNoise,
    reducedMotion,
    useCardStitchLayout,
    useIntroLayout,
    backgroundRgb,
    sandPile,
    pileBand,
    ambientSandMotion,
  ]);

  useEffect(() => {
    if (!sourceImage || layout.w <= 0 || layout.h <= 0) return;

    const { bufferW, bufferH } = resolveBufferLayout(layout.w, layout.h);

    const canvas = canvasRef.current;
    if (canvas && (canvas.width !== bufferW || canvas.height !== bufferH)) {
      canvas.width = bufferW;
      canvas.height = bufferH;
    }
    paint();
  }, [sourceImage, layout, stitchCells, paint, resolveBufferLayout]);

  useEffect(() => {
    let id = 0;
    const tick = () => {
      paint();
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [paint]);

  return (
    <div ref={containerRef} className={className ?? "h-full w-full"}>
      <canvas
        ref={canvasRef}
        aria-label={alt}
        className="block h-full w-full"
        style={{
          width: layout.w || "100%",
          height: layout.h || "100%",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
