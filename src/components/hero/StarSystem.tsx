"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Stars } from "@react-three/drei";
import * as THREE from "three";
import { PLANETS, type PlanetSpec } from "./planets";
import { Glow, OrbitRing, Sun } from "./SystemBodies";

function Planet({
  spec,
  paused,
  onNavigate,
}: {
  spec: PlanetSpec;
  paused: boolean;
  onNavigate: (href: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!group.current) return;
    // Freeze the orbit while hovered so the planet is easy to click.
    if (!paused || !hovered) {
      const t = clock.elapsedTime * spec.speed + spec.phase;
      group.current.position.set(
        Math.cos(t) * spec.orbit,
        0,
        Math.sin(t) * spec.orbit,
      );
    }
  });

  return (
    <group ref={group}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(spec.href);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[spec.size, 32, 32]} />
        <meshStandardMaterial
          color={spec.color}
          emissive={spec.color}
          emissiveIntensity={hovered ? 2.4 : 0.7}
          roughness={0.35}
        />
      </mesh>
      {/* soft glow */}
      <Glow size={spec.size * 7} color={spec.color} opacity={hovered ? 0.9 : 0.4} />
      <Html center distanceFactor={9} style={{ pointerEvents: "none" }}>
        <span
          style={{
            fontFamily: "var(--font-telemetry), monospace",
            fontSize: "11px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            color: hovered ? "#ffffff" : "rgba(230, 232, 245, 0.55)",
            textShadow: hovered ? `0 0 14px ${spec.color}` : "none",
            transform: "translateY(26px)",
            transition: "color 150ms, text-shadow 150ms",
          }}
        >
          {spec.label}
        </span>
      </Html>
    </group>
  );
}

function SystemRig({ warpTarget }: { warpTarget: string | null }) {
  useFrame(({ camera, pointer }) => {
    if (warpTarget) {
      // Warp: accelerate the camera into the system before route change.
      camera.position.lerp(new THREE.Vector3(0, 1.2, 2.2), 0.08);
    } else {
      // Gentle pointer parallax.
      const target = new THREE.Vector3(pointer.x * 0.9, 3.4 + pointer.y * 0.5, 8.5);
      camera.position.lerp(target, 0.04);
    }
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function StarSystem() {
  const [warpTarget, setWarpTarget] = useState<string | null>(null);
  const rigGroup = useRef<THREE.Group>(null);

  // Planets warp-scroll to their voyage section instead of routing away.
  const navigate = (href: string) => {
    if (warpTarget) return;
    setWarpTarget(href);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setWarpTarget(null), 900);
    }, 420);
  };

  return (
    <Canvas
      camera={{ position: [0, 3.4, 8.5], fov: 50 }}
      // Opaque canvas: transparent WebGL + additive glows corrupt the
      // alpha channel and dim the page behind them (dark halos). The
      // scene paints its own void instead.
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => gl.setClearColor("#050510")}
      dpr={[1, 2]}
      aria-hidden
      style={{
        opacity: warpTarget ? 0.4 : 1,
        transition: "opacity 450ms ease-in",
      }}
    >
      <ambientLight intensity={0.25} />
      <Stars radius={60} depth={40} count={2600} factor={3.2} saturation={0} fade speed={0.6} />
      <group ref={rigGroup}>
        <Sun />
        {PLANETS.map((p) => (
          <group key={p.href}>
            <OrbitRing radius={p.orbit} />
            <Planet spec={p} paused={Boolean(warpTarget)} onNavigate={navigate} />
          </group>
        ))}
      </group>
      <SystemRig warpTarget={warpTarget} />
    </Canvas>
  );
}
