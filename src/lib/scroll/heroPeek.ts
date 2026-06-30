import { HERO_PEEK_VH, HERO_STICKY_VH } from "@/lib/scroll/rhythmSpec";

/** Pull the ribbon section up so it sits in the hero peek band (below 80vh). */
export function heroRibbonOverlapVh(heroTrackVh: number): number {
  return Math.max(0, heroTrackVh - HERO_STICKY_VH);
}

export { HERO_PEEK_VH, HERO_STICKY_VH };
