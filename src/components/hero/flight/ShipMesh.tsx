"use client";

import { type RefObject } from "react";
import * as THREE from "three";

/** Ship visual only — position/heading are set by the game scene via groupRef. */
export function ShipMesh({ groupRef }: { groupRef: RefObject<THREE.Group | null> }) {
  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.22, 0.9, 16]} />
        <meshStandardMaterial
          color="#e6e8f5"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0, -0.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      <pointLight intensity={6} distance={6} color="#8b5cf6" />
    </group>
  );
}
