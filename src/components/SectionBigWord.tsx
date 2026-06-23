"use client";

import { sectionBigWordRevealStyle } from "@/lib/animation/sectionBigWordReveal";
import type { CSSProperties, ReactNode } from "react";

type SectionBigWordProps = {
  progress: number;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
};

/** Shared scroll-scrubbed reveal for section display words ("Work", "About"). */
export function SectionBigWord({
  progress,
  className = "",
  children,
  style,
}: SectionBigWordProps) {
  return (
    <h2
      className={`section-bigword ${className}`.trim()}
      style={{ ...sectionBigWordRevealStyle(progress), ...style }}
    >
      {children}
    </h2>
  );
}
