"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { FooterMeta } from "./FooterMeta";
import { FooterSandGarden } from "./FooterSandGarden";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { FOOTER_SCROLL_VH } from "@/lib/footer/footerScroll";

/** Time-based replay of the sand assemble + scatter, in footerProgress units. */
const REPLAY_MS = 1600;

type FooterSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
  footerProgress?: number;
  sandImpactRef: RefObject<HTMLDivElement | null>;
  sandEntryRef: RefObject<HTMLDivElement | null>;
  staticLayout?: boolean;
};

export function FooterSection({
  trackRef,
  footerProgress = 0,
  sandImpactRef,
  sandEntryRef,
  staticLayout = false,
}: FooterSectionProps) {
  const reducedMotion = usePrefersReducedMotion();
  const staticFooter = staticLayout || reducedMotion;

  const stickyRef = useRef<HTMLElement>(null);
  const enteredRef = useRef(false);
  const hasLeftRef = useRef(false);
  const [replay, setReplay] = useState<number | null>(null);

  useEffect(() => {
    if (staticFooter) return;
    const el = stickyRef.current;
    if (!el) return;

    let raf = 0;
    let startT = 0;
    let active = false;

    const tick = (now: number) => {
      if (!startT) startT = now;
      const t = Math.min(1, (now - startT) / REPLAY_MS);
      // Ease the full assemble → scatter sequence from the first frame.
      setReplay(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          enteredRef.current = true;
          // First time through keeps the scroll-scrubbed pinball hand-off.
          if (!hasLeftRef.current || active) return;
          active = true;
          startT = 0;
          raf = requestAnimationFrame(tick);
        } else {
          if (enteredRef.current) hasLeftRef.current = true;
          active = false;
          cancelAnimationFrame(raf);
          setReplay(null);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [staticFooter]);

  const sand = (
    <FooterSandGarden
      footerProgress={replay ?? footerProgress}
      sandImpactRef={sandImpactRef}
      sandEntryRef={sandEntryRef}
    />
  );

  if (staticFooter) {
    return (
      <footer className="site-footer page-shell" aria-label="Site footer">
        {sand}
        <FooterMeta />
      </footer>
    );
  }

  return (
    <>
      <section
        ref={trackRef}
        className="footer-scroll-pin relative w-full bg-white"
        style={{ height: `${FOOTER_SCROLL_VH}vh` }}
        aria-label="Footer animation"
      >
        <footer
          ref={stickyRef}
          className="footer-scroll-sticky site-footer page-shell"
        >
          {sand}
        </footer>
      </section>
      <FooterMeta />
    </>
  );
}
