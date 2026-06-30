"use client";

import { FlowerGraphicClient } from "./FlowerGraphicClient";

export function HeroClient() {
  return (
    <section className="relative flex flex-1 flex-col items-center justify-center overflow-visible py-6 md:py-10">
      <div className="relative w-full overflow-visible text-center">
        <h1
          className="type-display type-display-hero mx-auto w-fit max-w-full text-center text-black"
          aria-label="Lanting Ko"
        >
          <span className="relative block leading-none">
            LANTING
            <span
              className="pointer-events-none absolute z-10 [isolation:isolate]"
              style={{
                width: "var(--figma-flower-size)",
                height: "var(--figma-flower-size)",
                left: "2.28em",
                top: "0.34em",
                transform: "translate(-50%, -50%)",
              }}
              aria-hidden="true"
            >
              <FlowerGraphicClient className="h-full w-full" />
            </span>
          </span>
          <span className="block leading-none">KO</span>
        </h1>
      </div>
    </section>
  );
}
