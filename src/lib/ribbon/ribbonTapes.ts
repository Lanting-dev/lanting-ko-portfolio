export type RibbonTapeSlot = "a" | "b";

export type RibbonTapeTextKey = "label" | "tagline";

/** Ribbon copy — English only, independent of site locale toggle. */
export const HERO_RIBBON_TAPE_LABEL = "PRODUCT DESIGNER · ";

export const HERO_RIBBON_TAPE_TAGLINE = "WHAT KIND OF DESIGNER AM I? · ";

export const HERO_RIBBON_ARIA =
  "Product Designer — What kind of designer am I?";

export function heroRibbonTapeText(key: RibbonTapeTextKey): string {
  switch (key) {
    case "label":
      return HERO_RIBBON_TAPE_LABEL;
    case "tagline":
      return HERO_RIBBON_TAPE_TAGLINE;
  }
}

export type RibbonTapeConfig = {
  slot: RibbonTapeSlot;
  variant: "dark" | "light";
  textKey: RibbonTapeTextKey;
  /** Marquee duration seconds; negative = reverse. */
  drift: number;
  /** Label repeats per marquee segment (longer copy needs more). */
  repeat?: number;
};

/** Two-band cross — one clean X, less visual noise. */
export const RIBBON_TAPES: RibbonTapeConfig[] = [
  { slot: "a", variant: "dark", textKey: "label", drift: 28 },
  { slot: "b", variant: "light", textKey: "tagline", drift: -28, repeat: 5 },
];
