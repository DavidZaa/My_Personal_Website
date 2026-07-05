/** Do two circles on the xz-plane overlap (or touch)? */
export function circleOverlap(
  ax: number,
  az: number,
  ar: number,
  bx: number,
  bz: number,
  br: number,
): boolean {
  return Math.hypot(ax - bx, az - bz) <= ar + br;
}
