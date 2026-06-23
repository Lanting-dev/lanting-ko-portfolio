import type { RefObject } from "react";

export type BallAnchorPoint = { x: number; y: number };

export function readProjectCardTopCenter(
  anchor: HTMLElement | null,
): BallAnchorPoint | null {
  if (!anchor) return null;

  const card = anchor.closest(".project-card");
  const frame = card?.querySelector(".project-card-frame") as HTMLElement | null;
  if (frame) {
    const rect = frame.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top };
  }

  const rect = anchor.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top };
}

/** Right edge of the card frame — ball rolls here before dropping. */
export function readProjectCardRollEdge(
  anchor: HTMLElement | null,
  ballSize: number,
): BallAnchorPoint | null {
  if (!anchor) return null;

  const card = anchor.closest(".project-card");
  const frame = card?.querySelector(".project-card-frame") as HTMLElement | null;
  if (!frame) return null;

  const rect = frame.getBoundingClientRect();
  return {
    x: rect.right - ballSize * 0.1,
    y: rect.top,
  };
}

export function readEstimatedCardRollEdge(
  from: BallAnchorPoint,
  ballSize: number,
): BallAnchorPoint {
  const cardWidth = readCssLength("--project-card-display-width", 520);
  return {
    x: from.x + cardWidth / 2 - ballSize * 0.12,
    y: from.y,
  };
}

export function measureProjectCardSlots(
  slotRefs: RefObject<(HTMLDivElement | null)[]>,
  cardCount: number,
): BallAnchorPoint[] {
  const nodes = slotRefs.current;
  if (!nodes || nodes.length < cardCount) return [];

  const points: BallAnchorPoint[] = [];

  for (let i = 0; i < cardCount; i += 1) {
    const point = readProjectCardTopCenter(nodes[i]);
    if (!point) return [];
    points.push(point);
  }

  return points;
}

export function readProfileFaceRect(
  profileBallSlotRef: RefObject<HTMLElement | null>,
): DOMRect | null {
  const anchor = profileBallSlotRef.current;
  if (!anchor) return null;

  const face = anchor.closest(".about-cube-face--front") as HTMLElement | null;
  if (face) return face.getBoundingClientRect();

  const cubeSize = readCssLength("--about-cube-size", 680);
  const point = anchor.getBoundingClientRect();
  const centerX = point.left + point.width / 2;
  return new DOMRect(
    centerX - cubeSize / 2,
    point.top,
    cubeSize,
    cubeSize,
  );
}

export function readProfileTopCenter(
  profileBallSlotRef: RefObject<HTMLElement | null>,
): BallAnchorPoint | null {
  const anchor = profileBallSlotRef.current;
  if (anchor) {
    const rect = anchor.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  const rect = readProfileFaceRect(profileBallSlotRef);
  if (!rect) return null;
  return { x: rect.left + rect.width / 2, y: rect.top };
}

export function readProfileRightWall(
  profileBallSlotRef: RefObject<HTMLElement | null>,
  ballSize: number,
): BallAnchorPoint | null {
  const rect = readProfileFaceRect(profileBallSlotRef);
  if (!rect) return null;
  return { x: rect.right - ballSize * 0.08, y: rect.top };
}

function readCssLength(varName: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/** Fallback target before the profile cube is measured in the viewport. */
export function readEstimatedProfileTopCenter(
  from?: BallAnchorPoint | null,
): BallAnchorPoint {
  if (typeof window === "undefined") {
    return { x: 720, y: 640 };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const frameMax = Math.min(1440, vw);
  const frameInset = Math.max(0, (vw - frameMax) / 2);
  const cubeSize = readCssLength("--about-cube-size", Math.min(680, vw - 64));

  const x = from?.x
    ? from.x + (frameInset + frameMax / 2 - from.x) * 0.12
    : frameInset + frameMax / 2;
  const y = from
    ? Math.min(
        Math.max(from.y + cubeSize * 0.18, vh * 0.58),
        vh * 0.86,
      )
    : vh * 0.72;

  return { x, y };
}

export function readEstimatedProfileRightWall(
  impact: BallAnchorPoint,
  ballSize: number,
): BallAnchorPoint {
  const cubeSize = readCssLength("--about-cube-size", 680);
  return {
    x: impact.x + cubeSize / 2 - ballSize * 0.08,
    y: impact.y,
  };
}
