import { beforeEach, describe, expect, it } from "vitest";
import { GAME_OVER_MESSAGE, loadBestScore, saveBestScore } from "./store";

describe("best score store", () => {
  beforeEach(() => localStorage.clear());

  it("returns 0 when nothing is stored", () => {
    expect(loadBestScore()).toBe(0);
  });

  it("round-trips a saved score, flooring to an int", () => {
    saveBestScore(1234.7);
    expect(loadBestScore()).toBe(1234);
  });

  it("returns 0 for garbage or negative stored values", () => {
    localStorage.setItem("dz01_helm_best", "not-a-number");
    expect(loadBestScore()).toBe(0);
  });
});

describe("GAME_OVER_MESSAGE", () => {
  it("is the exact contact line", () => {
    expect(GAME_OVER_MESSAGE).toBe(
      "If you enjoyed the website, you can reach me at davidzha77@g.ucla.edu!",
    );
  });
});
