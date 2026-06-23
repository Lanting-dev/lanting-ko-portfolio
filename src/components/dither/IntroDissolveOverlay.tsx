"use client";

import { useEffect, useRef, useState } from "react";
import { easeInOutCubic } from "@/lib/dither/bayer";
import { ditherBufferLayout, ditherFrameIntervalMs } from "@/lib/dither/constants";
import { renderIntroDissolve } from "@/lib/dither/introDissolve";

type IntroDissolveOverlayProps = {
  duration?: number;
  progress?: number;
  trigger?: "mount" | "scroll";
  className?: string;
  onComplete?: () => void;
  onProgressChange?: (progress: number) => void;
};

export function IntroDissolveOverlay({
  duration = 3000,
  progress: externalProgress,
  trigger = "mount",
  className,
  onComplete,
  onProgressChange,
}: IntroDissolveOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const lockedSizeRef = useRef<{ width: number; height: number } | null>(null);
  const [layout, setLayout] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [mountProgress, setMountProgress] = useState(0);
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
    if (!canvas || !layout) return;

    const cssW = layout.width;
    const cssH = layout.height;
    const { bufferW, bufferH, pixelSize } = ditherBufferLayout(cssW, cssH, 2);

    canvas.width = bufferW;
    canvas.height = bufferH;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    imageDataRef.current = ctx.createImageData(bufferW, bufferH);

    const renderFrame = (p: number) => {
      renderIntroDissolve(ctx, {
        width: bufferW,
        height: bufferH,
        progress: p,
        pixelSize,
        reuseImageData: imageDataRef.current ?? undefined,
      });
    };

    if (trigger === "scroll") {
      renderFrame(externalProgress ?? 1);
      return;
    }

    if (completedRef.current) return;

    let frame = 0;
    const start = performance.now();
    let lastRender = 0;
    let lastUi = 0;
    const frameInterval = ditherFrameIntervalMs();

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
        }
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [layout, trigger, duration, externalProgress]);

  const progress =
    externalProgress ?? (trigger === "mount" ? mountProgress : 1);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      {layout ? (
        <canvas
          ref={canvasRef}
          className="intro-dissolve-canvas absolute inset-0 block h-full w-full"
        />
      ) : null}
      <span className="sr-only">{Math.round(progress * 100)}%</span>
    </div>
  );
}
