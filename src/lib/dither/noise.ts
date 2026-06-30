/** Re-exports + dust helper used by scatter overlay. */
import { heckelWhiteNoiseThreshold } from "./heckelDither";

export {
  heckelBlueNoiseThreshold,
  heckelBayerThreshold,
  heckelThreshold,
  heckelOrderedBinary,
  heckelQuantizeChannel,
  heckelQuantizeScalar,
  heckelQuantizeRgb,
  heckelPixelCoord,
  heckelLuminance,
  heckelWhiteNoiseThreshold,
  type HeckelThresholdMode,
} from "./heckelDither";

/** Sparse film dust , white-noise speckle on empty areas. */
export function dustSpeck(
  x: number,
  y: number,
  seed: number,
  density: number,
): boolean {
  if (density <= 0) return false;
  const n = heckelWhiteNoiseThreshold(x * 1.91 + seed, y * 2.07 + seed);
  return n > 1 - density;
}
