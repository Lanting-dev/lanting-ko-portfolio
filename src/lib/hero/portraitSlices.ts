/**
 * Hero figure shattering. The portrait is partitioned into contiguous
 * irregular bands , no intact copy underneath. A band that moves leaves paper
 * behind it, which is what makes it read as cut rather than double-exposed.
 * Bands with drift 0 stay put, so the face survives in places.
 */

/** Square, background removed. Swap the file, keep the path. */
export const HERO_PORTRAIT_SRC = "/portrait.webp";

/**
 * A horizontal segment of a band. `from`/`to` are % of the figure's width;
 * `drift` slides it sideways and `driftY` up or down, so the vertical cuts
 * between pieces read as breaks too, not just seams.
 */
export type HeroPiece = {
  from: number;
  to: number;
  drift: number;
  driftY?: number;
};

/** `height` is % of the figure's height. Heights must total 100. */
export type HeroBand = { height: number; pieces: HeroPiece[] };

const whole = (drift: number): HeroPiece[] => [{ from: 0, to: 100, drift }];

/**
 * Uneven on purpose: thick calm bands against thin violent ones. The eye band
 * and the mouth band are deliberately whole and still , everything can come
 * apart around them as long as the face still reads.
 */
export const HERO_BANDS: HeroBand[] = [
  { height: 6, pieces: whole(0) },
  { height: 3.5, pieces: [{ from: 0, to: 58, drift: -120 }, { from: 58, to: 100, drift: 0, driftY: -34 }] },
  { height: 8, pieces: [{ from: 0, to: 44, drift: 0 }, { from: 44, to: 100, drift: 0, driftY: 46 }] },
  { height: 2, pieces: [{ from: 0, to: 42, drift: 0 }, { from: 42, to: 100, drift: 96 }] },
  { height: 5.5, pieces: [{ from: 0, to: 30, drift: -74, driftY: 28 }, { from: 30, to: 100, drift: -74 }] },
  { height: 4, pieces: [{ from: 0, to: 66, drift: 0 }, { from: 66, to: 100, drift: -108, driftY: -40 }] },

  // Eyes , left whole and still.
  { height: 7, pieces: whole(0) },

  { height: 2.5, pieces: [{ from: 0, to: 54, drift: 118 }, { from: 54, to: 100, drift: 0, driftY: 36 }] },
  { height: 6.5, pieces: [{ from: 0, to: 36, drift: -88, driftY: -30 }, { from: 36, to: 100, drift: -88 }] },
  { height: 3, pieces: [{ from: 0, to: 38, drift: 0 }, { from: 38, to: 100, drift: 64 }] },

  // Mouth , left whole and still.
  { height: 9, pieces: whole(0) },

  { height: 2, pieces: [{ from: 0, to: 72, drift: -96 }, { from: 72, to: 100, drift: 0, driftY: -42 }] },
  { height: 5, pieces: [{ from: 0, to: 52, drift: 82 }, { from: 52, to: 100, drift: 82, driftY: 38 }] },
  { height: 4.5, pieces: [{ from: 0, to: 48, drift: 0 }, { from: 48, to: 100, drift: -70 }] },
  { height: 8, pieces: [{ from: 0, to: 62, drift: 0 }, { from: 62, to: 100, drift: 0, driftY: 52 }] },

  // Shirt.
  { height: 3, pieces: [{ from: 0, to: 60, drift: 124 }, { from: 60, to: 100, drift: 0, driftY: -30 }] },
  { height: 6.5, pieces: [{ from: 0, to: 40, drift: -92, driftY: 44 }, { from: 40, to: 100, drift: -92 }] },
  { height: 4, pieces: [{ from: 0, to: 44, drift: 0 }, { from: 44, to: 100, drift: 78 }] },
  { height: 10, pieces: [{ from: 0, to: 56, drift: -60 }, { from: 56, to: 100, drift: -60, driftY: -48 }] },
];
