import { describe, expect, it } from "vitest";
import { newGame, startRun, stepGame, gameShipStart, type GameState } from "./game";
import { ASTEROID, type Asteroid } from "./asteroid";
import { BULLET } from "./bullet";
import { SOLID_STRUCTURES } from "./structures";
import type { FlightInput } from "./physics";

const NO_INPUT: FlightInput = { thrust: false, brake: false, turn: 0, fire: false };
const FIRE: FlightInput = { ...NO_INPUT, fire: true };

function playing(over: Partial<GameState> = {}): GameState {
  return { ...newGame(0), status: "playing", wave: 1, ...over };
}

const rock = (size: Asteroid["size"], x: number, z: number): Asteroid => ({
  id: Math.floor(Math.random() * 1e9), size, x, z, vx: 0, vz: 0, spin: 0,
});

describe("newGame / startRun", () => {
  it("starts on the start screen with 3 lives and no rocks", () => {
    const g = newGame(500);
    expect(g.status).toBe("start");
    expect(g.lives).toBe(3);
    expect(g.best).toBe(500);
    expect(g.asteroids).toHaveLength(0);
  });

  it("startRun begins wave 1 with a field of asteroids", () => {
    const g = startRun(newGame(500));
    expect(g.status).toBe("playing");
    expect(g.wave).toBe(1);
    expect(g.asteroids.length).toBeGreaterThan(0);
    expect(g.best).toBe(500); // best carries over
  });
});

describe("stepGame — idle states", () => {
  it("does nothing while on the start or over screen", () => {
    const start = newGame(0);
    expect(stepGame(start, FIRE, 0.1)).toBe(start);
  });
});

describe("stepGame — firing", () => {
  it("fires a bolt when off cooldown and under the cap", () => {
    const g = stepGame(playing({ ship: gameShipStart() }), FIRE, 0.016);
    expect(g.bullets).toHaveLength(1);
    expect(g.cooldown).toBeGreaterThan(0);
  });

  it("respects the cooldown between shots", () => {
    let g = stepGame(playing(), FIRE, 0.016);
    g = stepGame(g, FIRE, 0.016); // still cooling down
    expect(g.bullets).toHaveLength(1);
  });

  it("never exceeds the 4-bolt cap", () => {
    const bullets = Array.from({ length: BULLET.max }, (_, i) => ({
      id: i + 1, x: 0, z: 100, vx: 0, vz: 0, life: 1,
    }));
    const g = stepGame(playing({ bullets, cooldown: 0 }), FIRE, 0.001);
    expect(g.bullets.length).toBeLessThanOrEqual(BULLET.max);
  });
});

describe("stepGame — shooting asteroids", () => {
  it("a bolt destroys a large rock, spawns 2 medium, and scores 20", () => {
    const bullet = { id: 1, x: 5, z: 0, vx: 0, vz: 0, life: 1 };
    const g = stepGame(
      playing({ bullets: [bullet], asteroids: [rock("large", 5, 0)] }),
      NO_INPUT,
      0.001,
    );
    expect(g.score).toBe(ASTEROID.large.points);
    expect(g.bullets).toHaveLength(0); // consumed
    expect(g.asteroids).toHaveLength(2);
    expect(g.asteroids.every((a) => a.size === "medium")).toBe(true);
  });

  it("a small rock is destroyed for 100 with no children", () => {
    const bullet = { id: 1, x: 5, z: 0, vx: 0, vz: 0, life: 1 };
    // second rock far away so the field isn't cleared (no wave bonus to confound the score)
    const g = stepGame(
      playing({ bullets: [bullet], asteroids: [rock("small", 5, 0), rock("small", -9, 0)] }),
      NO_INPUT,
      0.001,
    );
    expect(g.score).toBe(ASTEROID.small.points); // just the 100, no split children
    expect(g.asteroids).toHaveLength(1); // the far rock survives; small doesn't split
  });

  it("clearing the last rock adds the small's points plus the wave bonus", () => {
    const bullet = { id: 1, x: 5, z: 0, vx: 0, vz: 0, life: 1 };
    const g = stepGame(
      playing({ wave: 1, bullets: [bullet], asteroids: [rock("small", 5, 0)] }),
      NO_INPUT,
      0.001,
    );
    expect(g.score).toBe(ASTEROID.small.points + 100); // 100 + wave*100
    expect(g.wave).toBe(2);
  });
});

describe("stepGame — ship damage", () => {
  it("colliding with a rock costs a life, grants invuln, and recenters the ship", () => {
    const g = stepGame(
      playing({ ship: gameShipStart(), asteroids: [rock("large", 0, 0)] }),
      NO_INPUT,
      0.001,
    );
    expect(g.lives).toBe(2);
    expect(g.invuln).toBeGreaterThan(0);
    expect(g.ship.x).toBe(0);
    expect(g.ship.z).toBe(0);
  });

  it("does not lose a life while invulnerable", () => {
    const g = stepGame(
      playing({ ship: gameShipStart(), invuln: 1, asteroids: [rock("large", 0, 0)] }),
      NO_INPUT,
      0.001,
    );
    expect(g.lives).toBe(3);
  });

  it("losing the last life ends the run and banks the best score", () => {
    const g = stepGame(
      playing({ lives: 1, score: 900, best: 500, ship: gameShipStart(), asteroids: [rock("large", 0, 0)] }),
      NO_INPUT,
      0.001,
    );
    expect(g.status).toBe("over");
    expect(g.best).toBe(900);
  });
});

describe("stepGame — waves", () => {
  it("clearing the field advances the wave with a bonus", () => {
    const g = stepGame(playing({ wave: 1, score: 0, asteroids: [] }), NO_INPUT, 0.001);
    expect(g.wave).toBe(2);
    expect(g.score).toBe(100); // wave * 100 bonus
    expect(g.asteroids.length).toBeGreaterThan(0);
  });
});

describe("stepGame — structures", () => {
  it("costs a life when the ship is inside a solid structure", () => {
    const s = SOLID_STRUCTURES[0];
    const g = stepGame(
      playing({ ship: { x: s.x, z: s.z, vx: 0, vz: 0, heading: 0 }, asteroids: [rock("small", -100, -100)] }),
      NO_INPUT,
      0.001,
    );
    expect(g.lives).toBe(2);
    expect(g.invuln).toBeGreaterThan(0);
  });

  it("bounces an asteroid that is driven into a solid structure", () => {
    const s = SOLID_STRUCTURES[0];
    const a: Asteroid = { id: 7, size: "small", x: s.x + s.radius, z: s.z, vx: -3, vz: 0, spin: 0 };
    const g = stepGame(
      playing({ ship: { x: -100, z: -100, vx: 0, vz: 0, heading: 0 }, asteroids: [a] }),
      NO_INPUT,
      0.001,
    );
    const out = g.asteroids.find((x) => x.id === 7)!;
    expect(out.vx).toBeGreaterThan(0); // reflected outward
  });
});
