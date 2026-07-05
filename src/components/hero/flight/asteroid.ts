export type AsteroidSize = "large" | "medium" | "small";

export interface Asteroid {
  id: number;
  size: AsteroidSize;
  x: number;
  z: number;
  vx: number;
  vz: number;
  /** rad/s visual spin — cosmetic, used by the mesh */
  spin: number;
}

export const ASTEROID: Record<
  AsteroidSize,
  { radius: number; points: number; child: AsteroidSize | null; childCount: number }
> = {
  large: { radius: 0.9, points: 20, child: "medium", childCount: 2 },
  medium: { radius: 0.5, points: 50, child: "small", childCount: 2 },
  small: { radius: 0.28, points: 100, child: null, childCount: 0 },
};

/** Soft arena the rocks bounce inside — just inside the ship's boundary (17). */
export const ARENA_RADIUS = 15;

let seq = 0;
function nextId(): number {
  return ++seq;
}

export function spawnWave(wave: number, rng: () => number = Math.random): Asteroid[] {
  const count = 3 + wave;
  const speed = 1.2 * (1 + 0.08 * (wave - 1));
  const out: Asteroid[] = [];
  for (let i = 0; i < count; i++) {
    const ang = rng() * Math.PI * 2;
    const x = Math.cos(ang) * ARENA_RADIUS;
    const z = Math.sin(ang) * ARENA_RADIUS;
    // Head toward the origin with a little jitter (< ±0.5 rad keeps it inward).
    const inward = Math.atan2(-z, -x) + (rng() - 0.5);
    out.push({
      id: nextId(),
      size: "large",
      x,
      z,
      vx: Math.cos(inward) * speed,
      vz: Math.sin(inward) * speed,
      spin: (rng() - 0.5) * 1.2,
    });
  }
  return out;
}

export function splitAsteroid(a: Asteroid, rng: () => number = Math.random): Asteroid[] {
  const spec = ASTEROID[a.size];
  if (!spec.child) return [];
  const speed = Math.hypot(a.vx, a.vz) * 1.25 + 0.5;
  const out: Asteroid[] = [];
  for (let i = 0; i < spec.childCount; i++) {
    const ang = rng() * Math.PI * 2;
    out.push({
      id: nextId(),
      size: spec.child,
      x: a.x,
      z: a.z,
      vx: Math.cos(ang) * speed,
      vz: Math.sin(ang) * speed,
      spin: (rng() - 0.5) * 2,
    });
  }
  return out;
}

export function driftAsteroid(a: Asteroid, dt: number, arenaR: number = ARENA_RADIUS): Asteroid {
  let x = a.x + a.vx * dt;
  let z = a.z + a.vz * dt;
  let vx = a.vx;
  let vz = a.vz;
  const dist = Math.hypot(x, z);
  const wall = arenaR + ASTEROID[a.size].radius;
  if (dist > wall && dist > 0) {
    const nx = x / dist;
    const nz = z / dist;
    const dot = vx * nx + vz * nz;
    vx -= 2 * dot * nx;
    vz -= 2 * dot * nz;
    x = nx * wall;
    z = nz * wall;
  }
  return { ...a, x, z, vx, vz };
}
