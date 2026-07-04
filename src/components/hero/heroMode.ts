export type HeroMode = "3d" | "fallback";

/**
 * The hero runs its WebGL scene only when it is safe and welcome to: motion
 * is allowed, the screen is big enough to fly on, and WebGL is present.
 * Everyone else gets the static fallback — and never sees the flight button.
 */
export function decideHeroMode(env: {
  reducedMotion: boolean;
  smallViewport: boolean;
  webgl: boolean;
}): HeroMode {
  if (env.reducedMotion || env.smallViewport || !env.webgl) return "fallback";
  return "3d";
}
