/** Pin track — kinetic ribbons reveal on scroll. */
export const RIBBON_SCROLL_VH = 150;

/** Shorter pin on mobile — less empty scroll before Work. */
export const RIBBON_SCROLL_VH_MOBILE = 108;

/** Visible ribbon sliver at the bottom of the hero viewport (reveal = 0). */
export const RIBBON_HERO_PEEK_VH = 3;

export const RIBBON_HERO_PEEK_VH_MOBILE = 2;

export function ribbonScrollVh(mobile: boolean): number {
  return mobile ? RIBBON_SCROLL_VH_MOBILE : RIBBON_SCROLL_VH;
}

export function ribbonHeroPeekVh(mobile: boolean): number {
  return mobile ? RIBBON_HERO_PEEK_VH_MOBILE : RIBBON_HERO_PEEK_VH;
}
