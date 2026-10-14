"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { ProyectoModal } from "./ProyectoModal";
import type { Work } from "../components/WorkCard";
import s from "./sitio.module.css";

const CADA = 7000; // ms que dura cada proyecto cuando avanza solo

// Vitrina: nombres a la izquierda, una imagen grande a la derecha que cambia con la selección.
// Avanza sola hasta que la persona elige uno (después queda quieta y la elección manda).
export function Proyectos({ items }: { items: Work[] }) {
  const [activo, setActivo] = useState(0);
  const [manual, setManual] = useState(false);
  const [enPantalla, setEnPantalla] = useState(false);
  const [popup, setPopup] = useState(false); // con un popup abierto la vitrina no avanza
  const raiz = useRef<HTMLDivElement>(null);
  const quieto = useReducedMotion();
  const auto = !manual && !quieto && enPantalla && !popup;

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setEnPantalla(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const id = window.setTimeout(() => setActivo((a) => (a + 1) % items.length), CADA);
    return () => window.clearTimeout(id);
  }, [auto, activo, items.length]);

  const elegir = (i: number) => { setActivo(i); setManual(true); };
  const w = items[activo];

  return (
    <div ref={raiz} className={s.show}>
      <ul className={s.showLista}>
        {items.map((p, i) => (
          <li key={p.img} className={s.showItem} data-on={auto && activo === i ? 1 : 0} data-manual={manual && activo === i ? 1 : 0} style={{ ["--ms" as string]: `${CADA}ms` }}>
            <button
              type="button"
              className={s.showBtn}
              aria-current={activo === i}
              onClick={() => elegir(i)}
              onPointerEnter={(e) => { if (e.pointerType === "mouse") elegir(i); }}
              onFocus={() => elegir(i)}
            >
              <span className={s.showNombre}>{p.title}</span>
              <span className={s.showCat}>{p.category}</span>
            </button>
            <span className={s.showProg} aria-hidden="true" />
          </li>
        ))}
      </ul>

      <div className={s.showVista}>
        <div className={s.vitrina}>
          {items.map((p, i) => (
            <Image
              key={p.img}
              src={`/${p.img}.png`}
              alt={activo === i ? `Sitio de ${p.title}` : ""}
              aria-hidden={activo !== i}
              width={1800}
              height={1020}
              sizes="(min-width: 1024px) 640px, 100vw"
              data-on={activo === i ? 1 : 0}
              priority={i === 0}
            />
          ))}
        </div>
        <div className={s.showPie} key={w.img} aria-live="polite">
          <div className={s.fadeIn}>
            <p className={s.body}>{w.desc}</p>
            {w.stat && <p className={s.showStat}>{w.stat}</p>}
            <div className={s.showMas}>
              <ProyectoModal w={w} onCambio={setPopup}>
                <button type="button" aria-label={`Ver más sobre ${w.title}`} className={`${s.link} ${s.linkBtn}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 500, fontSize: 16 }}>
                  Ver más <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </ProyectoModal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
