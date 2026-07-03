"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Stars } from "@react-three/drei";
import * as THREE from "three";
import { PLANETS, type PlanetSpec } from "./planets";

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

function Glow({
  size,
  color,
  opacity = 1,
}: {
  size: number;
  color: string;
  opacity?: number;
}) {
  const map = useMemo(getGlowTexture, []);
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

function Sun() {
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
