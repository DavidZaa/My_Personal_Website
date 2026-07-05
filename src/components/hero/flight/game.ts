import { stepShip, type FlightInput, type ShipState } from "./physics";
import {
  ASTEROID,
  driftAsteroid,
  spawnWave,
  splitAsteroid,
  type Asteroid,
} from "./asteroid";
import { BULLET, fireBullet, isBulletAlive, stepBullet, type Bullet } from "./bullet";
import { circleOverlap } from "./collision";
import { bounceAsteroid, shipHitsStructure } from "./structures";

export type GameStatus = "start" | "playing" | "over";

export interface GameState {
  status: GameStatus;
  score: number;
  best: number;
  lives: number;
  wave: number;
  invuln: number;
  cooldown: number;
  ship: ShipState;
  asteroids: Asteroid[];
  bullets: Bullet[];
}

const SHIP_RADIUS = 0.28;
const INVULN_TIME = 2.2;
const START_LIVES = 3;

/** Ship spawns/respawns dead-center, nose up. */
export function gameShipStart(): ShipState {
  return { x: 0, z: 0, vx: 0, vz: 0, heading: -Math.PI / 2 };
}

export function newGame(best = 0): GameState {
  return {
    status: "start",
    score: 0,
    best,
    lives: START_LIVES,
    wave: 0,
    invuln: 0,
    cooldown: 0,
    ship: gameShipStart(),
    asteroids: [],
    bullets: [],
  };
}

export function startRun(prev: GameState): GameState {
  return { ...newGame(prev.best), status: "playing", wave: 1, asteroids: spawnWave(1) };
}

export function stepGame(state: GameState, input: FlightInput, dt: number): GameState {
  if (state.status !== "playing") return state;

  let { score, lives, wave, invuln, cooldown } = state;
  const ship = stepShip(state.ship, input, dt);

  // Bullets: age, move, cull, then maybe fire.
  let bullets = state.bullets.map((b) => stepBullet(b, dt)).filter(isBulletAlive);
  cooldown = Math.max(0, cooldown - dt);
  if (input.fire && cooldown === 0 && bullets.length < BULLET.max) {
    bullets = [...bullets, fireBullet(ship)];
    cooldown = BULLET.cooldown;
  }

  // Asteroids drift, bounce off the arena wall, then ricochet off solids.
  let asteroids = state.asteroids.map((a) => bounceAsteroid(driftAsteroid(a, dt)));

  // Bullet ↔ asteroid: each bolt hits at most one rock.
  const destroyed = new Set<number>();
  const spawned: Asteroid[] = [];
  const survivingBullets: Bullet[] = [];
  for (const b of bullets) {
    let hit = false;
    for (const a of asteroids) {
      if (destroyed.has(a.id)) continue;
      if (circleOverlap(b.x, b.z, BULLET.radius, a.x, a.z, ASTEROID[a.size].radius)) {
        destroyed.add(a.id);
        score += ASTEROID[a.size].points;
        spawned.push(...splitAsteroid(a));
        hit = true;
        break;
      }
    }
    if (!hit) survivingBullets.push(b);
  }
  bullets = survivingBullets;
  asteroids = asteroids.filter((a) => !destroyed.has(a.id)).concat(spawned);

  // Ship ↔ asteroid (only when vulnerable).
  invuln = Math.max(0, invuln - dt);
  let nextShip = ship;
  if (invuln === 0) {
    const hitRock = asteroids.some((a) =>
      circleOverlap(ship.x, ship.z, SHIP_RADIUS, a.x, a.z, ASTEROID[a.size].radius),
    );
    if (hitRock || shipHitsStructure(ship.x, ship.z, SHIP_RADIUS)) {
      lives -= 1;
      invuln = INVULN_TIME;
      nextShip = gameShipStart();
    }
  }

  // Field cleared → next wave with a bonus.
  if (asteroids.length === 0) {
    score += wave * 100;
    wave += 1;
    asteroids = spawnWave(wave);
  }

  // Out of lives → game over, bank the best.
  let status: GameStatus = "playing";
  let best = state.best;
  if (lives <= 0) {
    status = "over";
    best = Math.max(best, score);
  }

  return { status, score, best, lives, wave, invuln, cooldown, ship: nextShip, asteroids, bullets };
}
