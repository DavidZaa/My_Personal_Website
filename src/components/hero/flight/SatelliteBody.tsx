"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Glow } from "../SystemBodies";
import { SATELLITE_POS } from "./satellite";

export function SatelliteBody() {
  const light = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!light.current) return;
    // Slow blink so it's spottable only once you're close.
    light.current.emissiveIntensity = 1.5 + Math.sin(clock.elapsedTime * 4) * 1.5;
  });

  return (
    <group position={[SATELLITE_POS.x, 0, SATELLITE_POS.z]}>
      {/* body */}
      <mesh>
        <boxGeometry args={[0.24, 0.24, 0.4]} />
        <meshStandardMaterial color="#9aa2c0" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* solar panels */}
      <mesh position={[0.4, 0, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.3]} />
        <meshStandardMaterial color="#1e3a8a" emissive="#1e3a8a" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.4, 0, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.3]} />
        <meshStandardMaterial color="#1e3a8a" emissive="#1e3a8a" emissiveIntensity={0.3} />
      </mesh>
      {/* blinking beacon */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial ref={light} color="#f472b6" emissive="#f472b6" toneMapped={false} />
      </mesh>
      <Glow size={1.2} color="#f472b6" opacity={0.5} />
    </group>
  );
}
