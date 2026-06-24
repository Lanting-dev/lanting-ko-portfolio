"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Reference size used to measure the glyph advance, then scaled linearly. */
const REF_FONT_PX = 200;

/**
 * Sizes display text to exactly fill the width of a container.
 *
 * `widthRef` marks the element whose width the text should fill.
 * `fontRef` marks an element that carries the target font (family,
 * letter-spacing, weight) so the hidden measurer inherits it.
 *
 * Returns the computed font-size in px (null until measured). Recomputes on
 * container resize and once the web font finishes loading.
 */
export function useFitText<
  W extends HTMLElement,
  F extends HTMLElement,
>(text: string) {
  const widthRef = useRef<W>(null);
  const fontRef = useRef<F>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const widthEl = widthRef.current;
    const fontEl = fontRef.current;
    if (!widthEl || !fontEl) return;

    const measurer = document.createElement("span");
    measurer.setAttribute("aria-hidden", "true");
    measurer.textContent = text;
    Object.assign(measurer.style, {
      position: "absolute",
      left: "0",
      top: "0",
      visibility: "hidden",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      fontSize: `${REF_FONT_PX}px`,
    });
    const fit = () => {
      const available = widthEl.clientWidth;
      fontEl.appendChild(measurer);
      const natural = measurer.getBoundingClientRect().width;
      measurer.remove();
      if (available > 0 && natural > 0) {
        setFontSize((available / natural) * REF_FONT_PX);
      }
    };

    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(widthEl);

    let cancelled = false;
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) fit();
      });
    }

    return () => {
      cancelled = true;
      observer.disconnect();
      if (measurer.isConnected) measurer.remove();
    };
  }, [text]);

  return { widthRef, fontRef, fontSize };
}
