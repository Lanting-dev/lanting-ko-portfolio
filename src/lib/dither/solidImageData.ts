export function createSolidImageData(
  r: number,
  g: number,
  b: number,
  a = 255,
): ImageData {
  const image = new ImageData(1, 1);
  image.data[0] = r;
  image.data[1] = g;
  image.data[2] = b;
  image.data[3] = a;
  return image;
}
