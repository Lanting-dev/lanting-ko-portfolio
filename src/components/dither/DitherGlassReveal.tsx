"use client";

import { useEffect, useRef, useState } from "react";
import { CrossStitchScatterCanvas } from "./CrossStitchScatterCanvas";

type DitherGlassRevealProps = {
  src: string;
  alt: string;
  /** Ball impact — cross-stitch drifts away as sharp image fades in. */
  active: boolean;
  onComplete?: () => void;
  className?: string;
  seed?: number;
};

const CARD_DRIFT_MS = 460;
/** Brief sand snap on ball hit, then sharp. */
const CARD_SHARP_DELAY = 0.2;

function mapSharpOpacity(driftProgress: number, sharpDelay: number): number {
  if (driftProgress <= sharpDelay) return 0;
  const t = (driftProgress - sharpDelay) / (1 - sharpDelay);
  return t * t * (3 - 2 * t);
}

type RevealPhase = "stitch" | "fadeSharp" | "sharp";

export function DitherGlassReveal({
  src,
  alt,
  active,
  onComplete,
  className,
  seed = 17,
}: DitherGlassRevealProps) {
  const progressRef = useRef(1);
  const driftRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const [phase, setPhase] = useState<RevealPhase>(active ? "sharp" : "stitch");
  const [sharpOpacity, setSharpOpacity] = useState(active ? 1 : 0);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (active && phase === "stitch") {
      setPhase("fadeSharp");
    }
  }, [active, phase]);

  useEffect(() => {
    if (phase !== "fadeSharp") return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / CARD_DRIFT_MS);
      driftRef.current = t;
      setSharpOpacity(mapSharpOpacity(t, CARD_SHARP_DELAY));

      if (t < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }

      driftRef.current = 1;
      setSharpOpacity(1);
      setPhase("sharp");
      onCompleteRef.current?.();
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  if (phase === "sharp") {
    return (
      <div className={`relative z-10 h-full w-full ${className ?? ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="relative z-10 h-full w-full object-contain"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className={`relative z-10 h-full w-full ${className ?? ""}`}>
      <CrossStitchScatterCanvas
        src={src}
        progressRef={progressRef}
        driftRef={driftRef}
        shuffleSeed={seed}
        fit="contain"
        useCardStitchLayout
        alt={alt}
        className="h-full w-full"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full object-contain"
        style={{ opacity: phase === "fadeSharp" ? sharpOpacity : 0 }}
        draggable={false}
      />
    </div>
  );
}
