import { describe, expect, it } from "vitest";
import { BULLET, fireBullet, isBulletAlive, stepBullet } from "./bullet";
import type { ShipState } from "./physics";

const ship: ShipState = { x: 0, z: 0, vx: 0, vz: 0, heading: 0 }; // nose along +x

describe("fireBullet", () => {
  it("launches from the nose along the heading", () => {
    const b = fireBullet(ship);
    expect(b.x).toBeGreaterThan(0); // ahead of the ship
    expect(b.vx).toBeCloseTo(BULLET.speed, 5);
    expect(Math.abs(b.vz)).toBeLessThan(1e-9);
    expect(b.life).toBe(BULLET.life);
  });
});

describe("stepBullet / isBulletAlive", () => {
  it("moves and ages the bullet", () => {
    const b = stepBullet(fireBullet(ship), 0.1);
    expect(b.x).toBeGreaterThan(BULLET.speed * 0.05);
    expect(b.life).toBeLessThan(BULLET.life);
  });

  it("is dead once life runs out", () => {
    expect(isBulletAlive({ id: 1, x: 0, z: 0, vx: 0, vz: 0, life: 0 })).toBe(false);
    expect(isBulletAlive({ id: 1, x: 0, z: 0, vx: 0, vz: 0, life: 0.2 })).toBe(true);
  });
});
