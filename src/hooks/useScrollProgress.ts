"use client";

import { useEffect, useState, type RefObject } from "react";
import { clamp } from "@/lib/parallax/interpolate";

export function useScrollProgress(
  trackRef: RefObject<HTMLElement | null>,
  /**
   * Pixels of "lead": progress starts this many px before the track top reaches
   * the viewport top. Used so a sticky child that pins early (e.g. at `top: gap`)
   * maps to progress > 0 the moment it is on screen.
   */
  leadPx = 0,
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const scrollable = track.offsetHeight - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = clamp(leadPx - rect.top, 0, scrollable);
      setProgress(scrolled / scrollable);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [trackRef, leadPx]);

  return progress;
}
