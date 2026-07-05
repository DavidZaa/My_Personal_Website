import type { FlightInput } from "./physics";

export interface InputState {
  thrustKey: boolean;
  brakeKey: boolean;
  /** -1 / 0 / +1 from the turn keys */
  keyTurn: number;
  /** analog -1..1 from the mouse position */
  pointerTurn: number;
  /** mouse held down */
  pointerThrust: boolean;
  /** which scheme spoke most recently — steering follows it */
  lastSource: "keys" | "pointer";
}

export function initialInputState(): InputState {
  return {
    thrustKey: false,
    brakeKey: false,
    keyTurn: 0,
    pointerTurn: 0,
    pointerThrust: false,
    lastSource: "keys",
  };
}

type Action = "thrust" | "brake" | "left" | "right";

const KEY_MAP: Record<string, Action> = {
  KeyW: "thrust",
  ArrowUp: "thrust",
  KeyS: "brake",
  ArrowDown: "brake",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
};

export function applyKey(s: InputState, code: string, pressed: boolean): InputState {
  const action = KEY_MAP[code];
  if (!action) return s;
  const next: InputState = { ...s, lastSource: "keys" };
  if (action === "thrust") next.thrustKey = pressed;
  else if (action === "brake") next.brakeKey = pressed;
  else if (action === "left") next.keyTurn = pressed ? 1 : 0;
  else if (action === "right") next.keyTurn = pressed ? -1 : 0;
  return next;
}

export function applyPointerTurn(s: InputState, turn: number): InputState {
  return {
    ...s,
    pointerTurn: Math.max(-1, Math.min(1, turn)),
    lastSource: "pointer",
  };
}

export function applyPointerThrust(s: InputState, pressed: boolean): InputState {
  return { ...s, pointerThrust: pressed };
}

/** Collapse the two-scheme input into what the physics step consumes. */
export function resolveFlightInput(s: InputState): FlightInput {
  return {
    thrust: s.thrustKey || s.pointerThrust,
    brake: s.brakeKey,
    turn: s.lastSource === "pointer" ? s.pointerTurn : s.keyTurn,
  };
}
