"use client";

import { useEffect, useId, useRef, useState } from "react";
import { WHATSAPP_URL, type PlanId } from "./constants";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { WhatsAppLink } from "./TrackedLink";
import { normalizarWhatsApp } from "@/lib/phone";
import { captureAttribution, getCookie, getFbc, newEventId, trackGa, trackMeta } from "@/lib/tracking";
import { t } from "../constants/translations";
import s from "./sitio.module.css";

type Status = "idle" | "loading" | "sent" | "error";
type Campo = "nombre" | "telefono" | "negocio";
type Placement = "hero" | "final" | "analisis" | "sin-sitio" | "plan" | "proyecto";

const planes = t.es.subscription.plans;

const PLANES: { id: PlanId; label: string }[] = [
  { id: "landing", label: "Landing" },
  { id: "corporativo", label: "Corporativo" },
  { id: "no-se", label: "No sé todavía" },
];
// Después del análisis ya hay una recomendación, así que no hace falta "No sé todavía".
const PLANES_ANALISIS: { id: PlanId; label: string; precio: string }[] = [
  { id: "landing", label: planes.landing.name, precio: `$${planes.landing.price}${planes.landing.priceSuffix}` },
  { id: "corporativo", label: planes.corporate.name, precio: `$${planes.corporate.price}${planes.corporate.priceSuffix}` },
];

// Formulario de contacto. Dos variantes:
// - "completo": nombre, WhatsApp, negocio y plan (el de siempre; también para quien todavía no tiene sitio).
// - "analisis": se usa después de mostrar el análisis; pide solo nombre y WhatsApp, y manda la dirección del sitio
//   que analizamos dentro del campo "negocio" para que llegue en el mismo mail de siempre.
export function LeadForm({
  placement, title, subtitle, variante = "completo", sitio, planInicial = "no-se", plano = false, boton, contexto, soloWhatsApp = false,
}: {
  placement: Placement; title?: string; subtitle?: string; variante?: "completo" | "analisis" | "corto"; sitio?: string;
  planInicial?: PlanId; plano?: boolean; boton?: string; contexto?: string; soloWhatsApp?: boolean;
}) {
  const uid = useId();
  const analisis = variante === "analisis";
  const corto = variante === "corto";
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [negocio, setNegocio] = useState("");
  const [plan, setPlan] = useState<PlanId>(planInicial);
  const [website, setWebsite] = useState(""); // campo trampa para bots
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [waUrl, setWaUrl] = useState(WHATSAPP_URL);
  const montadoEn = useRef(0);
  const empezado = useRef(false);
  const nombreRef = useRef<HTMLInputElement>(null);
  const telefonoRef = useRef<HTMLInputElement>(null);
  const negocioRef = useRef<HTMLInputElement>(null);

  useEffect(() => { montadoEn.current = Date.now(); }, []);

  const alEmpezar = () => {
    if (empezado.current) return;
    empezado.current = true;
    trackGa("form_start", { placement });
  };

  function enfocar(campo: Campo) {
    ({ nombre: nombreRef, telefono: telefonoRef, negocio: negocioRef })[campo]?.current?.focus();
  }

  function validar(): boolean {
    const e: Partial<Record<Campo, string>> = {};
    if (!soloWhatsApp && nombre.trim().length < 2) e.nombre = "Decinos tu nombre";
    if (!normalizarWhatsApp(telefono)) e.telefono = "Revisá el número, con código de área (ej: 11 5555 5555)";
    setErrores(e);
    const primero = (["nombre", "telefono", "negocio"] as Campo[]).find((c) => e[c]);
    if (primero) enfocar(primero);
    return !primero;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (status === "loading") return;
    if (!validar()) return;

    setStatus("loading");
    const attr = captureAttribution();
    const eventId = newEventId();
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          telefono,
          negocio: analisis && sitio ? `Sitio: ${sitio}` : corto ? contexto ?? "Todavía no tiene sitio" : negocio,
          plan,
          website,
          eventId,
          tiempoMs: Date.now() - montadoEn.current,
          attr,
          fbp: getCookie("_fbp"),
          fbc: getFbc(attr),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 400 && data.campo) {
          setErrores({ [data.campo as Campo]: data.error });
          enfocar(data.campo as Campo);
          setStatus("idle");
          return;
        }
        throw new Error("request failed");
      }
      if (data.whatsappUrl) setWaUrl(data.whatsappUrl);
      // Mismo eventId que el servidor le manda a Meta: así no cuenta el lead dos veces.
      trackMeta("Lead", { content_name: "Landing /sitio", plan, placement }, eventId);
      trackGa("generate_lead", { placement, plan });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const campoError = (c: Campo) => (errores[c] ? `${uid}-${c}-err` : undefined);
  const chrome = plano ? "" : `${s.panel} ${s.panelIn}`;

  if (status === "sent") {
    return (
      <div data-lead-form role="status" className={plano ? (corto ? s.enviado : "") : `${s.panel} ${s.panelIn}`}>
        <h3 className={s.panelTitulo}>{soloWhatsApp ? "¡Listo! Recibimos tu consulta." : `¡Listo, ${nombre.trim().split(/\s+/)[0]}! Recibimos tu consulta.`}</h3>
        <p className={s.panelSub}>
          Te escribimos por WhatsApp en menos de 24 hs. Si querés ir más rápido, escribinos ahora y te respondemos apenas lo veamos.
        </p>
        <div className={s.accion}>
          <WhatsAppLink href={waUrl} placement="gracias" className={`${s.btn} ${s.btnWa} ${s.btnFull}`}>
            <WhatsAppIcon /> Escribir por WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    );
  }

  return (
    <form data-lead-form onSubmit={onSubmit} noValidate className={chrome} style={corto ? { flex: 1, display: "flex", flexDirection: "column" } : undefined}>
      {title !== "" && <h2 className={plano && analisis ? s.h3 : s.panelTitulo}>{title ?? "Pedí tu sitio, sin compromiso"}</h2>}
      {subtitle !== "" && <p className={s.panelSub}>{subtitle ?? "Dejá tus datos y te escribimos por WhatsApp."}</p>}

      {!soloWhatsApp && (
        <div className={s.campo}>
          <label htmlFor={`${uid}-nombre`} className={s.etiqueta}>Tu nombre</label>
          <input
            ref={nombreRef}
            id={`${uid}-nombre`}
            name="nombre"
            type="text"
            autoComplete="name"
            placeholder="¿Cómo te llamás?"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onFocus={alEmpezar}
            aria-invalid={Boolean(errores.nombre)}
            aria-describedby={campoError("nombre")}
            className={s.input}
          />
          {errores.nombre && <p id={campoError("nombre")} className={s.error}>{errores.nombre}</p>}
        </div>
      )}

      <div className={s.campo}>
        <label htmlFor={`${uid}-telefono`} className={s.etiqueta}>Tu WhatsApp</label>
        <input
          ref={telefonoRef}
          id={`${uid}-telefono`}
          name="telefono"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="11 5555 5555"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          onFocus={alEmpezar}
          aria-invalid={Boolean(errores.telefono)}
          aria-describedby={campoError("telefono")}
          className={s.input}
        />
        {errores.telefono && <p id={campoError("telefono")} className={s.error}>{errores.telefono}</p>}
      </div>

      {!analisis && !corto && (
        <div className={s.campo}>
          <label htmlFor={`${uid}-negocio`} className={s.etiqueta}>¿Qué negocio tenés? (opcional)</label>
          <input
            ref={negocioRef}
            id={`${uid}-negocio`}
            name="negocio"
            type="text"
            autoComplete="organization"
            placeholder="Ej: odontología, ropa, contabilidad…"
            value={negocio}
            onChange={(e) => setNegocio(e.target.value)}
            onFocus={alEmpezar}
            aria-invalid={Boolean(errores.negocio)}
            aria-describedby={campoError("negocio")}
            className={s.input}
          />
          {errores.negocio && <p id={campoError("negocio")} className={s.error}>{errores.negocio}</p>}
        </div>
      )}

      {!corto && (
      <fieldset className={s.radios}>
        <legend>{analisis ? "Plan" : "Plan que te interesa (opcional)"}</legend>
        {(analisis ? PLANES_ANALISIS : PLANES.map((p) => ({ ...p, precio: "" }))).map((p) => (
          <label key={p.id} className={s.radio}>
            <input type="radio" name={`${uid}-plan`} value={p.id} checked={plan === p.id} onChange={() => setPlan(p.id)} />
            <span className={s.radioL}><span className={s.punto} aria-hidden="true" />{p.label}</span>
            {p.precio && <span className={s.radioP}>{p.precio}</span>}
          </label>
        ))}
      </fieldset>
      )}

      {/* Campo trampa: las personas no lo ven ni lo completan; muchos bots sí. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          No completar
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      <div className={corto ? s.pie : undefined}>
      <div className={s.accion}>
        <button type="submit" disabled={status === "loading"} className={`${s.btn} ${s.btnFull}`}>
          {status === "loading" ? "Enviando…" : boton ?? "Quiero mi sitio"}
        </button>
      </div>

      <div aria-live="polite">
        {status === "error" && (
          <p className={s.error} style={{ textAlign: "center" }}>
            No pudimos enviar tus datos. Probá de nuevo o{" "}
            <WhatsAppLink href={WHATSAPP_URL} placement="error" className={s.link}>escribinos por WhatsApp</WhatsAppLink>.
          </p>
        )}
      </div>

      {!corto && <p className={s.small} style={{ marginTop: 16, textAlign: "center" }}>Consultar es gratis y no te compromete a nada.</p>}
      </div>
    </form>
  );
}
