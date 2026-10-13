"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import s from "./base.module.css";
import { textos, type Idioma } from "./textos";
import { WhatsAppIcon } from "../../sitio/WhatsAppIcon";

// Los botones guardan la respuesta del negocio (si la página tiene token) y cambian lo que se ve.
type Estado = "idle" | "hecho" | "rechazo";
type Ctx = { mail: string | null; telefono: string | null; idioma: Idioma; estado: Estado; setEstado: (e: Estado, telefono?: string) => void; ctaVisible: boolean; setCtaVisible: (v: boolean) => void };
const DemoCtx = createContext<Ctx>({ mail: null, telefono: null, idioma: "en", estado: "idle", setEstado: () => {}, ctaVisible: true, setCtaVisible: () => {} });

export const useDemo = () => useContext(DemoCtx);

export function DemoProvider({ children, token, idioma = "en" }: { children: React.ReactNode; token?: string; idioma?: Idioma }) {
  const [estado, setEstadoLocal] = useState<Estado>("idle");
  const [ctaVisible, setCtaVisible] = useState(true);
  const [mail, setMail] = useState<string | null>(null);
  const [telefono, setTelefono] = useState<string | null>(null);
  const setEstado = (e: Estado, tel?: string) => {
    setEstadoLocal(e);
    if (tel) setTelefono(tel);
    if (token && e !== "idle") {
      fetch(`/h/${token}/respuesta`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ respuesta: e === "hecho" ? "demo" : "no", ...(tel ? { telefono: tel } : {}) }), keepalive: true })
        .then((r) => r.json())
        .then((j) => { if (typeof j?.mail === "string") setMail(j.mail); })
        .catch(() => {});
    }
  };
  return <DemoCtx.Provider value={{ mail, telefono, idioma, estado, setEstado, ctaVisible, setCtaVisible }}>{children}</DemoCtx.Provider>;
}

const Flecha = () => (
  <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// El botón de pedir la demo. En español es una píldora con un campo para el WhatsApp antes de pedir; en inglés, un botón.
function BotonDemo({ tam, texto }: { tam?: "lg" | "sm"; texto?: string }) {
  const { idioma, setEstado } = useContext(DemoCtx);
  const t = textos(idioma);
  const [tel, setTel] = useState("");
  const [mal, setMal] = useState(false);
  const clase = `${s.pill} ${tam === "lg" ? s.pillLg : tam === "sm" ? s.pillSm : ""}`;
  if (idioma !== "es") {
    return (
      <button type="button" className={clase} onClick={() => setEstado("hecho")}>
        {texto ?? t.cta} <Flecha />
      </button>
    );
  }
  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault();
    const d = tel.replace(/\D/g, "").length;
    if (d < 8 || d > 15) { setMal(true); return; }
    setEstado("hecho", tel.trim());
  };
  const idErr = "pedido-error";
  return (
    <form className={`${s.pedido} ${tam === "sm" ? s.pedidoSm : tam === "lg" ? s.pedidoLg : ""}`} onSubmit={enviar} noValidate>
      <label className={s.pedidoCampo} data-mal={mal ? 1 : 0}>
        <WhatsAppIcon size={18} />
        <input
          type="tel" inputMode="tel" autoComplete="tel" name="whatsapp" placeholder={t.telPlaceholder} value={tel}
          onChange={(e) => { setTel(e.target.value); setMal(false); }} aria-label={t.telPlaceholder}
          aria-invalid={mal} aria-describedby={mal ? idErr : undefined}
        />
      </label>
      <button type="submit" className={clase}>{texto ?? t.cta} <Flecha /></button>
      {mal && <p id={idErr} className={s.pedidoError} role="alert">{t.telError}</p>}
    </form>
  );
}

// Botón principal de la primera pantalla. Avisa si se ve, para mostrar la barra fija cuando se pierde de vista.
export function PrimaryCta({ nota = true, track = true, texto }: { nota?: boolean; track?: boolean; texto?: string }) {
  const { idioma, estado, setCtaVisible } = useContext(DemoCtx);
  const t = textos(idioma);
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
        <span className={`${s.pill} ${s.pillDone}`} role="status">{t.ctaHecho}</span>
      ) : (
        <>
          <BotonDemo texto={texto} />
          {nota && <span className={s.note}>{t.ctaNota}</span>}
        </>
      )}
    </div>
  );
}

// Barra fija: aparece cuando el botón de arriba ya no se ve, para que siempre haya uno a mano.
export function StickyDemo() {
  const { mail, idioma, estado, ctaVisible } = useContext(DemoCtx);
  const t = textos(idioma);
  // Al pedir la demo la barra no desaparece: se convierte en el mensaje de confirmación mientras el botón de arriba no se ve.
  const on = estado !== "rechazo" && !ctaVisible;
  return (
    <div className={s.sticky} data-on={on ? 1 : 0} data-hecho={estado === "hecho" ? 1 : 0} aria-hidden={!on}>
      {estado === "hecho" ? (
        <span className={s.stickyMsg} role="status">{t.stickyHecho(mail)}</span>
      ) : (
        <>
          <span>{t.stickyTxt}</span>
          <BotonDemo tam="sm" texto={t.ctaCorto} />
        </>
      )}
    </div>
  );
}

export function ClosingCta({ negocio }: { negocio: string }) {
  const { mail, telefono, idioma, estado, setEstado } = useContext(DemoCtx);
  const t = textos(idioma);

  if (estado === "hecho") {
    return (
      <div className={s.closeBox} role="status">
        <h2 className={s.h2}>{t.graciasH(negocio)}</h2>
        <p className={s.closeP}>{t.graciasP(mail, telefono)}</p>
        <p className={s.closeP}>{t.graciasAlt} <a href="mailto:hello@underluma.com">hello@underluma.com</a>.</p>
        <span className={s.sign}>{t.firma}</span>
      </div>
    );
  }
  if (estado === "rechazo") {
    return (
      <div className={s.closeBox} role="status">
        <h2 className={s.h2}>{t.noH}</h2>
        <p className={s.closeP}>{t.noP}</p>
      </div>
    );
  }
  return (
    <div className={s.closeBox}>
      <h2 className={s.h2}>{t.quieresA}<em>{t.quieresB}</em></h2>
      <p className={s.closeP}>{t.quieresP}</p>
      <div className={s.ctaRow}>
        <BotonDemo tam="lg" />
        <button type="button" className={s.ghost} onClick={() => setEstado("rechazo")}>{t.noGracias}</button>
      </div>
    </div>
  );
}
