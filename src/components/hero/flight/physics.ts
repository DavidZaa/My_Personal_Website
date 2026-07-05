export interface ShipState {
  /** planar position — flight is confined to the orbital plane (y = 0) */
  x: number;
  z: number;
  /** velocity */
  vx: number;
  vz: number;
  /** facing direction in radians; 0 points along +x */
  heading: number;
}

export interface FlightInput {
  thrust: boolean;
  brake: boolean;
  /** -1 (turn down/clockwise) .. +1 (turn up/counter-clockwise), analog */
  turn: number;
}

export const SHIP = {
  accel: 16, // units/s^2 along heading while thrusting
  turnRate: 2.6, // rad/s at full turn
  maxSpeed: 9, // units/s hard cap
  drag: 0.55, // fraction of speed retained per second while coasting
  brakeDrag: 0.08, // fraction retained per second while braking
  boundary: 17, // soft arena radius (~3x the outermost orbit of 5.6)
  boundaryPush: 22, // inward accel applied outside the boundary
} as const;

/** The ship spawns at the system's edge, at rest, nose pointing inward. */
export function initialShipState(): ShipState {
  return { x: 0, z: 9, vx: 0, vz: 0, heading: -Math.PI / 2 };
}

export function isOutOfBounds(s: ShipState, radius: number = SHIP.boundary): boolean {
  return Math.hypot(s.x, s.z) > radius;
}

/** Pure integrator: given a state, the held input, and a timestep, return the
 * next state. Frame-rate independent (drag uses dt in the exponent). */
export function stepShip(s: ShipState, input: FlightInput, dt: number): ShipState {
  const turn = Math.max(-1, Math.min(1, input.turn));
  const heading = s.heading + turn * SHIP.turnRate * dt;

  let vx = s.vx;
  let vz = s.vz;

  if (input.thrust) {
    vx += Math.cos(heading) * SHIP.accel * dt;
    vz += Math.sin(heading) * SHIP.accel * dt;
  }

  // Exponential velocity decay — passive drift or a firmer brake.
  const retain = Math.pow(input.brake ? SHIP.brakeDrag : SHIP.drag, dt);
  vx *= retain;
  vz *= retain;

  // Nudge a straying ship back toward the origin.
  const dist = Math.hypot(s.x, s.z);
  if (dist > SHIP.boundary && dist > 0) {
    vx += (-s.x / dist) * SHIP.boundaryPush * dt;
    vz += (-s.z / dist) * SHIP.boundaryPush * dt;
  }

  // Clamp to top speed.
  const speed = Math.hypot(vx, vz);
  if (speed > SHIP.maxSpeed) {
    const k = SHIP.maxSpeed / speed;
    vx *= k;
    vz *= k;
  }

  return { x: s.x + vx * dt, z: s.z + vz * dt, vx, vz, heading };
}
