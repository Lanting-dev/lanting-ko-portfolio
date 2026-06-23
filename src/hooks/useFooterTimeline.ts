"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MutableRefObject } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  FOOTER_ANIM_MS,
  getFooterTimelineValues,
  type FooterTimelineValues,
} from "@/lib/footer/footerTimeline";

const RESTING: FooterTimelineValues = {
  t: 0,
  sandProgress: 0,
  sandDrift: 0,
  ballFall: 0,
  ballBouncePx: 0,
  ballSquash: 0,
  copyOpacity: 0,
};

const COMPLETE: FooterTimelineValues = {
  t: 1,
  sandProgress: 1,
  sandDrift: 0,
  ballFall: 1,
  ballBouncePx: 0,
  ballSquash: 0,
  copyOpacity: 1,
};

function resetRefs(
  sandProgressRef: MutableRefObject<number>,
  sandDriftRef: MutableRefObject<number>,
) {
  sandProgressRef.current = 0;
  sandDriftRef.current = 0;
}

export function useFooterTimeline(active: boolean) {
  const reducedMotion = usePrefersReducedMotion();
  const sandProgressRef = useRef(0);
  const sandDriftRef = useRef(0);
  const [values, setValues] = useState<FooterTimelineValues>(
    reducedMotion ? COMPLETE : RESTING,
  );
  const startedRef = useRef(false);

  useLayoutEffect(() => {
    if (reducedMotion) {
      sandProgressRef.current = 1;
      sandDriftRef.current = 0;
      setValues(COMPLETE);
      return;
    }

    if (!active) {
      startedRef.current = false;
      resetRefs(sandProgressRef, sandDriftRef);
      setValues(RESTING);
    }
  }, [active, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !active) return;

    if (!startedRef.current) {
      resetRefs(sandProgressRef, sandDriftRef);
      setValues(RESTING);
      startedRef.current = true;
    }

    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / FOOTER_ANIM_MS);
      const next = getFooterTimelineValues(t);
      sandProgressRef.current = next.sandProgress;
      sandDriftRef.current = next.sandDrift;
      setValues(next);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reducedMotion]);

  return { sandProgressRef, sandDriftRef, values };
}
