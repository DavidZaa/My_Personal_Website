import { fireEvent, render } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import type { InputState } from "./controls";
import { useFlightControls } from "./useFlightControls";

function Harness({ onRef }: { onRef: (ref: { current: InputState }) => void }) {
  const ref = useFlightControls();
  useEffect(() => onRef(ref), [ref, onRef]);
  return null;
}

function mount() {
  let ref!: { current: InputState };
  render(<Harness onRef={(r) => (ref = r)} />);
  return () => ref;
}

describe("useFlightControls", () => {
  it("tracks thrust key press and release", () => {
    const get = mount();
    fireEvent.keyDown(window, { code: "KeyW" });
    expect(get().current.thrustKey).toBe(true);
    fireEvent.keyUp(window, { code: "KeyW" });
    expect(get().current.thrustKey).toBe(false);
  });

  it("derives an analog turn from cursor X and takes the pointer source", () => {
    const get = mount();
    Object.defineProperty(window, "innerWidth", { value: 1000, configurable: true });
    fireEvent.mouseMove(window, { clientX: 1000 }); // far right → turn +1
    expect(get().current.lastSource).toBe("pointer");
    expect(get().current.pointerTurn).toBeCloseTo(1, 5); // (1000/1000-0.5)*2 = 1
  });

  it("tracks mouse-held thrust", () => {
    const get = mount();
    fireEvent.mouseDown(window);
    expect(get().current.pointerThrust).toBe(true);
    fireEvent.mouseUp(window);
    expect(get().current.pointerThrust).toBe(false);
  });
});
