import { describe, expect, it } from "vitest";
import { decideHeroMode } from "./heroMode";

describe("decideHeroMode", () => {
  const full = { reducedMotion: false, smallViewport: false, webgl: true };

  it("runs 3D only when motion is allowed, the viewport is large, and WebGL exists", () => {
    expect(decideHeroMode(full)).toBe("3d");
  });

  it("falls back under reduced motion", () => {
    expect(decideHeroMode({ ...full, reducedMotion: true })).toBe("fallback");
  });

  it("falls back on small viewports", () => {
    expect(decideHeroMode({ ...full, smallViewport: true })).toBe("fallback");
  });

  it("falls back when WebGL is unavailable", () => {
    expect(decideHeroMode({ ...full, webgl: false })).toBe("fallback");
  });
});
