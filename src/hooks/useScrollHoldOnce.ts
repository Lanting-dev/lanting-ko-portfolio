"use client";

import { useEffect, type RefObject } from "react";

type Options = {
  durationMs: number;
  enabled?: boolean;
  /** How much of the element must be visible before the hold engages. */
  threshold?: number;
};

const BLOCKED_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
  "Spacebar",
]);

/**
 * The first time `ref` scrolls into view, freeze the page scroll for
 * `durationMs` so an entrance animation can finish before the user moves on.
 * Fires once per mount; a no-op when disabled (e.g. reduced motion).
 */
export function useScrollHoldOnce(
  ref: RefObject<HTMLElement | null>,
  { durationMs, enabled = true, threshold = 0.5 }: Options,
): void {
  useEffect(() => {
    if (!enabled || durationMs <= 0) return;
    const node = ref.current;
    if (!node) return;

    let fired = false;
    let timer = 0;
    let releaseLock: (() => void) | null = null;

    const lock = () => {
      const y = window.scrollY;
      const prevent = (event: Event) => event.preventDefault();
      const preventKeys = (event: KeyboardEvent) => {
        if (BLOCKED_KEYS.has(event.key)) event.preventDefault();
      };
      const pin = () => {
        if (window.scrollY !== y) window.scrollTo(0, y);
      };

      window.addEventListener("wheel", prevent, { passive: false });
      window.addEventListener("touchmove", prevent, { passive: false });
      window.addEventListener("keydown", preventKeys);
      window.addEventListener("scroll", pin, { passive: true });

      releaseLock = () => {
        window.removeEventListener("wheel", prevent);
        window.removeEventListener("touchmove", prevent);
        window.removeEventListener("keydown", preventKeys);
        window.removeEventListener("scroll", pin);
        releaseLock = null;
      };

      timer = window.setTimeout(() => releaseLock?.(), durationMs);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || fired) return;
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          fired = true;
          observer.disconnect();
          lock();
        }
      },
      { threshold: [threshold] },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      releaseLock?.();
    };
  }, [ref, enabled, durationMs, threshold]);
}
