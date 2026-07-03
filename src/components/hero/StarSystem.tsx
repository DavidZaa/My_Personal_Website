"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Stars } from "@react-three/drei";
import * as THREE from "three";
import { PLANETS, type PlanetSpec } from "./planets";

function Sun() {
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 1.2) * 0.04;
    core.current?.scale.setScalar(pulse);
    halo.current?.scale.setScalar(1.35 + Math.sin(t * 0.8) * 0.08);
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
      <mesh ref={halo}>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight intensity={60} distance={30} color="#ffd9a0" />
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
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
      {/* soft glow shell */}
      <mesh scale={1.6}>
        <sphereGeometry args={[spec.size, 16, 16]} />
        <meshBasicMaterial
          color={spec.color}
          transparent
          opacity={hovered ? 0.28 : 0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
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
  const rig = useRef<THREE.Group>(null);

  useFrame(({ camera, pointer }, delta) => {
    if (rig.current) {
      rig.current.rotation.y += delta * 0.03;
    }
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
      gl={{ antialias: true, alpha: true }}
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
