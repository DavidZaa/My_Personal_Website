/** A lone relay parked out past the last orbit — far from spawn, reachable. */
export const SATELLITE_POS = { x: 12, z: 6 } as const;

const FOUND_KEY = "dz01_helm_signal";

export const SATELLITE_MESSAGE =
  "If you enjoyed the website, you can reach me at davidzha77@g.ucla.edu!";

export function isNearSatellite(
  pos: { x: number; z: number },
  radius = 2.2,
): boolean {
  return Math.hypot(pos.x - SATELLITE_POS.x, pos.z - SATELLITE_POS.z) <= radius;
}

export function hasFoundSatellite(): boolean {
  try {
    return localStorage.getItem(FOUND_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSatelliteFound(): void {
  try {
    localStorage.setItem(FOUND_KEY, "1");
  } catch {
    // Private-mode / disabled storage — the egg just re-fires next session.
  }
}
