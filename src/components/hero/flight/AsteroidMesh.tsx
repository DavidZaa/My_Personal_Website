"use client";

import { type RefObject } from "react";
import * as THREE from "three";

/** One pooled asteroid; the scene positions/scales/toggles it each frame. */
export function AsteroidMesh({ meshRef }: { meshRef: RefObject<THREE.Mesh | null> }) {
  return (
    <mesh ref={meshRef} visible={false}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#8ca0ff"
        emissive="#3a4a8a"
        emissiveIntensity={0.5}
        flatShading
        roughness={0.8}
      />
    </mesh>
  );
}
