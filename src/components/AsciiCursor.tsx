"use client";

import { useEffect, useRef } from "react";

/** The cursor arrow drawn in ASCII. Tip is the top-left glyph (the hotspot). */
const ARROW = [
  "#",
  "##",
  "#=#",
  "#==#",
  "#===#",
  "#====#",
  "#=====#",
  "#===##",
  "#=# =#",
  "##  =#",
  "#    =#",
  "     ##",
].join("\n");

/** Pointing hand shown over clickable elements. Fingertip near the top. */
const HAND = [
  "  ##",
  "  #=#",
  "  #=#",
  "  #=#",
  "##=#=#",
  "#==#=#=#",
  "#=======#",
  "#=======#",
  " #======#",
  " #======#",
  "  #=====#",
].join("\n");

/** Elements that should show the hand cursor. */
const CLICKABLE =
  'a[href], button, [role="button"], input, textarea, select, label, summary, .site-cta';

/**
 * ASCII arrow cursor , a single monospace glyph-shape that tracks the pointer
 * 1:1 (tip at the hotspot), replacing the native cursor. Difference-blended so
 * it reads on any background. Disabled on coarse pointers. No re-renders.
 */
export function AsciiCursor() {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;

    document.documentElement.classList.add("ascii-cursor-on");

    let x = -100;
    let y = -100;
    let hand = false;
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as Element | null;
      const overClickable = !!target?.closest?.(CLICKABLE);
      if (overClickable !== hand) {
        hand = overClickable;
        el.textContent = hand ? HAND : ARROW;
        el.classList.toggle("is-hand", hand);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("ascii-cursor-on");
    };
  }, []);

  return (
    <pre ref={ref} className="ascii-cursor" aria-hidden="true">
      {ARROW}
    </pre>
  );
}
