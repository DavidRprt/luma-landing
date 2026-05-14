"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FloatingSphere = ({
  position,
  radius,
  speed,
  color,
  wireframe = false,
}: {
  position: [number, number, number];
  radius: number;
  speed: number;
  color: string;
  wireframe?: boolean;
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const origin = useRef(position);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    mesh.current.position.y = origin.current[1] + Math.sin(t * speed) * 0.4;
    mesh.current.position.x = origin.current[0] + Math.cos(t * speed * 0.7) * 0.2;
    mesh.current.rotation.x = t * speed * 0.3;
    mesh.current.rotation.y = t * speed * 0.5;
  });

  return (
    <mesh ref={mesh} position={position}>
      <icosahedronGeometry args={[radius, wireframe ? 1 : 4]} />
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        roughness={0.1}
        metalness={0.8}
        emissive={color}
        emissiveIntensity={wireframe ? 0.6 : 0.15}
      />
    </mesh>
  );
};

const RingOrbit = ({ radius, speed, color }: { radius: number; speed: number; color: string }) => {
  const group = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    group.current.rotation.y = clock.getElapsedTime() * speed;
    group.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.3;
  });

  return (
    <group ref={group}>
      <mesh>
        <torusGeometry args={[radius, 0.015, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          roughness={0}
          metalness={1}
        />
      </mesh>
    </group>
  );
};

const AbstractScene = () => {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Central large icosahedron */}
      <FloatingSphere position={[0, 0, 0]} radius={2} speed={0.4} color="#a259ff" />

      {/* Wireframe overlay */}
      <FloatingSphere position={[0, 0, 0]} radius={2.05} speed={0.4} color="#c77dff" wireframe />

      {/* Orbiting rings */}
      <RingOrbit radius={3.2} speed={0.3} color="#4cc9f0" />
      <RingOrbit radius={4} speed={-0.18} color="#7b2fff" />
      <RingOrbit radius={5} speed={0.12} color="#4361ee" />

      {/* Satellite spheres */}
      <FloatingSphere position={[3.5, 1, 0]} radius={0.35} speed={0.9} color="#4cc9f0" />
      <FloatingSphere position={[-3, -1, 1]} radius={0.25} speed={1.1} color="#f72585" />
      <FloatingSphere position={[1.5, 3, -1]} radius={0.2} speed={0.7} color="#7209b7" />
      <FloatingSphere position={[-2, 2.5, 0]} radius={0.15} speed={1.3} color="#4cc9f0" wireframe />
    </group>
  );
};

export default AbstractScene;
