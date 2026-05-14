"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Particles = ({ count = 200 }: { count?: number }) => {
  const mesh = useRef<THREE.Points>(null!);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds: number[] = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 10 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      speeds.push(0.005 + Math.random() * 0.001);
    }
    return { positions, speeds };
  }, [count]);

  useFrame(() => {
    const pos = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      let y = pos[i * 3 + 1];
      y -= speeds[i];
      if (y < -2) y = Math.random() * 10 + 5;
      pos[i * 3 + 1] = y;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.05} transparent opacity={0.9} depthWrite={false} />
    </points>
  );
};

export default Particles;
