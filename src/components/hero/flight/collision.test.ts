import { describe, expect, it } from "vitest";
import { circleOverlap } from "./collision";

describe("circleOverlap", () => {
  it("is true when circles overlap or touch", () => {
    expect(circleOverlap(0, 0, 1, 0, 0, 1)).toBe(true); // concentric
    expect(circleOverlap(0, 0, 1, 1.5, 0, 1)).toBe(true); // overlapping
    expect(circleOverlap(0, 0, 1, 2, 0, 1)).toBe(true); // exactly touching
  });

  it("is false when circles are apart", () => {
    expect(circleOverlap(0, 0, 1, 2.01, 0, 1)).toBe(false);
    expect(circleOverlap(0, 0, 0.5, 5, 5, 0.5)).toBe(false);
  });
});
