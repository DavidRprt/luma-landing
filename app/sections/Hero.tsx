"use client";

import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import Button from "../components/Button";
import { words } from "../constants";

const HeroExperience = dynamic(
  () => import("../components/models/hero_models/HeroExperience"),
  { ssr: false }
);

const Hero = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".hero-fade",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: "power2.out" }
    );
  }, []);

  return (
    <section id="hero" className="relative flex flex-col overflow-hidden" style={{ height: "100dvh" }}>

      <div className="absolute inset-0 z-0">
        <HeroExperience />
      </div>

      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(74,0,255,0.1) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-5 md:px-16">

        {/* line 1 */}
        <div className="hero-fade text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight">
          Sitios que
        </div>

        {/* sliding word — clipped container */}
        <div
          className="hero-fade overflow-hidden"
          style={{ height: "clamp(48px, 8vw, 88px)" }}
        >
          <div
            className="flex flex-col"
            style={{ animation: "wordSlider 21s infinite cubic-bezier(0.9, 0.01, 0.3, 0.99)" }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                className="bg-gradient-to-r from-[#4cc9f0] to-[#7b2fff] bg-clip-text text-transparent font-semibold tracking-tight leading-tight"
                style={{ fontSize: "clamp(40px, 7.5vw, 86px)", display: "block" }}
              >
                {word.text}
              </span>
            ))}
          </div>
        </div>

        {/* line 3 */}
        <div className="hero-fade text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight">
          y convierten.
        </div>

        <p className="hero-fade mt-6 text-white/50 text-base md:text-lg max-w-lg leading-relaxed">
          Diseño web moderno con IA integrada.<br className="hidden md:block" />
          Para negocios que quieren crecer.
        </p>

        <div className="hero-fade mt-8 flex items-center gap-6">
          <Button text="Ver trabajos" id="counter" />
          <a
            href="#contacto"
            className="text-white/40 hover:text-white/80 text-sm tracking-widest uppercase transition-colors duration-300"
          >
            Hablemos →
          </a>
        </div>
      </div>

    </section>
  );
};

export default Hero;
