"use client";

import { useEffect, useRef, useState } from "react";
import { easeInOutCubic } from "@/lib/dither/bayer";
import {
  DITHER_BLUE_BLEND,
  DITHER_PIXEL_SIZE,
  ditherBufferLayout,
  ditherColorNumForBrowser,
  ditherFrameIntervalMs,
  ditherThresholdModeForBrowser,
} from "@/lib/dither/constants";
import { renderDitherScatter } from "@/lib/dither/ditherCanvas";
import type { HeckelThresholdMode } from "@/lib/dither/heckelDither";
import type { ImageLuminanceSource } from "@/lib/dither/luminanceField";

type DitherScatterOverlayProps = {
  pixelSize?: number;
  trigger?: "scroll" | "mount" | "active";
  active?: boolean;
  duration?: number;
  progress?: number;
  className?: string;
  colorNum?: number;
  thresholdMode?: HeckelThresholdMode;
  blueBlend?: number;
  imageLuminance?: ImageLuminanceSource;
  onComplete?: () => void;
  onProgressChange?: (progress: number) => void;
};

export function DitherScatterOverlay({
  pixelSize = DITHER_PIXEL_SIZE,
  trigger = "mount",
  active = false,
  duration = 1600,
  progress: externalProgress,
  className,
  colorNum = ditherColorNumForBrowser(),
  thresholdMode = ditherThresholdModeForBrowser(),
  blueBlend = DITHER_BLUE_BLEND,
  imageLuminance,
  onComplete,
  onProgressChange,
}: DitherScatterOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lockedSizeRef = useRef<{ width: number; height: number } | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const [layout, setLayout] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [mountProgress, setMountProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onProgressChangeRef = useRef(onProgressChange);
  onCompleteRef.current = onComplete;
  onProgressChangeRef.current = onProgressChange;

  useEffect(() => {
    const element = containerRef.current;
    if (!element || lockedSizeRef.current) return;

    const measure = () => {
      if (lockedSizeRef.current) return;
      const rect = element.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      if (width > 0 && height > 0) {
        lockedSizeRef.current = { width, height };
        setLayout({ width, height });
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !layout || !imageLuminance) return;

    const cssW = layout.width;
    const cssH = layout.height;
    const { bufferW, bufferH, pixelSize: effPixelSize } = ditherBufferLayout(
      cssW,
      cssH,
      pixelSize,
    );

    canvas.width = bufferW;
    canvas.height = bufferH;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    imageDataRef.current = ctx.createImageData(bufferW, bufferH);

    const renderFrame = (progress: number) => {
      renderDitherScatter(ctx, {
        width: bufferW,
        height: bufferH,
        progress,
        pixelSize: effPixelSize,
        colorNum,
        thresholdMode,
        blueBlend,
        imageLuminance,
        reuseImageData: imageDataRef.current ?? undefined,
      });
    };

    const isAnimated =
      trigger === "mount" || (trigger === "active" && active);

    if (!isAnimated) {
      renderFrame(externalProgress ?? 1);
      return;
    }

    if (completedRef.current) return;

    let frame = 0;
    const start = performance.now();
    let lastRender = 0;
    let lastUi = 0;
    const frameInterval = ditherFrameIntervalMs();
    setFinished(false);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeInOutCubic(t);

      if (frameInterval === 0 || now - lastRender >= frameInterval) {
        lastRender = now;
        renderFrame(eased);
      }

      if (now - lastUi >= 100) {
        lastUi = now;
        setMountProgress(eased);
        onProgressChangeRef.current?.(eased);
      }

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        renderFrame(1);
        setMountProgress(1);
        onProgressChangeRef.current?.(1);
        if (!completedRef.current) {
          completedRef.current = true;
          onCompleteRef.current?.();
          setFinished(true);
        }
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [
    layout,
    trigger,
    active,
    duration,
    externalProgress,
    pixelSize,
    colorNum,
    thresholdMode,
    blueBlend,
    imageLuminance,
  ]);

  const progress =
    externalProgress ??
    (trigger === "mount" || trigger === "active" ? mountProgress : 1);

  if (finished && (trigger === "mount" || trigger === "active")) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? "z-20"}`}
      aria-hidden="true"
    >
      {layout ? (
        <canvas
          ref={canvasRef}
          className="dither-scatter-canvas absolute inset-0 block h-full w-full"
        />
      ) : null}
      <span className="sr-only">{Math.round(progress * 100)}%</span>
    </div>
  );
}
