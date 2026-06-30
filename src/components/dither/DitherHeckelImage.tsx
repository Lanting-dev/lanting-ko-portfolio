"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import {
  DITHER_RENDER_MODE,
  CROSS_HALFTONE_ARM_WIDTH,
  CROSS_HALFTONE_CELL,
  DITHER_COLOR_NUM,
  DITHER_PIXEL_SIZE,
  DITHER_THRESHOLD_MODE,
  DITHER_BLUE_BLEND,
  ditherBufferLayout,
  ditherIntroMacroScale,
  introBufferLayout,
} from "@/lib/dither/constants";
import { renderCrossHalftone } from "@/lib/dither/crossHalftone";
import { renderHeckelImageDither } from "@/lib/dither/ditherImage";

type DitherHeckelImageProps = {
  src?: string;
  sourceImage?: ImageData | null;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  fit?: "cover" | "contain";
  revealRange?: readonly [number, number];
  progressRef?: RefObject<number>;
  /** Full-screen intro , lower internal res, pixel size 2 like article demo. */
  useIntroLayout?: boolean;
  onReady?: () => void;
};

function computeImageFit(
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
  fit: "cover" | "contain",
): { drawWidth: number; drawHeight: number; offsetX: number; offsetY: number } {
  const srcAspect = srcW / srcH;
  const dstAspect = dstW / dstH;

  if (fit === "contain") {
    if (srcAspect > dstAspect) {
      const drawWidth = dstW;
      const drawHeight = dstW / srcAspect;
      return { drawWidth, drawHeight, offsetX: 0, offsetY: (dstH - drawHeight) / 2 };
    }
    const drawHeight = dstH;
    const drawWidth = dstH * srcAspect;
    return { drawWidth, drawHeight, offsetX: (dstW - drawWidth) / 2, offsetY: 0 };
  }

  if (srcAspect > dstAspect) {
    const drawHeight = dstH;
    const drawWidth = dstH * srcAspect;
    return { drawWidth, drawHeight, offsetX: (dstW - drawWidth) / 2, offsetY: 0 };
  }

  const drawWidth = dstW;
  const drawHeight = dstW / srcAspect;
  return { drawWidth, drawHeight, offsetX: 0, offsetY: (dstH - drawHeight) / 2 };
}

export function DitherHeckelImage({
  src,
  sourceImage = null,
  alt = "",
  className,
  style,
  fit = "contain",
  revealRange = [0, 1],
  progressRef,
  useIntroLayout = false,
  onReady,
}: DitherHeckelImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedSrc, setLoadedSrc] = useState<ImageData | null>(null);
  const [layout, setLayout] = useState({ w: 0, h: 0 });
  const readyRef = useRef(false);

  const activeSource = sourceImage ?? loadedSrc;

  useEffect(() => {
    if (sourceImage) return;
    if (!src) {
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
  }, [src, sourceImage]);

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

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const source = activeSource;
    if (!canvas || !source || layout.w <= 0 || layout.h <= 0) return;

    const { bufferW, bufferH, pixelSize } = useIntroLayout
      ? introBufferLayout(layout.w, layout.h)
      : ditherBufferLayout(layout.w, layout.h, DITHER_PIXEL_SIZE);

    if (canvas.width !== bufferW || canvas.height !== bufferH) {
      canvas.width = bufferW;
      canvas.height = bufferH;
    }

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const progress = progressRef?.current ?? revealRange[1];
    const [revealStart, revealEnd] = revealRange;
    const span = Math.max(1e-6, revealEnd - revealStart);
    const reveal = Math.min(1, Math.max(0, (progress - revealStart) / span));

    const { drawWidth, drawHeight, offsetX, offsetY } = computeImageFit(
      source.width,
      source.height,
      bufferW,
      bufferH,
      fit,
    );

    const revealConfig = {
      reveal,
      blockReveal: useIntroLayout,
      blockRevealSeed: 17,
      macroScale: useIntroLayout ? ditherIntroMacroScale() : undefined,
      mesoScale: undefined,
      backgroundRgb: [255, 255, 255] as [number, number, number],
    };

    if (DITHER_RENDER_MODE === "cross") {
      renderCrossHalftone(ctx, {
        width: bufferW,
        height: bufferH,
        source,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
        cellSize: CROSS_HALFTONE_CELL,
        armWidth: CROSS_HALFTONE_ARM_WIDTH,
        inkBlack: true,
        ...revealConfig,
      });
    } else {
      renderHeckelImageDither(ctx, {
        width: bufferW,
        height: bufferH,
        source,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
        pixelSize,
        colorNum: DITHER_COLOR_NUM,
        thresholdMode: DITHER_THRESHOLD_MODE,
        blueBlend: DITHER_BLUE_BLEND,
        ...revealConfig,
      });
    }

    if (!readyRef.current && onReady) {
      readyRef.current = true;
      onReady();
    }
  }, [
    activeSource,
    layout,
    progressRef,
    revealRange,
    fit,
    useIntroLayout,
    onReady,
  ]);

  useEffect(() => {
    paint();
  }, [paint]);

  useEffect(() => {
    if (!progressRef) return;
    let id = 0;
    const tick = () => {
      paint();
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [paint, progressRef]);

  return (
    <div ref={containerRef} className={className} style={style}>
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
