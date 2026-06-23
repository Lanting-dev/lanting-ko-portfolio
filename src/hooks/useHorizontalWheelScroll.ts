"use client";

import { useEffect, type RefObject } from "react";

/**
 * When the project section is in view, map vertical wheel → horizontal scroll.
 * Trackpad horizontal delta is passed through as-is.
 */
export function useHorizontalWheelScroll(
  trackRef: RefObject<HTMLElement | null>,
  sectionRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const onWheel = (event: WheelEvent) => {
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;

      const rect = section.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.92 &&
        rect.bottom > window.innerHeight * 0.08;

      if (!inView) return;

      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      if (Math.abs(delta) < 0.5) return;

      const atStart = track.scrollLeft <= 0;
      const atEnd = track.scrollLeft >= max - 1;

      if (delta > 0 && atEnd) return;
      if (delta < 0 && atStart) return;

      event.preventDefault();
      track.scrollLeft += delta;
    };

    section.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      section.removeEventListener("wheel", onWheel);
    };
  }, [trackRef, sectionRef]);
}
