"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  captureHeroIntro,
  waitForIntroCaptureReady,
  waitForIntroCaptureTarget,
} from "@/lib/dither/captureHeroIntro";
import { CrossStitchScatterCanvas } from "./CrossStitchScatterCanvas";

type IntroCrossStitchCanvasProps = {
  captureRef: RefObject<HTMLElement | null>;
  progressRef: RefObject<number>;
  driftRef?: RefObject<number>;
  onCaptureReady?: () => void;
};

export function IntroCrossStitchCanvas({
  captureRef,
  progressRef,
  driftRef,
  onCaptureReady,
}: IntroCrossStitchCanvasProps) {
  const [sourceImage, setSourceImage] = useState<ImageData | null>(null);
  const capturedRef = useRef(false);
  const onCaptureReadyRef = useRef(onCaptureReady);

  useEffect(() => {
    onCaptureReadyRef.current = onCaptureReady;
  }, [onCaptureReady]);

  useEffect(() => {
    if (capturedRef.current) return;
    let cancelled = false;

    (async () => {
      await waitForIntroCaptureReady();
      if (cancelled) return;

      const el = await waitForIntroCaptureTarget(() => captureRef.current);
      if (cancelled || !el) return;

      let data: ImageData | null = null;
      for (let attempt = 0; attempt < 4; attempt += 1) {
        if (cancelled) return;
        data = await captureHeroIntro(el);
        if (data) break;
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 120 * (attempt + 1));
        });
      }

      if (cancelled || !data) return;

      capturedRef.current = true;
      setSourceImage(data);
      onCaptureReadyRef.current?.();
    })();

    return () => {
      cancelled = true;
    };
  }, [captureRef]);

  return (
    <CrossStitchScatterCanvas
      sourceImage={sourceImage}
      progressRef={progressRef}
      fit="cover"
      useIntroLayout
      revealByCell
      driftRef={driftRef}
      alt="Intro cross stitch"
      className="h-full w-full"
    />
  );
}
