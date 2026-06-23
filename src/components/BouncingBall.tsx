"use client";

import { BALL_ASSET } from "@/lib/assets";

type BouncingBallProps = {
  className?: string;
};

/** Static ball — motion is driven by scroll via FloatingOrb until settled */
export function BouncingBall({ className }: BouncingBallProps) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={BALL_ASSET}
      alt=""
      className={["parallax-scroll-ball h-full w-full object-contain", className ?? ""]
        .filter(Boolean)
        .join(" ")}
      draggable={false}
    />
  );
}
