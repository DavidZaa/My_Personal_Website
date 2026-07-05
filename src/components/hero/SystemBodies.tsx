"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { PlanetSpec } from "./planets";

// Shared radial-gradient texture for every glow: soft white falloff that
// sprites tint per-body. A uniform-opacity sphere reads as a hard-edged
// disk; a gradient sprite reads as light.
let glowTexture: THREE.CanvasTexture | null = null;
function getGlowTexture(): THREE.CanvasTexture {
  if (glowTexture) return glowTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.5)");
  g.addColorStop(0.7, "rgba(255,255,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  glowTexture = new THREE.CanvasTexture(canvas);
  return glowTexture;
}

export function Glow({
  size,
  color,
  opacity = 1,
}: {
  size: number;
  color: string;
  opacity?: number;
}) {
  const map = useMemo(() => getGlowTexture(), []);
  return (
    <sprite scale={[size, size, 1]}>
      <spriteMaterial
        map={map}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}

export function Sun() {
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 1.2) * 0.04;
    core.current?.scale.setScalar(pulse);
    halo.current?.scale.setScalar(1 + Math.sin(t * 0.8) * 0.07);
  });

  return (
    <group>
      <mesh ref={core}>
        <sphereGeometry args={[0.85, 48, 48]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      <group ref={halo}>
        <Glow size={5.5} color="#f59e0b" opacity={0.55} />
        <Glow size={2.6} color="#ffd9a0" opacity={0.8} />
      </group>
      <pointLight intensity={60} distance={30} color="#ffd9a0" />
    </group>
  );
}

export function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.008, radius + 0.008, 128]} />
      <meshBasicMaterial
        color="#8ca0ff"
        transparent
        opacity={0.16}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Scenery planet for the flight scene: it orbits and glows on the same
 * config as the hero, but is inert — no hover, click, navigation, or label.
 */
export function PlanetBody({ spec }: { spec: PlanetSpec }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime * spec.speed + spec.phase;
    group.current.position.set(
      Math.cos(t) * spec.orbit,
      0,
      Math.sin(t) * spec.orbit,
    );
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[spec.size, 32, 32]} />
        <meshStandardMaterial
          color={spec.color}
          emissive={spec.color}
          emissiveIntensity={0.7}
          roughness={0.35}
        />
      </mesh>
      <Glow size={spec.size * 7} color={spec.color} opacity={0.4} />
    </group>
  );
}
