import { describe, expect, it } from "vitest";
import {
  SHIP,
  initialShipState,
  isOutOfBounds,
  stepShip,
  type ShipState,
} from "./physics";

const still: ShipState = { x: 0, z: 0, vx: 0, vz: 0, heading: 0 };
const idle = { thrust: false, brake: false, turn: 0 };

describe("stepShip", () => {
  it("accelerates along the heading when thrusting", () => {
    // heading 0 points along +x.
    const next = stepShip(still, { ...idle, thrust: true }, 0.1);
    expect(next.vx).toBeGreaterThan(0);
    expect(Math.abs(next.vz)).toBeLessThan(1e-9);
    expect(next.x).toBeGreaterThan(0);
  });

  it("bleeds off velocity from drag when coasting", () => {
    const moving: ShipState = { ...still, vx: 5 };
    const next = stepShip(moving, idle, 0.1);
    expect(next.vx).toBeLessThan(5);
    expect(next.vx).toBeGreaterThan(0);
  });

  it("brakes harder than passive drag", () => {
    const moving: ShipState = { ...still, vx: 5 };
    const coasted = stepShip(moving, idle, 0.1).vx;
    const braked = stepShip(moving, { ...idle, brake: true }, 0.1).vx;
    expect(braked).toBeLessThan(coasted);
  });

  it("never exceeds the top-speed cap under sustained thrust", () => {
    let s = still;
    for (let i = 0; i < 600; i++) s = stepShip(s, { ...idle, thrust: true }, 0.016);
    expect(Math.hypot(s.vx, s.vz)).toBeLessThanOrEqual(SHIP.maxSpeed + 1e-6);
  });

  it("turns the heading up for positive turn and down for negative", () => {
    expect(stepShip(still, { ...idle, turn: 1 }, 0.1).heading).toBeGreaterThan(0);
    expect(stepShip(still, { ...idle, turn: -1 }, 0.1).heading).toBeLessThan(0);
  });

  it("scales turn by the analog magnitude", () => {
    const half = stepShip(still, { ...idle, turn: 0.5 }, 0.1).heading;
    const full = stepShip(still, { ...idle, turn: 1 }, 0.1).heading;
    expect(half).toBeCloseTo(full / 2, 5);
  });

  it("pushes a ship that has left the arena back inward", () => {
    const outward: ShipState = { x: SHIP.boundary + 2, z: 0, vx: 3, vz: 0, heading: 0 };
    const next = stepShip(outward, idle, 0.1);
    // inward push subtracts from the outward (+x) velocity.
    expect(next.vx).toBeLessThan(3);
  });
});

describe("isOutOfBounds", () => {
  it("is false inside the arena and true past the boundary", () => {
    expect(isOutOfBounds({ ...still, x: SHIP.boundary - 1 })).toBe(false);
    expect(isOutOfBounds({ ...still, x: SHIP.boundary + 1 })).toBe(true);
  });
});

describe("initialShipState", () => {
  it("starts at rest near the origin", () => {
    const s = initialShipState();
    expect(Math.hypot(s.vx, s.vz)).toBe(0);
    expect(isOutOfBounds(s)).toBe(false);
  });
});
