"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { initialShipState, isOutOfBounds, stepShip } from "./physics";
import { resolveFlightInput } from "./controls";
import { useFlightControls } from "./useFlightControls";
import { isNearSatellite } from "./satellite";

export function Ship({
  onBoundary,
  onNearSatellite,
}: {
  onBoundary: (out: boolean) => void;
  onNearSatellite: () => void;
}) {
  const input = useFlightControls();
  const state = useRef(initialShipState());
  const group = useRef<THREE.Group>(null);
  const wasOut = useRef(false);
  const firedEgg = useRef(false);

  useFrame(({ camera }, rawDelta) => {
    // Cap dt so a tab-switch stall can't teleport the ship across the arena.
    const dt = Math.min(rawDelta, 0.05);
    const next = stepShip(state.current, resolveFlightInput(input.current), dt);
    state.current = next;

    if (group.current) {
      group.current.position.set(next.x, 0, next.z);
      // Nose points along the heading (0 = +x) in the xz-plane.
      group.current.rotation.y = -next.heading + Math.PI / 2;
    }

    // Chase camera: sit behind and above the ship, look ahead of it.
    const behind = new THREE.Vector3(
      next.x - Math.cos(next.heading) * 6,
      4.5,
      next.z - Math.sin(next.heading) * 6,
    );
    camera.position.lerp(behind, 0.08);
    camera.lookAt(next.x, 0, next.z);

    const out = isOutOfBounds(next);
    if (out !== wasOut.current) {
      wasOut.current = out;
      onBoundary(out);
    }

    if (!firedEgg.current && isNearSatellite(next)) {
      firedEgg.current = true;
      onNearSatellite();
    }
  });

  return (
    <group ref={group}>
      {/* hull */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.22, 0.9, 16]} />
        <meshStandardMaterial
          color="#e6e8f5"
          emissive="#8b5cf6"
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* engine glow */}
      <mesh position={[0, 0, -0.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </mesh>
      <pointLight intensity={6} distance={6} color="#8b5cf6" />
    </group>
  );
}
