"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Lead } from "./lead";
import { textos } from "./textos";
import b from "./base.module.css";
import a from "./despiece.module.css";

type Trazo = { id: string; d: string };
type Tops = Record<string, number>;

// El sitio del lead al centro; las notas a los lados salen de la zona exacta de la captura con una línea fina.
// Las líneas se miden en el DOM, así siguen pegadas a la zona en cualquier ancho.
export function Despiece({ lead: LEAD }: { lead: Lead }) {
  const board = useRef<HTMLDivElement>(null);
  const [trazos, setTrazos] = useState<Trazo[]>([]);
  const [tops, setTops] = useState<Tops>({});
  const [activo, setActivo] = useState<string | null>(null);

  const medir = useCallback(() => {
    const el = board.current;
    if (!el) return;
    if (window.matchMedia("(max-width: 1080px)").matches) { setTrazos([]); setTops({}); return; }
    const o = el.getBoundingClientRect();
    const nuevos: Trazo[] = [];
    const nt: Tops = {};
    // 1) Dónde cae cada nota (a la altura de su zona) y de qué lado va.
    const items = LEAD.hallazgos.map((h, i) => {
      const caja = el.querySelector<HTMLElement>(`[data-hl="${h.id}"]`);
      const nota = el.querySelector<HTMLElement>(`[data-note="${h.id}"]`);
      if (!caja || !nota) return null;
      const c = caja.getBoundingClientRect();
      const n = nota.getBoundingClientRect();
      const alto = nota.querySelector("div")?.getBoundingClientRect().height ?? 80;
      return { id: h.id, izq: i % 2 === 0, c, n, alto, ideal: c.top + c.height / 2 - o.top, top: c.top + c.height / 2 - o.top };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
    // 2) Si dos notas del mismo lado quedan una encima de la otra, la de abajo se corre lo justo para no pisarse.
    for (const izq of [true, false]) {
      const lado = items.filter((x) => x.izq === izq).sort((p, q) => p.ideal - q.ideal);
      for (let k = 1; k < lado.length; k++) {
        const minimo = lado[k - 1].top + lado[k - 1].alto / 2 + lado[k].alto / 2 + 20;
        if (lado[k].top < minimo) lado[k].top = minimo;
      }
    }
    // 3) Cada línea sale de la nota (ya corrida) y llega al centro de su zona en la captura.
    for (const x of items) {
      const x1 = (x.izq ? x.n.right : x.n.left) - o.left + (x.izq ? 14 : -14);
      const y2 = x.ideal;
      const x2 = (x.izq ? x.c.left : x.c.right) - o.left;
      const mx = (x1 + x2) / 2;
      nt[x.id] = x.top;
      nuevos.push({ id: x.id, d: `M${x1} ${x.top} C ${mx} ${x.top}, ${mx} ${y2}, ${x2} ${y2}` });
    }
    setTrazos(nuevos);
    setTops(nt);
  }, [LEAD]);

  useEffect(() => {
    const el = board.current;
    if (!el) return;
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    window.addEventListener("resize", medir);
    document.fonts?.ready.then(medir);
    return () => { ro.disconnect(); window.removeEventListener("resize", medir); };
  }, [medir]);

  return (
    <div>
      <div ref={board} className={a.board} data-activo={activo ?? ""}>
        <div className={a.centro}>
          <div className={b.browser}>
            <div className={b.browserBar}>
              <div className={b.dots}><i /><i /><i /></div>
              <div className={b.addr}>{LEAD.dominio}</div>
            </div>
            <div className={b.stage}>
              <Image src={LEAD.captura.src} alt={textos(LEAD.idioma ?? "en").altCaptura(LEAD.negocio)} width={LEAD.captura.w} height={LEAD.captura.h} priority sizes="(max-width: 1080px) 100vw, 600px" />
              {LEAD.hallazgos.map((h, i) => (
                <div key={h.id} data-hl={h.id} className={`${b.hl} ${a.hl}`} data-on={activo === null || activo === h.id ? 1 : 0}
                  style={{ left: `${h.caja.x}%`, top: `${h.caja.y}%`, width: `${h.caja.w}%`, height: `${h.caja.h}%` }}>
                  <span className={b.hlNum}>{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {LEAD.hallazgos.map((h, i) => (
          <div key={h.id} data-note={h.id} className={`${a.nota} ${i % 2 === 0 ? a.izq : a.der}`} data-on={activo === null || activo === h.id ? 1 : 0}
            style={{ ["--y" as string]: (h.caja.y + h.caja.h / 2) / 100, ...(tops[h.id] !== undefined ? { ["--top" as string]: `${tops[h.id]}px` } : {}) }}
            onPointerEnter={() => setActivo(h.id)} onPointerLeave={() => setActivo(null)}>
            <span className={a.notaNum}>{i + 1}</span>
            <div className={a.notaIn}>
              <strong>{h.titulo}</strong>
              <span>{h.detalle}</span>
            </div>
          </div>
        ))}

        <svg className={a.leaders} aria-hidden="true">
          {trazos.map((t) => (
            <g key={t.id} data-on={activo === null || activo === t.id ? 1 : 0}>
              <path d={t.d} pathLength={1} className={a.trazo} />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
