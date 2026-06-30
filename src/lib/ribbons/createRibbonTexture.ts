import * as THREE from "three";

type RibbonTextureOptions = {
  text: string;
  background: string;
  foreground: string;
  repeatAlong?: number;
  edgeBars?: boolean;
};

const SEGMENT_REPEAT = 6;

export function createRibbonTexture({
  text,
  background,
  foreground,
  repeatAlong = 2,
  edgeBars = false,
}: RibbonTextureOptions): THREE.CanvasTexture {
  const segment = `${text} `;
  const line = segment.repeat(SEGMENT_REPEAT);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }

  const fontSize = 96;
  const font = `800 ${fontSize}px Sora, system-ui, sans-serif`;
  ctx.font = font;
  const textWidth = ctx.measureText(line).width;
  const padX = 64;
  const width = Math.ceil(textWidth + padX * 2);
  const height = 200;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  if (edgeBars) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, 8);
    ctx.fillRect(0, height - 8, width, 8);
  }

  ctx.fillStyle = foreground;
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(line, padX, height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(repeatAlong, 1);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  return texture;
}

export function ribbonMaterialPair(
  label: string,
  tagline: string,
): {
  dark: (repeat: number) => THREE.CanvasTexture;
  light: (repeat: number) => THREE.CanvasTexture;
} {
  return {
    dark: (repeat) =>
      createRibbonTexture({
        text: label,
        background: "#000000",
        foreground: "#ffffff",
        repeatAlong: repeat,
      }),
    light: (repeat) =>
      createRibbonTexture({
        text: tagline,
        background: "#ffffff",
        foreground: "#000000",
        repeatAlong: repeat,
        edgeBars: true,
      }),
  };
}
