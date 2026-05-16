"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const Laptop = () => {
  const group = useRef<THREE.Group>(null!);
  const screenGroup = useRef<THREE.Group>(null!);
  const glowRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // gentle float
    group.current.position.y = Math.sin(t * 0.6) * 0.12;
    group.current.rotation.y = Math.sin(t * 0.25) * 0.15 - 0.1;
    // screen glow pulse
    if (glowRef.current) {
      glowRef.current.emissiveIntensity = 0.7 + Math.sin(t * 1.5) * 0.15;
    }
  });

  const bodyColor = "#1a1a1a";
  const screenBg = "#0d0d1a";
  const accentColor = "#a259ff";

  return (
    <group ref={group} position={[0, -0.5, 0]}>
      {/* Base / keyboard */}
      <RoundedBox args={[4, 0.12, 2.8]} radius={0.06} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color={bodyColor} roughness={0.15} metalness={0.9} />
      </RoundedBox>

      {/* Trackpad */}
      <mesh position={[0, 0.065, 0.55]}>
        <boxGeometry args={[1.1, 0.005, 0.7]} />
        <meshStandardMaterial color="#222222" roughness={0.05} metalness={0.95} />
      </mesh>

      {/* Keyboard area (subtle indented look) */}
      <mesh position={[0, 0.065, -0.2]}>
        <boxGeometry args={[3.4, 0.004, 1.5]} />
        <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Hinge */}
      <mesh position={[0, 0.1, -1.38]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 3.9, 24]} />
        <meshStandardMaterial color="#333" roughness={0.1} metalness={1} />
      </mesh>

      {/* Screen group — open ~110 degrees */}
      <group ref={screenGroup} position={[0, 0.06, -1.38]} rotation={[-1.92, 0, 0]}>
        {/* Lid back */}
        <RoundedBox args={[4, 0.08, 2.75]} radius={0.06} smoothness={4} position={[0, 0, 1.375]}>
          <meshStandardMaterial color={bodyColor} roughness={0.15} metalness={0.9} />
        </RoundedBox>

        {/* Screen bezel */}
        <mesh position={[0, 0.05, 1.375]}>
          <boxGeometry args={[3.75, 0.02, 2.5]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.3} />
        </mesh>

        {/* Screen display */}
        <mesh position={[0, 0.07, 1.375]}>
          <boxGeometry args={[3.55, 0.01, 2.3]} />
          <meshStandardMaterial
            ref={glowRef}
            color={screenBg}
            emissive={accentColor}
            emissiveIntensity={0.7}
            roughness={0}
            metalness={0}
          />
        </mesh>

        {/* Screen content lines (fake UI) */}
        {[-0.55, -0.2, 0.15, 0.5].map((y, i) => (
          <mesh key={i} position={[i % 2 === 0 ? -0.4 : 0.3, 0.08, 1.375 + y]}>
            <boxGeometry args={[i % 2 === 0 ? 1.8 : 1.2, 0.005, 0.04]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={0.5}
              roughness={0}
            />
          </mesh>
        ))}

        {/* Screen top bar */}
        <mesh position={[0, 0.08, 1.375 - 0.9]}>
          <boxGeometry args={[3.2, 0.005, 0.07]} />
          <meshStandardMaterial color="#4cc9f0" emissive="#4cc9f0" emissiveIntensity={0.6} />
        </mesh>

        {/* Notch camera */}
        <mesh position={[0, 0.09, 2.62]}>
          <cylinderGeometry args={[0.03, 0.03, 0.015, 16]} />
          <meshStandardMaterial color="#222" roughness={0.5} />
        </mesh>
      </group>

      {/* Screen glow light */}
      <pointLight position={[0, 1.5, -0.5]} intensity={6} color={accentColor} distance={5} />
    </group>
  );
};

export default Laptop;
