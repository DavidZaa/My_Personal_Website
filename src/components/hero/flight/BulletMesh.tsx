"use client";

import { type RefObject } from "react";
import * as THREE from "three";

/** One pooled bolt; the scene positions/toggles it each frame. */
export function BulletMesh({ meshRef }: { meshRef: RefObject<THREE.Mesh | null> }) {
  return (
    <mesh ref={meshRef} visible={false}>
      <sphereGeometry args={[0.12, 8, 8]} />
      <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={3} toneMapped={false} />
    </mesh>
  );
}
