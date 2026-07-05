"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Structure } from "./structures";

function Body({ kind }: { kind: Structure["kind"] }) {
  switch (kind) {
    case "station":
      return (
        <group>
          <mesh>
            <cylinderGeometry args={[0.8, 0.8, 1.4, 12]} />
            <meshStandardMaterial color="#c7d0f0" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.8, 0.16, 10, 32]} />
            <meshStandardMaterial color="#8ca0ff" emissive="#22d3ee" emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={3} toneMapped={false} />
          </mesh>
        </group>
      );
    case "platform":
      return (
        <group>
          <mesh>
            <boxGeometry args={[2.6, 0.24, 1.6]} />
            <meshStandardMaterial color="#aab4d8" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[1.4, 0, 0]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[1.4, 0.05, 1.1]} />
            <meshStandardMaterial color="#1e3a8a" emissive="#2563eb" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[-1.4, 0, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[1.4, 0.05, 1.1]} />
            <meshStandardMaterial color="#1e3a8a" emissive="#2563eb" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <coneGeometry args={[0.4, 0.5, 12]} />
            <meshStandardMaterial color="#e6e8f5" emissive="#22d3ee" emissiveIntensity={0.8} />
          </mesh>
        </group>
      );
    case "depot":
      return (
        <group>
          {[
            [0, 0, 0],
            [0.9, 0.2, 0.3],
            [-0.7, 0.1, -0.5],
            [0.2, 0.9, -0.2],
          ].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]} rotation={[0, i * 0.6, 0]}>
              <boxGeometry args={[0.9, 0.8, 0.9]} />
              <meshStandardMaterial
                color={i % 2 ? "#8ca0ff" : "#c7d0f0"}
                emissive="#8b5cf6"
                emissiveIntensity={0.5}
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
          ))}
        </group>
      );
    case "gate":
      return (
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[2.6, 0.28, 12, 40]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.8} toneMapped={false} />
          </mesh>
          <mesh>
            <torusGeometry args={[2.6, 0.6, 4, 40]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.08} side={THREE.DoubleSide} />
          </mesh>
        </group>
      );
    case "orbitalRing":
      return (
        <mesh rotation={[Math.PI / 2.4, 0, 0.3]}>
          <torusGeometry args={[1, 0.02, 8, 80]} />
          <meshStandardMaterial color="#8ca0ff" emissive="#8b5cf6" emissiveIntensity={1} toneMapped={false} />
        </mesh>
      );
    case "mothership":
      return (
        <group>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.9, 4, 6]} />
            <meshStandardMaterial color="#3a4a7a" emissive="#22d3ee" emissiveIntensity={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[2.2, 0.3, 1.2]} />
            <meshStandardMaterial color="#2a3560" emissive="#8b5cf6" emissiveIntensity={0.4} />
          </mesh>
        </group>
      );
    case "ringedPlanet":
      return (
        <group>
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#4c5aa0" emissive="#22304f" emissiveIntensity={0.4} roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2.6, 0, 0]}>
            <torusGeometry args={[1.8, 0.12, 2, 64]} />
            <meshStandardMaterial color="#8ca0ff" emissive="#8b5cf6" emissiveIntensity={0.5} side={THREE.DoubleSide} />
          </mesh>
        </group>
      );
  }
}

export function StructureMesh({ structure }: { structure: Structure }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += structure.spin * delta;
  });
  return (
    <group position={[structure.x, structure.y ?? 0, structure.z]} scale={structure.scale}>
      <group ref={ref}>
        <Body kind={structure.kind} />
      </group>
    </group>
  );
}
