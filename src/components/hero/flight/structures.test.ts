import { describe, expect, it } from "vitest";
import { ARENA_RADIUS, ASTEROID, type Asteroid } from "./asteroid";
import {
  NEAR_STRUCTURES,
  SOLID_STRUCTURES,
  bounceAsteroid,
  shipHitsStructure,
} from "./structures";

describe("structure placement", () => {
  it("keeps every solid inside the arena and clear of the origin spawn", () => {
    for (const s of SOLID_STRUCTURES) {
      const d = Math.hypot(s.x, s.z);
      expect(d + s.radius).toBeLessThanOrEqual(ARENA_RADIUS); // inside arena
      expect(d).toBeGreaterThan(s.radius + 3); // clear of the center spawn
    }
  });

  it("includes at least one fly-through gate that is not solid", () => {
    expect(NEAR_STRUCTURES.some((s) => s.kind === "gate" && !s.solid)).toBe(true);
  });
});

describe("shipHitsStructure", () => {
  it("is true on a solid and false in open space", () => {
    const s = SOLID_STRUCTURES[0];
    expect(shipHitsStructure(s.x, s.z, 0.28)).toBe(true);
    expect(shipHitsStructure(0, 0, 0.28)).toBe(false); // origin spawn is safe
  });

  it("ignores non-solid gates", () => {
    const gate = NEAR_STRUCTURES.find((s) => s.kind === "gate")!;
    expect(shipHitsStructure(gate.x, gate.z, 0.28)).toBe(false);
  });
});

describe("bounceAsteroid", () => {
  it("reflects an asteroid heading into a solid back outward", () => {
    const s = SOLID_STRUCTURES[0];
    const ar = ASTEROID.small.radius;
    // just inside the structure, heading toward its center (+x side, moving -x)
    const a: Asteroid = { id: 1, size: "small", x: s.x + s.radius, z: s.z, vx: -2, vz: 0, spin: 0 };
    const out = bounceAsteroid(a);
    expect(out.vx).toBeGreaterThan(0); // now heading away
    expect(Math.hypot(out.x - s.x, out.z - s.z)).toBeGreaterThanOrEqual(s.radius + ar - 1e-6);
  });

  it("leaves a free-flying asteroid untouched", () => {
    const a: Asteroid = { id: 1, size: "small", x: 0, z: 0, vx: 1, vz: 0, spin: 0 };
    expect(bounceAsteroid(a)).toEqual(a);
  });
});
