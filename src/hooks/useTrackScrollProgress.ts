"use client";

import { useEffect, type RefObject } from "react";
import { clamp } from "@/lib/parallax/interpolate";

/** Maps a pinned section's scroll position to 0→1 progress. */
export function useTrackScrollProgress(
  trackRef: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
) {
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const track = trackRef.current;
      if (!track) return;

      const vh = window.innerHeight;
      const scrollable = track.offsetHeight - vh;
      const rect = track.getBoundingClientRect();
      const scrolled = clamp(-rect.top, 0, scrollable);
      const progress = scrollable <= 0 ? 1 : scrolled / scrollable;
      onProgress(progress);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [trackRef, onProgress]);
}
