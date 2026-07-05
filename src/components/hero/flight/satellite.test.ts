import { beforeEach, describe, expect, it } from "vitest";
import {
  SATELLITE_POS,
  hasFoundSatellite,
  isNearSatellite,
  markSatelliteFound,
} from "./satellite";

describe("isNearSatellite", () => {
  it("is true at the satellite and false far away", () => {
    expect(isNearSatellite(SATELLITE_POS)).toBe(true);
    expect(isNearSatellite({ x: 0, z: 0 })).toBe(false);
  });

  it("parks the satellite in deep space but inside the arena", () => {
    const dist = Math.hypot(SATELLITE_POS.x, SATELLITE_POS.z);
    expect(dist).toBeGreaterThan(5.6); // beyond the outermost orbit
    expect(dist).toBeLessThan(17); // still reachable inside the boundary
  });
});

describe("found state", () => {
  beforeEach(() => localStorage.clear());

  it("starts unfound and persists once marked", () => {
    expect(hasFoundSatellite()).toBe(false);
    markSatelliteFound();
    expect(hasFoundSatellite()).toBe(true);
  });
});
