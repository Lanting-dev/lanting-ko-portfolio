import type { CSSProperties } from "react";
import type { RibbonTapeSlot } from "@/lib/ribbon/ribbonTapes";

type KineticRibbonProps = {
  label: string;
  variant: "dark" | "light";
  slot: RibbonTapeSlot;
  drift: number;
  repeat?: number;
};

const DEFAULT_REPEAT_COUNT = 3;

export function KineticRibbon({
  label,
  variant,
  slot,
  drift,
  repeat = DEFAULT_REPEAT_COUNT,
}: KineticRibbonProps) {
  const line = label.repeat(repeat);
  const reverse = drift < 0;

  return (
    <div
      className={`kinetic-ribbon kinetic-ribbon--${variant} kinetic-ribbon--${slot}`}
      style={
        {
          ["--ribbon-drift" as string]: `${Math.abs(drift)}s`,
        } as CSSProperties
      }
      data-reverse={reverse ? "true" : undefined}
    >
      <div className="kinetic-ribbon__track">
        <div className="kinetic-ribbon__flow">
          <span className="kinetic-ribbon__line">{line}</span>
          <span className="kinetic-ribbon__line" aria-hidden="true">
            {line}
          </span>
        </div>
      </div>
    </div>
  );
}
