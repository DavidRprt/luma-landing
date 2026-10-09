"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import s from "./base.module.css";

// Los botones guardan la respuesta del negocio (si la página tiene token) y cambian lo que se ve.
type Estado = "idle" | "hecho" | "rechazo";
type Ctx = { estado: Estado; setEstado: (e: Estado) => void; ctaVisible: boolean; setCtaVisible: (v: boolean) => void };
const DemoCtx = createContext<Ctx>({ estado: "idle", setEstado: () => {}, ctaVisible: true, setCtaVisible: () => {} });

export const useDemo = () => useContext(DemoCtx);

export function DemoProvider({ children, token }: { children: React.ReactNode; token?: string }) {
  const [estado, setEstadoLocal] = useState<Estado>("idle");
  const [ctaVisible, setCtaVisible] = useState(true);
  const setEstado = (e: Estado) => {
    setEstadoLocal(e);
    if (token && e !== "idle") {
      fetch(`/h/${token}/respuesta`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ respuesta: e === "hecho" ? "demo" : "no" }), keepalive: true }).catch(() => {});
    }
  };
  return <DemoCtx.Provider value={{ estado, setEstado, ctaVisible, setCtaVisible }}>{children}</DemoCtx.Provider>;
}

const Flecha = () => (
  <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Botón principal de la primera pantalla. Avisa si se ve, para mostrar la barra fija cuando se pierde de vista.
export function PrimaryCta({ nota = true, track = true, texto = "Yes, show me a preview" }: { nota?: boolean; track?: boolean; texto?: string }) {
  const { estado, setEstado, setCtaVisible } = useContext(DemoCtx);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !track) return;
    const io = new IntersectionObserver(([e]) => setCtaVisible(e.isIntersecting), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [setCtaVisible, track]);

  return (
    <div ref={ref} className={s.ctaRow}>
      {estado === "hecho" ? (
        <span className={`${s.pill} ${s.pillDone}`} role="status">Requested. Your demo is on its way</span>
      ) : (
        <>
          <button type="button" className={s.pill} onClick={() => setEstado("hecho")}>
            {texto} <Flecha />
          </button>
          {nota && <span className={s.note}>A preview is free. Nothing to fill in.</span>}
        </>
      )}
    </div>
  );
}

// Barra fija: aparece cuando el botón de arriba ya no se ve, para que siempre haya uno a mano.
export function StickyDemo() {
  const { estado, setEstado, ctaVisible } = useContext(DemoCtx);
  const on = estado === "idle" && !ctaVisible;
  return (
    <div className={s.sticky} data-on={on ? 1 : 0} aria-hidden={!on}>
      <span>A free preview of your new website</span>
      <button type="button" className={`${s.pill} ${s.pillSm}`} tabIndex={on ? 0 : -1} onClick={() => setEstado("hecho")}>
        Yes, show me a preview <Flecha />
      </button>
    </div>
  );
}

export function ClosingCta({ negocio }: { negocio: string }) {
  const { estado, setEstado } = useContext(DemoCtx);

  if (estado === "hecho") {
    return (
      <div className={s.closeBox} role="status">
        <h2 className={s.h2}>Thanks, {negocio}.</h2>
        <p className={s.closeP}>David and the team will build a preview of your new website and email it to you. You don’t need to do anything else.</p>
        <span className={s.sign}>David &amp; the _luma team</span>
      </div>
    );
  }
  if (estado === "rechazo") {
    return (
      <div className={s.closeBox} role="status">
        <h2 className={s.h2}>No problem at all.</h2>
        <p className={s.closeP}>We won’t write again. If you ever change your mind, this page stays here for a few weeks.</p>
      </div>
    );
  }
  return (
    <div className={s.closeBox}>
      <h2 className={s.h2}>Want to see your <em>new website?</em></h2>
      <p className={s.closeP}>We’ll build a preview of your new website with these ideas and email it to you. It’s free to look at, and you only decide to launch it if you like it.</p>
      <div className={s.ctaRow}>
        <button type="button" className={`${s.pill} ${s.pillLg}`} onClick={() => setEstado("hecho")}>
          Yes, show me a preview <Flecha />
        </button>
        <button type="button" className={s.ghost} onClick={() => setEstado("rechazo")}>No thanks</button>
      </div>
    </div>
  );
}
