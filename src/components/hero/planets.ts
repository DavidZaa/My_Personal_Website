export interface PlanetSpec {
  label: string;
  /** page anchor of the voyage section this planet warps to */
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

/** One planet per voyage waypoint — the hero doubles as the map. */
export const PLANETS: PlanetSpec[] = [
  { label: "Dossier", href: "#dossier", color: "#22d3ee", orbit: 2.4, size: 0.2, speed: 0.17, phase: 0.6 },
  { label: "Payload", href: "#payload", color: "#8b5cf6", orbit: 3.2, size: 0.22, speed: 0.13, phase: 2.2 },
  { label: "Transmissions", href: "#transmission", color: "#f472b6", orbit: 4.0, size: 0.16, speed: 0.1, phase: 3.9 },
  { label: "Telemetry", href: "#telemetry", color: "#34d399", orbit: 4.8, size: 0.14, speed: 0.08, phase: 5.1 },
  { label: "Signals", href: "#signals", color: "#fbbf24", orbit: 5.6, size: 0.17, speed: 0.06, phase: 0.2 },
];
