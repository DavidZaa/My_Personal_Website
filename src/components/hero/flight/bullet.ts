import type { ShipState } from "./physics";

export interface Bullet {
  id: number;
  x: number;
  z: number;
  vx: number;
  vz: number;
  /** seconds of life remaining */
  life: number;
}

export const BULLET = {
  speed: 24,
  life: 1.1,
  radius: 0.12,
  max: 4,
  cooldown: 0.18,
} as const;

let seq = 0;

export function fireBullet(ship: ShipState): Bullet {
  const nose = 0.5;
  return {
    id: ++seq,
    x: ship.x + Math.cos(ship.heading) * nose,
    z: ship.z + Math.sin(ship.heading) * nose,
    vx: Math.cos(ship.heading) * BULLET.speed,
    vz: Math.sin(ship.heading) * BULLET.speed,
    life: BULLET.life,
  };
}

export function stepBullet(b: Bullet, dt: number): Bullet {
  return { ...b, x: b.x + b.vx * dt, z: b.z + b.vz * dt, life: b.life - dt };
}

export function isBulletAlive(b: Bullet): boolean {
  return b.life > 0;
}
