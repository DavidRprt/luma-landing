"use client";

import { MotionConfig, motion } from "motion/react";
import s from "./base.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

// Quien pide menos movimiento ve todo quieto: MotionConfig apaga las animaciones de transformación.
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

// Entrada suave la primera vez que algo aparece en pantalla. El contenido ya es visible sin JS.
export function Reveal({ children, delay = 0, className = "", as = "div" }: { children: React.ReactNode; delay?: number; className?: string; as?: "div" | "li" }) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={`${s.rv} ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}
