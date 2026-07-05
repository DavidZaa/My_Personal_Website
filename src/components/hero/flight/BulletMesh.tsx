"use client";

/** One pooled bolt; the scene positions/toggles it each frame via its parent
 * group's children. Starts hidden until the sim places it. */
export function BulletMesh() {
  return (
    <mesh visible={false}>
      <sphereGeometry args={[0.12, 8, 8]} />
      <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={3} toneMapped={false} />
    </mesh>
  );
}
