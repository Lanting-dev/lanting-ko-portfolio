"use client";

import { useEffect, useRef, useState } from "react";
import { FooterMeta } from "@/components/footer/FooterMeta";
import { FooterSandGarden } from "@/components/footer/FooterSandGarden";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Footer plays the homepage scrub when it scrolls in: the sand reveals (0→0.18)
 *  We skip the pile build-up entirely and start at the impact/drop (0.52), then
 *  run the post-impact drift (0.52→0.88) so the sand drops and scatters apart
 *  into the loose, jagged heap from the first frame — no hill grows in. The
 *  flower blooms on top afterwards. Drift only applies when ambientNoise is off
 *  (see FooterSandGarden). */
const DROP_START = 0.52;
const SETTLE_TARGET = 0.9;
const SETTLE_MS = 1400;

export function CaseStudyFooter() {
  const sandEntryRef = useRef<HTMLDivElement>(null);
  const sandImpactRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(DROP_START);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (reducedMotion) {
      setProgress(SETTLE_TARGET);
      return;
    }

    let raf = 0;
    let start = 0;
    let active = false;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / SETTLE_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(DROP_START + eased * (SETTLE_TARGET - DROP_START));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (active) return;
          active = true;
          start = 0;
          raf = requestAnimationFrame(tick);
        } else {
          // Reset to the drop so the scatter replays next time it scrolls in.
          active = false;
          cancelAnimationFrame(raf);
          setProgress(DROP_START);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <div className="case-study-footer" ref={rootRef}>
      <footer className="site-footer page-shell" aria-label="Site footer">
        <FooterSandGarden
          footerProgress={progress}
          sandEntryRef={sandEntryRef}
          sandImpactRef={sandImpactRef}
          bloom
        />
      </footer>
      <FooterMeta />
    </div>
  );
}
