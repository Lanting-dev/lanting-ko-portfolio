"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type Options = {
  /** Viewport fraction where progress reaches 1 (0 = top, 1 = bottom). */
  finishAt?: number;
};

/**
 * Scroll-scrubbed 0 → 1 value based on an element's vertical position: 0 while
 * it sits at the bottom of the viewport, 1 once it rises to `finishAt`.
 * rAF-throttled; for cheap scroll-linked reveals that aren't on the parallax engine.
 */
export function useScrollRevealProgress<T extends HTMLElement>(
  options: Options = {},
): { ref: RefObject<T | null>; progress: number } {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  const finishAt = options.finishAt ?? 0.55;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const top = el.getBoundingClientRect().top;
      const start = vh; // top at viewport bottom → 0
      const end = vh * finishAt; // top at finish line → 1
      const raw = (start - top) / (start - end);
      const next = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      setProgress((prev) => (Math.abs(next - prev) < 0.001 ? prev : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [finishAt]);

  return { ref, progress };
}
