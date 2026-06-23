function hash2(x: number, y: number): number {
  let n = x * 374761393 + y * 668265263;
  n = (n ^ (n >> 13)) >>> 0;
  return n & 255;
}

/** Grey cross-stitch source mask — dome sand pile with a ball nest at center. */
export function createSandPileRaster(width: number, height: number): ImageData {
  const image = new ImageData(width, height);
  const data = image.data;

  const cx = width * 0.5;
  const floorY = height - 1;
  const peakY = height * 0.38;
  const halfWidth = width * 0.5;
  const nestCx = cx;
  const nestCy = height * 0.54;
  const nestR = Math.max(6, width * 0.055);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const nx = (x - cx) / halfWidth;
      const dome =
        floorY - (floorY - peakY) * Math.max(0, 1 - nx * nx * 0.92);

      const distNest = Math.hypot(x - nestCx, y - nestCy);
      let surface = dome;
      if (distNest < nestR * 2.8) {
        const dip = (1 - distNest / (nestR * 2.8)) * nestR * 0.42;
        surface += dip;
      }

      const grain = (hash2(x, y) & 7) * 0.35;
      if (y < surface - grain) continue;

      const idx = (y * width + x) * 4;
      const shade = 112 + (hash2(x * 5 + 11, y * 3 + 7) & 31);
      data[idx] = shade;
      data[idx + 1] = shade;
      data[idx + 2] = shade;
      data[idx + 3] = 255;
    }
  }

  return image;
}
