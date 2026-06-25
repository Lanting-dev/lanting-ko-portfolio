"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useViewportHeight } from "@/hooks/useViewportHeight";
import {
  trackVhForViewport,
  type ScrollSection,
} from "@/lib/scroll/rhythmSpec";

export function useScrollTrackVh(section: ScrollSection): number {
  const isMobile = useIsMobile();
  const viewportHeight = useViewportHeight();
  return trackVhForViewport(section, isMobile, viewportHeight);
}
