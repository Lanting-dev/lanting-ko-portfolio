import * as THREE from "three";
import { ZH_TW_FONT_FAMILY } from "@/lib/i18n/fonts";

const SEGMENT_REPEAT = 5;

export function createPanterRibbonTexture(text: string): THREE.CanvasTexture {
  const segment = `${text}  ·  `;
  const line = segment.repeat(SEGMENT_REPEAT);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }

  const fontSize = 108;
  const font = `800 ${fontSize}px ${ZH_TW_FONT_FAMILY}, Sora, system-ui, sans-serif`;
  ctx.font = font;
  const textWidth = ctx.measureText(line).width;
  const padX = 72;
  const width = Math.ceil(textWidth + padX * 2);
  const height = 260;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, 16);
  ctx.fillRect(0, height - 16, width, 16);

  ctx.fillStyle = "#000000";
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(line, padX, height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(2.8, 1);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  return texture;
}
