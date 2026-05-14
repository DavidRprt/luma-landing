import { useMemo } from "react";
import * as THREE from "three";

const HeroLights = () => {
  const rectLight = useMemo(() => new THREE.RectAreaLight("#4361ee", 10, 3, 2), []);

  return (
    <>
      <spotLight position={[2, 5, 6]} angle={0.15} penumbra={0.2} intensity={120} color="#e0f0ff" />
      <spotLight position={[4, 5, 4]} angle={0.3} penumbra={0.5} intensity={60} color="#4cc9f0" />
      <spotLight position={[-3, 5, 5]} angle={0.4} penumbra={1} intensity={80} color="#7b2fff" />
      <primitive
        object={rectLight}
        position={[1, 3, 4]}
        rotation={[-Math.PI / 4, Math.PI / 4, 0]}
      />
      <pointLight position={[0, 1, 0]} intensity={15} color="#4cc9f0" />
      <pointLight position={[1, 2, -2]} intensity={12} color="#0d00a4" />
    </>
  );
};

export default HeroLights;
