import type { RefObject } from "react";
import { FooterMeta } from "./FooterMeta";
import { FooterSandGarden } from "./FooterSandGarden";

type FooterSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
  staticLayout?: boolean;
};

export function FooterSection({
  trackRef,
  staticLayout: _staticLayout = false,
}: FooterSectionProps) {
  return (
    <footer
      ref={trackRef}
      className="site-footer"
      aria-label="Site footer"
    >
      <FooterSandGarden footerProgress={0.9} bloom />
      <FooterMeta />
    </footer>
  );
}
