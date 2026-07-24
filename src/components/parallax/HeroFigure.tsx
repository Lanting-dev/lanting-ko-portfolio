"use client";

import { HERO_HAND_ASCII } from "@/lib/ascii/handAscii";

const PORTRAIT_SRC = "/profile.png";
/** Only the eye band (2) and mouth band (4) are displaced; 1/3/5 stay put so
 *  the rest of the face is clean and the glitch reads as targeting the eyes and
 *  mouth. All heal to aligned as `--hero-glitch` → 0 on scroll. */
const GLITCH_BANDS = [1, 2, 3, 4, 5] as const;

/**
 * Hero figure: the cut-out portrait with the eyes and mouth sliced and shoved
 * sideways (a glitch that heals into a clean image on scroll), framed by two
 * ASCII hands pointing at her face from the left and right. As the hero scrolls
 * the hands push the slices back to centre. Driven by `--hero-glitch`, so this
 * never re-renders.
 */
export function HeroFigure() {
  return (
    <div className="hero-figure" aria-hidden>
      <div className="hero-figure-portrait">
        {GLITCH_BANDS.map((n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={n}
            className={`hero-glitch-band hero-glitch-band--${n}`}
            src={PORTRAIT_SRC}
            alt=""
            draggable={false}
          />
        ))}
      </div>
      <span className="hero-figure-hand hero-figure-hand--left">
        <pre className="hand-ascii hero-hand-ascii">{HERO_HAND_ASCII}</pre>
      </span>
      <span className="hero-figure-hand hero-figure-hand--right">
        <pre className="hand-ascii hero-hand-ascii">{HERO_HAND_ASCII}</pre>
      </span>
    </div>
  );
}
