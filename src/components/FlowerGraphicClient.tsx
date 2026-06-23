"use client";

import { FLOWER_ASSET } from "@/lib/assets";

type FlowerGraphicClientProps = {
  className?: string;
};

export function FlowerGraphicClient({ className }: FlowerGraphicClientProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={FLOWER_ASSET}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`flower-graphic ${className ?? ""}`}
    />
  );
}
