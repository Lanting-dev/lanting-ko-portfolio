"use client";

import { useEffect, useRef, useState } from "react";
import {
  ditherFrameIntervalMs,
  ditherRenderScale,
} from "@/lib/dither/constants";
import { renderIntroMeshGradient } from "@/lib/dither/introMeshGradient";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Animated fluid mesh gradient — intro background. */
export function IntroMeshBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const layoutRef = useRef<{ cssW: number; cssH: number; bufferW: number; bufferH: number; step: number } | null>(null);
  const [ready, setReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const cssW = Math.max(1, Math.round(rect.width));
    const cssH = Math.max(1, Math.round(rect.height));
    if (cssW <= 0 || cssH <= 0) return;

    const scale = Math.max(0.45, ditherRenderScale());
    const bufferW = Math.max(1, Math.round(cssW * scale));
    const bufferH = Math.max(1, Math.round(cssH * scale));
    const step = scale < 0.55 ? 2 : 1;

    canvas.width = bufferW;
    canvas.height = bufferH;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    imageDataRef.current = ctx.createImageData(bufferW, bufferH);
    layoutRef.current = { cssW, cssH, bufferW, bufferH, step };

    const draw = (timeMs: number) => {
      const layout = layoutRef.current;
      if (!layout) return;
      renderIntroMeshGradient(ctx, {
        width: layout.bufferW,
        height: layout.bufferH,
        timeMs: reducedMotion ? 0 : timeMs,
        step: layout.step,
        reuseImageData: imageDataRef.current ?? undefined,
      });
      setReady(true);
    };

    if (reducedMotion) {
      draw(0);
      return;
    }

    let frame = 0;
    let lastRender = 0;
    const frameInterval = Math.max(ditherFrameIntervalMs(), 33);

    const tick = (now: number) => {
      if (now - lastRender >= frameInterval) {
        lastRender = now;
        draw(now);
      }
      frame = requestAnimationFrame(tick);
    };

    draw(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="intro-mesh-bg absolute inset-0" aria-hidden="true">
      <div
        className="intro-mesh-bg-fallback absolute inset-0 transition-opacity duration-700"
        style={{ opacity: ready ? 0 : 1 }}
      />
      <canvas
        ref={canvasRef}
        className="intro-mesh-bg-canvas absolute inset-0 h-full w-full transition-opacity duration-700"
        style={{ opacity: ready ? 1 : 0 }}
      />
    </div>
  );
}
