"use client";

/** One pooled asteroid; the scene positions/scales/toggles it each frame via
 * its parent group's children. Starts hidden until the sim places it. */
export function AsteroidMesh() {
  return (
    <mesh visible={false}>
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
