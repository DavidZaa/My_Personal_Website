const BEST_KEY = "dz01_helm_best";

export const GAME_OVER_MESSAGE =
  "If you enjoyed the website, you can reach me at davidzha77@g.ucla.edu!";

export function loadBestScore(): number {
  try {
    const v = parseInt(localStorage.getItem(BEST_KEY) ?? "", 10);
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(n: number): void {
  try {
    localStorage.setItem(BEST_KEY, String(Math.max(0, Math.floor(n))));
  } catch {
    // storage disabled — best score just won't persist this session
  }
}
