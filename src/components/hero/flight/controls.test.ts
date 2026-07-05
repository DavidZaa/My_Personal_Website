import { describe, expect, it } from "vitest";
import {
  applyKey,
  applyPointerThrust,
  applyPointerTurn,
  initialInputState,
  isFlightKey,
  resolveFlightInput,
} from "./controls";

describe("isFlightKey", () => {
  it("is true for mapped gameplay keys and false otherwise", () => {
    for (const code of ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft"]) {
      expect(isFlightKey(code)).toBe(true);
    }
    for (const code of ["Escape", "KeyK", "Space", "Tab"]) {
      expect(isFlightKey(code)).toBe(false);
    }
  });
});

describe("applyKey", () => {
  it("maps W and ArrowUp to thrust", () => {
    expect(applyKey(initialInputState(), "KeyW", true).thrustKey).toBe(true);
    expect(applyKey(initialInputState(), "ArrowUp", true).thrustKey).toBe(true);
  });

  it("maps A/D to opposite analog turns", () => {
    expect(applyKey(initialInputState(), "KeyA", true).keyTurn).toBe(1);
    expect(applyKey(initialInputState(), "KeyD", true).keyTurn).toBe(-1);
  });

  it("clears turn when the turn key is released", () => {
    let s = applyKey(initialInputState(), "KeyA", true);
    s = applyKey(s, "KeyA", false);
    expect(s.keyTurn).toBe(0);
  });

  it("ignores unmapped keys and leaves the source untouched", () => {
    const before = applyPointerTurn(initialInputState(), 0.5);
    const after = applyKey(before, "KeyZ", true);
    expect(after).toEqual(before);
  });

  it("marks keys as the most recent source", () => {
    expect(applyKey(initialInputState(), "KeyW", true).lastSource).toBe("keys");
  });
});

describe("pointer input", () => {
  it("records a clamped analog turn and takes the source", () => {
    const s = applyPointerTurn(initialInputState(), 2);
    expect(s.pointerTurn).toBe(1);
    expect(s.lastSource).toBe("pointer");
  });

  it("records mouse-held thrust", () => {
    expect(applyPointerThrust(initialInputState(), true).pointerThrust).toBe(true);
  });
});

describe("resolveFlightInput last-input-wins", () => {
  it("steers by the pointer after a mouse move", () => {
    let s = applyKey(initialInputState(), "KeyA", true); // keyTurn = 1
    s = applyPointerTurn(s, -0.4); // pointer is now the live source
    expect(resolveFlightInput(s).turn).toBeCloseTo(-0.4, 5);
  });

  it("steers by the keyboard after a turn key", () => {
    let s = applyPointerTurn(initialInputState(), -0.4);
    s = applyKey(s, "KeyA", true); // keys retake the source
    expect(resolveFlightInput(s).turn).toBe(1);
  });

  it("thrusts if either the key or the mouse asks for it", () => {
    const key = applyKey(initialInputState(), "KeyW", true);
    expect(resolveFlightInput(key).thrust).toBe(true);
    const mouse = applyPointerThrust(initialInputState(), true);
    expect(resolveFlightInput(mouse).thrust).toBe(true);
  });
});
