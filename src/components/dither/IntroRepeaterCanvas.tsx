"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  buildIntroGridCache,
  gridCellFloorPositions,
  INTRO_EXIT_FADE_START,
  renderIntroRepeater,
  type IntroRenderCache,
} from "@/lib/animation/introRepeater";
import {
  buildIntroNameMask,
  buildNameRowOrder,
  pairNameToGrid,
  readIntroSoraFont,
} from "@/lib/animation/introNameMask";
import { readHeroIntroTitleLayout } from "@/lib/animation/heroTitleLayout";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type IntroRepeaterCanvasProps = {
  durationMs: number;
  onComplete: () => void;
  onExitBegin?: () => void;
  className?: string;
};

export function IntroRepeaterCanvas({
  durationMs,
  onComplete,
  onExitBegin,
  className,
}: IntroRepeaterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef({ w: 0, h: 0 });
  const cacheRef = useRef<IntroRenderCache | null>(null);
  const startedRef = useRef(false);
  const exitBeganRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();
  const onCompleteRef = useRef(onComplete);
  const onExitBeginRef = useRef(onExitBegin);
  const [cacheReady, setCacheReady] = useState(false);
  onCompleteRef.current = onComplete;
  onExitBeginRef.current = onExitBegin;

  const paint = useCallback((linear: number, timeMs: number) => {
    const canvas = canvasRef.current;
    const { w, h } = layoutRef.current;
    const cache = cacheRef.current;
    if (!canvas || !cache || w <= 0 || h <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bufferW = Math.round(w * dpr);
    const bufferH = Math.round(h * dpr);

    if (canvas.width !== bufferW || canvas.height !== bufferH) {
      canvas.width = bufferW;
      canvas.height = bufferH;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderIntroRepeater(ctx, w, h, linear, timeMs, cache);
  }, []);

  const rebuildCache = useCallback(async (): Promise<boolean> => {
    const { w, h } = layoutRef.current;
    if (w <= 0 || h <= 0) return false;

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const grid = buildIntroGridCache(w, h);
    const { fontFamily, fontWeight } = await readIntroSoraFont();
    let titleLayout = readHeroIntroTitleLayout();

    const name = await buildIntroNameMask(
      w,
      h,
      fontFamily,
      fontWeight,
      grid.cells.length,
      grid.cellStep,
      titleLayout,
    );

    if (!name || name.points.length < 80) {
      return false;
    }

    const { nameToGrid, fadeGrid } = pairNameToGrid(
      gridCellFloorPositions(grid.cells, w, h),
      name.points,
      w,
      h,
      titleLayout?.lineCenters,
    );
    cacheRef.current = {
      grid,
      name,
      nameToGrid,
      nameRow: buildNameRowOrder(name.points, h),
      fadeGrid,
      nameFontFamily: fontFamily,
      nameFontWeight: fontWeight,
      titleLayout,
    };
    setCacheReady(true);
    paint(0, 0);
    return true;
  }, [paint]);

  const syncLayout = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (w === layoutRef.current.w && h === layoutRef.current.h) return;

    layoutRef.current = { w, h };
    if (!startedRef.current) {
      setCacheReady(false);
      void rebuildCache();
    }
  }, [rebuildCache]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    layoutRef.current = {
      w: Math.round(rect.width),
      h: Math.round(rect.height),
    };
    void rebuildCache();

    const ro = new ResizeObserver(syncLayout);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rebuildCache, syncLayout]);

  useEffect(() => {
    if (cacheReady || reducedMotion || startedRef.current) return;

    let cancelled = false;
    let attempts = 0;

    const retry = async () => {
      if (cancelled || cacheReady || startedRef.current) return;
      attempts += 1;
      const ok = await rebuildCache();
      if (ok || cancelled) return;
      if (attempts < 40) {
        window.setTimeout(() => void retry(), 150);
        return;
      }
      onCompleteRef.current();
    };

    void retry();
    return () => {
      cancelled = true;
    };
  }, [cacheReady, rebuildCache, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      void rebuildCache().then((ok) => {
        if (ok) paint(1, 0);
        onCompleteRef.current();
      });
      return;
    }

    if (!cacheReady || startedRef.current) return;
    startedRef.current = true;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const linear = Math.min(1, (now - start) / durationMs);
      paint(linear, now - start);

      if (
        !exitBeganRef.current &&
        linear >= INTRO_EXIT_FADE_START
      ) {
        exitBeganRef.current = true;
        onExitBeginRef.current?.();
      }

      if (linear < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }

      onCompleteRef.current();
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cacheReady, durationMs, paint, rebuildCache, reducedMotion]);

  return (
    <div ref={containerRef} className={className ?? "h-full w-full"}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="block h-full w-full"
      />
    </div>
  );
}
