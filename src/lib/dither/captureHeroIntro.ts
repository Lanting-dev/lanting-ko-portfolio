import { toCanvas } from "html-to-image";
import { FLOWER_ASSET } from "@/lib/assets";

const MAX_CAPTURE_PIXELS = 480_000;

function captureScale(width: number, height: number): number {
  const pixels = width * height;
  if (pixels <= MAX_CAPTURE_PIXELS) return 1;
  return Math.sqrt(MAX_CAPTURE_PIXELS / pixels);
}

/** Rasterize a DOM subtree (hero viewport) into ImageData for intro dither. */
export async function captureHeroIntro(
  element: HTMLElement,
): Promise<ImageData | null> {
  const rect = element.getBoundingClientRect();
  const cssW = Math.max(1, Math.round(rect.width));
  const cssH = Math.max(1, Math.round(rect.height));
  const scale = captureScale(cssW, cssH);
  const w = Math.max(1, Math.round(cssW * scale));
  const h = Math.max(1, Math.round(cssH * scale));

  try {
    const canvas = await toCanvas(element, {
      width: w,
      height: h,
      pixelRatio: 1,
      cacheBust: true,
      backgroundColor: "#ffffff",
      skipAutoScale: true,
      // Fonts are already loaded via document.fonts — avoid reading cross-origin
      // stylesheets (Google Fonts / next/font) which throws SecurityError.
      skipFonts: true,
    });

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch {
    return null;
  }
}

/** Wait until the hero capture subtree has measurable layout. */
export async function waitForIntroCaptureTarget(
  getElement: () => HTMLElement | null,
  maxWaitMs = 5000,
): Promise<HTMLElement | null> {
  const deadline = performance.now() + maxWaitMs;

  while (performance.now() < deadline) {
    const el = getElement();
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width >= 120 && rect.height >= 120) {
        return el;
      }
    }
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }

  return getElement();
}

/** Wait for fonts, flower asset + layout before capturing intro. */
export async function waitForIntroCaptureReady(): Promise<void> {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready;
  }

  await new Promise<void>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = FLOWER_ASSET;
  });

  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}
