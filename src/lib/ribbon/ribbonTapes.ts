export type RibbonTapeSlot = "a" | "b";

export type RibbonTapeTextKey = "label" | "tagline";

/** Ribbon copy — English only, independent of site locale toggle. */
export const HERO_RIBBON_TAPE_LABEL = "PRODUCT DESIGNER · ";

export const HERO_RIBBON_TAPE_TAGLINE = "STRUCTURE · FUNCTION · VISUAL CRAFT · ";

export const HERO_RIBBON_ARIA =
  "Product Designer — Structure, Function, and Visual Craft";

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
};

/** Two-band cross — one clean X, less visual noise. */
export const RIBBON_TAPES: RibbonTapeConfig[] = [
  { slot: "a", variant: "dark", textKey: "label", drift: 28 },
  { slot: "b", variant: "light", textKey: "tagline", drift: -28 },
];
