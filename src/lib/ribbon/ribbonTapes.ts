export type RibbonTapeSlot = "a" | "b";

export type RibbonTapeTextKey = "label" | "tagline";

/** Ribbon copy — English only, independent of site locale toggle. */
export const HERO_RIBBON_TAPE_LABEL = "I PLAN · I RESEARCH · I DESIGN · ";

export const HERO_RIBBON_TAPE_TAGLINE = "FOR SEAMLESS DAILY EXPERIENCES · ";

export const HERO_RIBBON_ARIA =
  "I plan, I research, I design — for seamless daily experiences";

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

/** Two parallel marquee bands — upper / lower, opposite drift. */
export const RIBBON_TAPES: RibbonTapeConfig[] = [
  { slot: "a", variant: "dark", textKey: "label", drift: 28, repeat: 4 },
  { slot: "b", variant: "light", textKey: "tagline", drift: -28, repeat: 4 },
];
