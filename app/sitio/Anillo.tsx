"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import s from "./sitio.module.css";

export const C = 2 * Math.PI * 54; // circunferencia del anillo (radio 54)

// Cuenta de 0 a `hasta` con desaceleración (para el puntaje del resultado).
export function useContar(hasta: number, activo: boolean, ms = 1400) {
  const [n, setN] = useState(0);
  const quieto = useReducedMotion();
  useEffect(() => {
    if (!activo || quieto) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const x = Math.min(1, (t - t0) / ms);
      setN(Math.round((1 - Math.pow(1 - x, 3)) * hasta));
      if (x < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hasta, activo, ms, quieto]);
  return quieto ? hasta : n;
}

// Anillo fino: arco de progreso y, mientras carga, una marca de luz que gira por fuera.
export function Anillo({ progreso, orbita = false, dibuja = false, size = 144, children }: { progreso: number; orbita?: boolean; dibuja?: boolean; size?: number; children?: React.ReactNode }) {
  const offset = C * (1 - progreso / 100);
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
        {orbita && (
          <g className={s.orbita}>
            <circle cx="60" cy="60" r="58" fill="none" stroke="rgba(106,169,255,0.7)" strokeWidth="1.5" strokeDasharray="1 60" strokeLinecap="round" />
          </g>
        )}
        <circle
          cx="60" cy="60" r="54" fill="none" stroke="#6aa9ff" strokeWidth="2" strokeLinecap="round"
          transform="rotate(-90 60 60)"
          className={dibuja ? s.dibuja : s.arco}
          style={dibuja ? ({ ["--final" as string]: offset } as React.CSSProperties) : { strokeDasharray: C, strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

