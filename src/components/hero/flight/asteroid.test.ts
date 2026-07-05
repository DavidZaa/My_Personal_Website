import { describe, expect, it } from "vitest";
import {
  ARENA_RADIUS,
  ASTEROID,
  driftAsteroid,
  spawnWave,
  splitAsteroid,
  type Asteroid,
} from "./asteroid";

const seq = () => {
  // deterministic-ish rng: cycles through a fixed set
  const vals = [0.1, 0.6, 0.3, 0.9, 0.5, 0.2];
  let i = 0;
  return () => vals[i++ % vals.length];
};

describe("spawnWave", () => {
  it("spawns 3 + wave large asteroids on the arena edge, heading inward", () => {
    const rocks = spawnWave(2, seq());
    expect(rocks).toHaveLength(5);
    for (const r of rocks) {
      expect(r.size).toBe("large");
      expect(Math.hypot(r.x, r.z)).toBeCloseTo(ARENA_RADIUS, 5);
      // velocity has an inward component: dot(pos, vel) < 0
      expect(r.x * r.vx + r.z * r.vz).toBeLessThan(0);
    }
  });

  it("gives every asteroid a unique id", () => {
    const rocks = spawnWave(3, seq());
    expect(new Set(rocks.map((r) => r.id)).size).toBe(rocks.length);
  });
});

describe("splitAsteroid", () => {
  const at = (size: Asteroid["size"]): Asteroid => ({
    id: 1, size, x: 3, z: -2, vx: 1, vz: 0, spin: 0,
  });

  it("splits large into 2 medium at the same position", () => {
    const kids = splitAsteroid(at("large"), seq());
    expect(kids).toHaveLength(2);
    expect(kids.every((k) => k.size === "medium")).toBe(true);
    expect(kids.every((k) => k.x === 3 && k.z === -2)).toBe(true);
  });

  it("splits medium into 2 small", () => {
    const kids = splitAsteroid(at("medium"), seq());
    expect(kids).toHaveLength(2);
    expect(kids.every((k) => k.size === "small")).toBe(true);
  });

  it("does not split small", () => {
    expect(splitAsteroid(at("small"), seq())).toEqual([]);
  });

  it("children move faster than the parent", () => {
    const parent = at("large");
    const kids = splitAsteroid(parent, seq());
    const parentSpeed = Math.hypot(parent.vx, parent.vz);
    for (const k of kids) expect(Math.hypot(k.vx, k.vz)).toBeGreaterThan(parentSpeed);
  });
});

describe("driftAsteroid", () => {
  it("moves by velocity * dt inside the arena", () => {
    const a: Asteroid = { id: 1, size: "small", x: 0, z: 0, vx: 2, vz: 0, spin: 0 };
    const next = driftAsteroid(a, 0.5);
    expect(next.x).toBeCloseTo(1, 5);
  });

  it("reflects velocity inward at the boundary", () => {
    // heading straight out along +x, already past the wall
    const a: Asteroid = { id: 1, size: "small", x: ARENA_RADIUS + 5, z: 0, vx: 3, vz: 0, spin: 0 };
    const next = driftAsteroid(a, 0.016);
    expect(next.vx).toBeLessThan(0); // now heading back inward
    expect(Math.hypot(next.x, next.z)).toBeLessThanOrEqual(ARENA_RADIUS + ASTEROID.small.radius + 1e-6);
  });
});
