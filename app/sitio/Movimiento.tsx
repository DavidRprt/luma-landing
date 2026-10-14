"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import s from "./sitio.module.css";

// Aparición única al entrar en pantalla. El contenido se ve siempre: solo se oculta (después de cargar)
// lo que está por debajo del pliegue, y se revela cuando se acerca.
export function Reveal({ children, delay = 0, as = "div", className = "" }: { children: React.ReactNode; delay?: number; as?: "div" | "li" | "section"; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) return; // ya está a la vista
    el.dataset.rv = "hide";
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.dataset.rv = "show"; io.disconnect(); }
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as as "div";
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={`${s.rv} ${className}`} style={{ ["--d" as string]: `${delay}s` }}>
      {children}
    </Tag>
  );
}

// Pasos con una línea que se dibuja a medida que se hace scroll.
export function Pasos({ items }: { items: readonly { num: string; title: string; desc: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reducido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 70%"] });
  const p = useMotionValue(reducido ? 1 : 0);
  useMotionValueEvent(scrollYProgress, "change", (v) => { if (!reducido) p.set(v); });
  return (
    <div className={s.pasosWrap}>
      <span className={s.linea} aria-hidden="true"><motion.span className={s.lineaProg} style={{ scaleX: p }} /></span>
      <ol ref={ref} className={s.pasos}>
        {items.map((it, i) => (
          <Reveal as="li" key={it.num} delay={i * 0.08} className={s.paso}>
            <span className={s.nPaso} aria-hidden="true">{i + 1}</span>
            <h3 className={s.h3}>{it.title}</h3>
            <p className={s.body}>{it.desc}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

// El título del cierre crece y se aclara al llegar al centro de la pantalla.
export function CierreTitulo({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reducido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 45%"] });
  const p = useMotionValue(reducido ? 1 : 0);
  useMotionValueEvent(scrollYProgress, "change", (v) => { if (!reducido) p.set(v); });
  const scale = useTransform(p, [0, 1], [0.86, 1]);
  const opacity = useTransform(p, [0, 1], [0.25, 1]);
  return <motion.h2 ref={ref} className={s.cierreT} style={{ scale, opacity }}>{children}</motion.h2>;
}
