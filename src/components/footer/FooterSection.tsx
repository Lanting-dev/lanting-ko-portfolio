"use client";

import type { RefObject } from "react";
import { useParallaxValue } from "@/components/parallax/ParallaxEngineProvider";
import { useScrollTrackVh } from "@/hooks/useScrollTrackVh";
import { FooterMeta } from "./FooterMeta";
import { FooterSandGarden } from "./FooterSandGarden";

type FooterSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
  /** Static stack for reduced-motion — no scroll pin. */
  staticLayout?: boolean;
};

export function FooterSection({
  trackRef,
  staticLayout = false,
}: FooterSectionProps) {
  const footerProgress = useParallaxValue((s) => s.footerProgress, (a, b) =>
  Math.abs(a - b) < 0.002 ? true : a === b,
  );
  const footerTrackVh = useScrollTrackVh("footer");

  const sandProgress = staticLayout ? 1 : footerProgress;

  const content = (
    <>
      <FooterSandGarden footerProgress={sandProgress} bloom />
      <FooterMeta />
    </>
  );

  if (staticLayout) {
    return (
      <footer className="site-footer" aria-label="Site footer">
        {content}
      </footer>
    );
  }

  return (
    <footer
      ref={trackRef}
      className="site-footer footer-scroll-pin"
      style={{ height: `${footerTrackVh}vh` }}
      aria-label="Site footer"
    >
      <div className="footer-scroll-sticky">{content}</div>
    </footer>
  );
}
