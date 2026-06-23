/** Grey thread tones for cross-stitch — matches FooterSandBloom flower sampling. */
export function greyscaleImageData(source: ImageData): ImageData {
  const { width, height, data: src } = source;
  const out = new ImageData(width, height);
  const dst = out.data;

  for (let i = 0; i < src.length; i += 4) {
    const a = src[i + 3]!;
    dst[i + 3] = a;
    if (a < 8) {
      dst[i] = 0;
      dst[i + 1] = 0;
      dst[i + 2] = 0;
      continue;
    }
    const lum = (src[i]! + src[i + 1]! + src[i + 2]!) / 3;
    const shade = Math.round(Math.min(205, lum * 0.8));
    dst[i] = shade;
    dst[i + 1] = shade;
    dst[i + 2] = shade;
  }

  return out;
}
