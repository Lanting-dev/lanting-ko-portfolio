"use client";

import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { BIGWORD_PERSPECTIVE } from "@/lib/animation/sectionBigWordReveal";

type BigWordPrismProps = {
  /** Eased 0 → 1, used only to fade the word in. Rotation is a continuous auto-spin. */
  reveal: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Fade opacity with the reveal. Disable when a parent already controls opacity. */
  fade?: boolean;
};

const FACES = [
  { key: "front", rotate: 0, side: false },
  { key: "top", rotate: 90, side: true },
  { key: "back", rotate: 180, side: true },
  { key: "bottom", rotate: -90, side: true },
] as const;

/**
 * A section big word rendered as a four-face box (prism) that auto-tumbles
 * around the X axis. The four faces each carry the same word; depth is half the
 * word height, keeping the front↔back cross-section square so it reads as a
 * solid block flipping top-over-bottom.
 */
export const BigWordPrism = forwardRef<HTMLHeadingElement, BigWordPrismProps>(
  function BigWordPrism(
    { reveal, children, className = "", style, fade = true },
    ref,
  ) {
    const headingRef = useRef<HTMLHeadingElement>(null);
    useImperativeHandle(ref, () => headingRef.current as HTMLHeadingElement);
    const frontRef = useRef<HTMLSpanElement>(null);
    const [depth, setDepth] = useState(0);

    useLayoutEffect(() => {
      const front = frontRef.current;
      if (!front) return;
      // offsetHeight is layout-based and ignores the 3D transforms. Half the
      // word height keeps the front↔back depth square for the X-axis tumble.
      const measure = () => setDepth(front.offsetHeight / 2);
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(front);
      return () => ro.disconnect();
    }, []);

    return (
      <h2
        ref={headingRef}
        className={`section-bigword bigword-prism ${className}`.trim()}
        style={{
          perspective: `${BIGWORD_PERSPECTIVE}px`,
          // Fade on the perspective container, NOT the rotor: opacity < 1 on a
          // preserve-3d element flattens its 3D space and kills the prism.
          opacity: fade ? Math.max(0, Math.min(1, reveal)) : undefined,
          ...style,
        }}
      >
        <span
          className="bigword-rotor"
          style={
            {
              // Depth feeds the CSS spin keyframes; the static transform is the
              // reduced-motion fallback (animation overrides it while running).
              "--bigword-depth": `${depth}px`,
              transform: `translateZ(${-depth}px)`,
            } as CSSProperties
          }
        >
          {FACES.map((face) => (
            <span
              key={face.key}
              ref={face.key === "front" ? frontRef : undefined}
              aria-hidden={face.key === "front" ? undefined : true}
              className={`bigword-face${face.side ? " bigword-face--side" : ""}`}
              style={{
                transform: `rotateX(${face.rotate}deg) translateZ(${depth}px)`,
              }}
            >
              {children}
            </span>
          ))}
        </span>
      </h2>
    );
  },
);
