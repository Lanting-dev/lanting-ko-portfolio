"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import {
  trackVhForViewport,
  type ScrollSection,
} from "@/lib/scroll/rhythmSpec";

export function useScrollTrackVh(section: ScrollSection): number {
  const isMobile = useIsMobile();
  return trackVhForViewport(section, isMobile);
}
