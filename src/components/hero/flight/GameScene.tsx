"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFlightControls } from "./useFlightControls";
import { resolveFlightInput } from "./controls";
import { newGame, startRun, stepGame, type GameState } from "./game";
import { loadBestScore } from "./store";
import { ASTEROID } from "./asteroid";
import { BULLET } from "./bullet";
import { ShipMesh } from "./ShipMesh";
import { AsteroidMesh } from "./AsteroidMesh";
import { BulletMesh } from "./BulletMesh";

export type HudState = {
  status: GameState["status"];
  score: number;
  best: number;
  lives: number;
  wave: number;
};

const MAX_ASTEROIDS = 90;

export function GameScene({ onHud }: { onHud: (hud: HudState) => void }) {
  const input = useFlightControls();
  const state = useRef<GameState>(newGame(loadBestScore()));
  const prevFire = useRef(false);
  const lastHud = useRef("");

  const shipRef = useRef<THREE.Group>(null);
  const asteroidGroup = useRef<THREE.Group>(null);
  const bulletGroup = useRef<THREE.Group>(null);

  useFrame(({ camera }, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const resolved = resolveFlightInput(input.current);

    // Space starts / restarts on the non-playing screens (rising edge).
    const firePressed = Boolean(resolved.fire);
    if (state.current.status !== "playing") {
      if (firePressed && !prevFire.current) state.current = startRun(state.current);
    } else {
      state.current = stepGame(state.current, resolved, dt);
    }
    prevFire.current = firePressed;

    const g = state.current;

    // Ship transform; blink visibility while invulnerable.
    if (shipRef.current) {
      shipRef.current.position.set(g.ship.x, 0, g.ship.z);
      shipRef.current.rotation.y = -g.ship.heading + Math.PI / 2;
      shipRef.current.visible = g.invuln > 0 ? Math.floor(g.invuln * 12) % 2 === 0 : true;
    }

    // Pooled asteroids — driven via the parent group's children.
    const rocks = asteroidGroup.current?.children;
    if (rocks) {
      for (let i = 0; i < rocks.length; i++) {
        const mesh = rocks[i];
        const a = g.asteroids[i];
        if (a) {
          mesh.visible = true;
          mesh.position.set(a.x, 0, a.z);
          mesh.rotation.y += a.spin * dt;
          mesh.scale.setScalar(ASTEROID[a.size].radius);
        } else {
          mesh.visible = false;
        }
      }
    }

    // Pooled bolts.
    const bolts = bulletGroup.current?.children;
    if (bolts) {
      for (let i = 0; i < bolts.length; i++) {
        const mesh = bolts[i];
        const b = g.bullets[i];
        if (b) {
          mesh.visible = true;
          mesh.position.set(b.x, 0, b.z);
        } else {
          mesh.visible = false;
        }
      }
    }

    // Chase camera: behind and above the ship, following its heading — the
    // immersive fly-through-space view, pulled back/up a little so incoming
    // rocks still read.
    const back = 8.5;
    camera.position.lerp(
      new THREE.Vector3(
        g.ship.x - Math.cos(g.ship.heading) * back,
        6.5,
        g.ship.z - Math.sin(g.ship.heading) * back,
      ),
      0.09,
    );
    camera.lookAt(g.ship.x, 0, g.ship.z);

    // Report HUD only when a shown field changes.
    const key = `${g.status}|${g.score}|${g.best}|${g.lives}|${g.wave}`;
    if (key !== lastHud.current) {
      lastHud.current = key;
      onHud({ status: g.status, score: g.score, best: g.best, lives: g.lives, wave: g.wave });
    }
  });

  return (
    <>
      <ShipMesh groupRef={shipRef} />
      <group ref={asteroidGroup}>
        {Array.from({ length: MAX_ASTEROIDS }).map((_, i) => (
          <AsteroidMesh key={i} />
        ))}
      </group>
      <group ref={bulletGroup}>
        {Array.from({ length: BULLET.max }).map((_, i) => (
          <BulletMesh key={i} />
        ))}
      </group>
    </>
  );
}
