import { ASTEROID, type Asteroid } from "./asteroid";
import { circleOverlap } from "./collision";

export type StructureKind =
  | "station"
  | "platform"
  | "depot"
  | "gate"
  | "orbitalRing"
  | "mothership"
  | "ringedPlanet";

export interface Structure {
  id: number;
  kind: StructureKind;
  x: number;
  z: number;
  /** collision radius for solids; visual footprint for gates/backdrop */
  radius: number;
  solid: boolean;
  /** cosmetic spin (rad/s) for the mesh */
  spin: number;
  /** mesh scale multiplier */
  scale: number;
  /** height offset for backdrop depth; near structures sit at 0 */
  y?: number;
}

let seq = 0;
const mk = (s: Omit<Structure, "id">): Structure => ({ id: ++seq, ...s });

export const NEAR_STRUCTURES: Structure[] = [
  mk({ kind: "station", x: 7, z: -5, radius: 2.4, solid: true, spin: 0.15, scale: 1 }),
  mk({ kind: "platform", x: -8, z: 3.5, radius: 1.9, solid: true, spin: 0.1, scale: 1 }),
  mk({ kind: "depot", x: 4.5, z: 8.5, radius: 1.7, solid: true, spin: 0.05, scale: 1 }),
  mk({ kind: "gate", x: -5.5, z: -8.5, radius: 3, solid: false, spin: 0.3, scale: 1 }),
  mk({ kind: "gate", x: 10.5, z: 4, radius: 3, solid: false, spin: -0.3, scale: 1 }),
];

export const FAR_STRUCTURES: Structure[] = [
  mk({ kind: "orbitalRing", x: 0, z: -62, radius: 0, solid: false, spin: 0.02, scale: 30, y: 10 }),
  mk({ kind: "mothership", x: -48, z: -30, radius: 0, solid: false, spin: 0, scale: 6, y: 8 }),
  mk({ kind: "ringedPlanet", x: 58, z: 24, radius: 0, solid: false, spin: 0.03, scale: 10, y: 14 }),
];

export const SOLID_STRUCTURES: Structure[] = NEAR_STRUCTURES.filter((s) => s.solid);

/** Would a circle at (x,z,r) touch any solid structure? (ship collision) */
export function shipHitsStructure(x: number, z: number, r: number): boolean {
  return SOLID_STRUCTURES.some((s) => circleOverlap(x, z, r, s.x, s.z, s.radius));
}

/** Bounce an asteroid out of the first solid structure it overlaps; else return it unchanged. */
export function bounceAsteroid(a: Asteroid): Asteroid {
  const ar = ASTEROID[a.size].radius;
  for (const s of SOLID_STRUCTURES) {
    const dx = a.x - s.x;
    const dz = a.z - s.z;
    const dist = Math.hypot(dx, dz);
    const minDist = s.radius + ar;
    if (dist < minDist && dist > 0) {
      const nx = dx / dist;
      const nz = dz / dist;
      const dot = a.vx * nx + a.vz * nz;
      // reflect only if heading inward, then push out to the surface
      const vx = dot < 0 ? a.vx - 2 * dot * nx : a.vx;
      const vz = dot < 0 ? a.vz - 2 * dot * nz : a.vz;
      return { ...a, x: s.x + nx * minDist, z: s.z + nz * minDist, vx, vz };
    }
  }
  return a;
}
