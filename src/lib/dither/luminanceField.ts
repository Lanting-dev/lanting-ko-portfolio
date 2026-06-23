import { heckelLuminance } from "./heckelDither";

export type ImageLuminanceSource = {
  data: ImageData;
  offsetX: number;
  offsetY: number;
  drawWidth: number;
  drawHeight: number;
};

export function sampleImageLuminance(
  gx: number,
  gy: number,
  pixelSize: number,
  source: ImageLuminanceSource,
): number {
  const px = gx * pixelSize;
  const py = gy * pixelSize;
  const localX = px - source.offsetX;
  const localY = py - source.offsetY;

  if (
    localX < 0 ||
    localY < 0 ||
    localX >= source.drawWidth ||
    localY >= source.drawHeight
  ) {
    return 0;
  }

  const u = localX / source.drawWidth;
  const v = localY / source.drawHeight;
  const sx = Math.min(
    source.data.width - 1,
    Math.max(0, Math.floor(u * source.data.width)),
  );
  const sy = Math.min(
    source.data.height - 1,
    Math.max(0, Math.floor(v * source.data.height)),
  );
  const i = (sy * source.data.width + sx) * 4;
  const d = source.data.data;
  return heckelLuminance(d[i] ?? 0, d[i + 1] ?? 0, d[i + 2] ?? 0);
}
