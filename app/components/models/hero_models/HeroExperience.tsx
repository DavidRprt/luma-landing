"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import HeroLights from "./HeroLights";
import Particles from "./Particles";

const HeroExperience = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 60 }} style={{ position: "absolute", inset: 0 }}>
      <ambientLight intensity={0.1} color="#0d1b4b" />
      <Suspense fallback={null}>
        <HeroLights />
        <Particles count={160} />
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
