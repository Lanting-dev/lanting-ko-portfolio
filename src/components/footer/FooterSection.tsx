"use client";

import type { RefObject } from "react";
import { FooterFlipName } from "./FooterFlipName";
import { FooterMeta } from "./FooterMeta";

type FooterSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
  /** Kept for API parity with the reduced-motion stack. The footer no longer
   *  pins a tall scroll track , it just sizes to the flip board + meta. */
  staticLayout?: boolean;
};

export function FooterSection({ trackRef }: FooterSectionProps) {
  return (
    <footer
      ref={trackRef}
      className="site-footer"
      aria-label="Site footer"
    >
      <FooterFlipName />
      <FooterMeta />
    </footer>
  );
}
