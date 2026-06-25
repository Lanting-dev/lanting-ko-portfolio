/** Coarse mobile / narrow viewport — matches primary CSS breakpoint (768px). */
export function isMobileViewport(width = typeof window !== "undefined" ? window.innerWidth : 1440): boolean {
  return width <= 768;
}
