"use client";

import { useEffect, useState, type RefObject } from "react";
import { clamp } from "@/lib/dither/bayer";

/** scrollLeft / maxScroll for a horizontal overflow container (0→1). */
export function useHorizontalScrollProgress(
  trackRef: RefObject<HTMLElement | null>,
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) {
        setProgress(0);
        return;
      }
      setProgress(clamp(track.scrollLeft / max, 0, 1));
    };

    update();

    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const ro = new ResizeObserver(update);
    ro.observe(track);
    for (const child of track.children) {
      ro.observe(child);
    }

    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [trackRef]);

  return progress;
}
