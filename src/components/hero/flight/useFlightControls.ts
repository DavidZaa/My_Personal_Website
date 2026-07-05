import { useEffect, useRef, type MutableRefObject } from "react";
import {
  applyKey,
  applyPointerThrust,
  applyPointerTurn,
  initialInputState,
  type InputState,
} from "./controls";

/**
 * Wires the flight control scheme to the window and exposes the live input as
 * a mutable ref the render loop reads each frame (no re-renders on input).
 */
export function useFlightControls(): MutableRefObject<InputState> {
  const ref = useRef<InputState>(initialInputState());

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return;
      ref.current = applyKey(ref.current, e.code, true);
    };
    const up = (e: KeyboardEvent) => {
      ref.current = applyKey(ref.current, e.code, false);
    };
    const move = (e: MouseEvent) => {
      const turn = (e.clientX / window.innerWidth - 0.5) * 2;
      ref.current = applyPointerTurn(ref.current, turn);
    };
    const press = () => {
      ref.current = applyPointerThrust(ref.current, true);
    };
    const release = () => {
      ref.current = applyPointerThrust(ref.current, false);
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", press);
    window.addEventListener("mouseup", release);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", press);
      window.removeEventListener("mouseup", release);
    };
  }, []);

  return ref;
}
