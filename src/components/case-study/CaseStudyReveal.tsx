import type { CSSProperties, ReactNode } from "react";

type CaseStudyRevealProps = {
  children: ReactNode;
  className?: string;
  /** Accepted for compatibility; currently unused (animations removed). */
  delay?: number;
  style?: CSSProperties;
  /** Accepted for compatibility; currently unused (animations removed). */
  motion?: "none" | "scale";
};

/** Static passthrough — entrance animations are currently disabled. */
export function CaseStudyReveal({
  children,
  className = "",
  style,
}: CaseStudyRevealProps) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
