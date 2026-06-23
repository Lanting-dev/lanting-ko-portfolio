/** Shared bilinear-nearest sample from ImageData into draw rect. */
export function sampleSourceRgb(
  src: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  localX: number,
  localY: number,
  drawWidth: number,
  drawHeight: number,
): [number, number, number, number] {
  if (
    localX < 0 ||
    localY < 0 ||
    localX >= drawWidth ||
    localY >= drawHeight
  ) {
    return [0, 0, 0, 0];
  }

  const u = drawWidth > 0 ? localX / drawWidth : 0;
  const v = drawHeight > 0 ? localY / drawHeight : 0;
  const sx = Math.min(srcW - 1, Math.max(0, Math.floor(u * srcW)));
  const sy = Math.min(srcH - 1, Math.max(0, Math.floor(v * srcH)));
  const si = (sy * srcW + sx) * 4;
  return [src[si] ?? 0, src[si + 1] ?? 0, src[si + 2] ?? 0, src[si + 3] ?? 255];
}

/** Map canvas pixel to source-local coords inside fitted draw rect. */
export function canvasToLocal(
  px: number,
  py: number,
  offsetX: number,
  offsetY: number,
): { localX: number; localY: number } {
  return { localX: px - offsetX, localY: py - offsetY };
}

export function computeImageFit(
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
  fit: "cover" | "contain",
): { drawWidth: number; drawHeight: number; offsetX: number; offsetY: number } {
  const srcAspect = srcW / srcH;
  const dstAspect = dstW / dstH;

  if (fit === "contain") {
    if (srcAspect > dstAspect) {
      const drawWidth = dstW;
      const drawHeight = dstW / srcAspect;
      return { drawWidth, drawHeight, offsetX: 0, offsetY: (dstH - drawHeight) / 2 };
    }
    const drawHeight = dstH;
    const drawWidth = dstH * srcAspect;
    return { drawWidth, drawHeight, offsetX: (dstW - drawWidth) / 2, offsetY: 0 };
  }

  if (srcAspect > dstAspect) {
    const drawHeight = dstH;
    const drawWidth = dstH * srcAspect;
    return { drawWidth, drawHeight, offsetX: (dstW - drawWidth) / 2, offsetY: 0 };
  }

  const drawWidth = dstW;
  const drawHeight = dstW / srcAspect;
  return { drawWidth, drawHeight, offsetX: 0, offsetY: (dstH - drawHeight) / 2 };
}
