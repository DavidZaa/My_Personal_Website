import { useEffect, useRef, type MutableRefObject } from "react";
import {
  applyKey,
  applyPointerThrust,
  applyPointerTurn,
  initialInputState,
  isFlightKey,
  type InputState,
} from "./controls";

/**
 * Wires the flight control scheme to the window and exposes the live input as
 * a mutable ref the render loop reads each frame (no re-renders on input).
 */
export function useFlightControls(): MutableRefObject<InputState> {
  const ref = useRef<InputState>(initialInputState());

  useEffect(() => {
    // Gameplay keys are captured and stopped here so they never reach the
    // page's own global listeners underneath the overlay (e.g. the hangar's
    // arrow-key navigation). Other keys (Escape, ⌘K) pass through untouched.
    const down = (e: KeyboardEvent) => {
      if (isFlightKey(e.code)) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.repeat) return;
      ref.current = applyKey(ref.current, e.code, true);
    };
    const up = (e: KeyboardEvent) => {
      if (isFlightKey(e.code)) e.stopPropagation();
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
    // Losing focus (alt-tab, click away) swallows the keyup, which would leave
    // a key stuck "held" — reset all input so nothing keeps firing/thrusting.
    const reset = () => {
      ref.current = initialInputState();
    };

    // Capture phase: run before (and pre-empt) the page's bubble-phase listeners.
    window.addEventListener("keydown", down, true);
    window.addEventListener("keyup", up, true);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", press);
    window.addEventListener("mouseup", release);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("keydown", down, true);
      window.removeEventListener("keyup", up, true);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", press);
      window.removeEventListener("mouseup", release);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return ref;
}
