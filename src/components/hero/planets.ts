export interface PlanetSpec {
  label: string;
  href: string;
  color: string;
  /** orbit radius in scene units */
  orbit: number;
  /** planet radius */
  size: number;
  /** radians per second */
  speed: number;
  /** starting angle */
  phase: number;
}

export const PLANETS: PlanetSpec[] = [
  { label: "Projects", href: "/projects", color: "#8b5cf6", orbit: 2.6, size: 0.22, speed: 0.16, phase: 0.6 },
  { label: "Blog", href: "/blog", color: "#22d3ee", orbit: 3.6, size: 0.18, speed: 0.12, phase: 2.6 },
  { label: "Now", href: "/now", color: "#34d399", orbit: 4.5, size: 0.14, speed: 0.09, phase: 4.4 },
  { label: "Guestbook", href: "/guestbook", color: "#f472b6", orbit: 5.3, size: 0.16, speed: 0.07, phase: 5.6 },
];
