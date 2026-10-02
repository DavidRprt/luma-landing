"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PLAN_EVENT, WHATSAPP_URL, type PlanId } from "./constants";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { WhatsAppLink } from "./TrackedLink";
import { normalizarWhatsApp } from "@/lib/phone";
import { captureAttribution, getCookie, getFbc, newEventId, trackGa, trackMeta } from "@/lib/tracking";

type Status = "idle" | "loading" | "sent" | "error";
type Campo = "nombre" | "telefono" | "negocio";

const PLANES: { id: PlanId; label: string }[] = [
  { id: "landing", label: "Landing" },
  { id: "corporativo", label: "Corporativo" },
  { id: "no-se", label: "No sé todavía" },
];

const inputClass =
  "w-full rounded-xl bg-white/[0.06] border px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#6aa9ff] focus:bg-white/[0.09]";

export function LeadForm({ placement, title }: { placement: "hero" | "final"; title?: string }) {
  const uid = useId();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [negocio, setNegocio] = useState("");
  const [plan, setPlan] = useState<PlanId>("no-se");
  const [website, setWebsite] = useState(""); // campo trampa para bots
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [waUrl, setWaUrl] = useState(WHATSAPP_URL);
  const montadoEn = useRef(0);
  const empezado = useRef(false);
  const nombreRef = useRef<HTMLInputElement>(null);
  const telefonoRef = useRef<HTMLInputElement>(null);
  const negocioRef = useRef<HTMLInputElement>(null);

  // Los botones de los planes eligen el plan acá.
  useEffect(() => {
    montadoEn.current = Date.now();
    const onPlan = (e: Event) => setPlan((e as CustomEvent<PlanId>).detail);
    window.addEventListener(PLAN_EVENT, onPlan);
    return () => window.removeEventListener(PLAN_EVENT, onPlan);
  }, []);

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
    if (nombre.trim().length < 2) e.nombre = "Decinos tu nombre";
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
          negocio,
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

  if (status === "sent") {
    return (
      <div data-lead-form role="status" className="rounded-3xl border border-[#6aa9ff]/30 bg-white/[0.04] p-7 md:p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#6aa9ff]/15 text-[#6aa9ff]" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-white font-semibold" style={{ fontSize: 22, letterSpacing: "-0.02em" }}>
          ¡Listo, {nombre.trim().split(/\s+/)[0]}! Recibimos tu consulta.
        </h3>
        <p className="mt-2 text-white/55" style={{ fontSize: 15, lineHeight: 1.6 }}>
          Te escribimos por WhatsApp en menos de 24 hs. Si querés ir más rápido, escribinos ahora y te respondemos apenas lo veamos.
        </p>
        <WhatsAppLink
          href={waUrl}
          placement="gracias"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 font-semibold text-[#06240f]"
          style={{ fontSize: 15 }}
        >
          <WhatsAppIcon /> Escribir por WhatsApp
        </WhatsAppLink>
      </div>
    );
  }

  return (
    <form
      data-lead-form
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8 backdrop-blur-sm"
      style={{ boxShadow: "0 30px 80px -30px rgba(106,169,255,0.25)" }}
    >
      <h2 className="text-white font-semibold" style={{ fontSize: 22, letterSpacing: "-0.02em" }}>
        {title ?? "Pedí tu sitio, sin compromiso"}
      </h2>
      <p className="mt-1.5 text-white/50" style={{ fontSize: 14 }}>
        Dejá tus datos y te escribimos por WhatsApp.
      </p>

      <div className="mt-5 space-y-3.5">
        <div>
          <label htmlFor={`${uid}-nombre`} className="mb-1.5 block text-white/70" style={{ fontSize: 13 }}>Tu nombre</label>
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
            className={`${inputClass} ${errores.nombre ? "border-red-400/70" : "border-white/10"}`}
            style={{ fontSize: 16 }}
          />
          {errores.nombre && <p id={campoError("nombre")} className="mt-1.5 text-red-300" style={{ fontSize: 13 }}>{errores.nombre}</p>}
        </div>

        <div>
          <label htmlFor={`${uid}-telefono`} className="mb-1.5 block text-white/70" style={{ fontSize: 13 }}>Tu WhatsApp</label>
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
            className={`${inputClass} ${errores.telefono ? "border-red-400/70" : "border-white/10"}`}
            style={{ fontSize: 16 }}
          />
          {errores.telefono && <p id={campoError("telefono")} className="mt-1.5 text-red-300" style={{ fontSize: 13 }}>{errores.telefono}</p>}
        </div>

        <div>
          <label htmlFor={`${uid}-negocio`} className="mb-1.5 block text-white/70" style={{ fontSize: 13 }}>¿Qué negocio tenés? <span className="text-white/35">(opcional)</span></label>
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
            className={`${inputClass} ${errores.negocio ? "border-red-400/70" : "border-white/10"}`}
            style={{ fontSize: 16 }}
          />
          {errores.negocio && <p id={campoError("negocio")} className="mt-1.5 text-red-300" style={{ fontSize: 13 }}>{errores.negocio}</p>}
        </div>

        <fieldset>
          <legend className="mb-1.5 text-white/70" style={{ fontSize: 13 }}>Plan que te interesa <span className="text-white/35">(opcional)</span></legend>
          <div className="grid grid-cols-3 gap-2">
            {PLANES.map((p) => (
              <label key={p.id} className="cursor-pointer">
                <input type="radio" name={`${uid}-plan`} value={p.id} checked={plan === p.id} onChange={() => setPlan(p.id)} className="peer sr-only" />
                <span
                  className="flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-2 text-center text-white/60 transition-colors peer-checked:border-[#6aa9ff] peer-checked:bg-[#6aa9ff]/15 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#6aa9ff]"
                  style={{ fontSize: 13, lineHeight: 1.2 }}
                >
                  {p.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Campo trampa: las personas no lo ven ni lo completan; muchos bots sí. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
          <label>
            No completar
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-5 w-full rounded-full bg-white py-4 font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ fontSize: 16 }}
      >
        {status === "loading" ? "Enviando…" : "Quiero mi sitio"}
      </button>

      <div aria-live="polite">
        {status === "error" && (
          <p className="mt-3 text-center text-red-300" style={{ fontSize: 14, lineHeight: 1.5 }}>
            No pudimos enviar tus datos. Probá de nuevo o{" "}
            <WhatsAppLink href={WHATSAPP_URL} placement="error" className="underline">escribinos por WhatsApp</WhatsAppLink>.
          </p>
        )}
      </div>

      <p className="mt-3 text-center text-white/40" style={{ fontSize: 12.5 }}>
        Consultar es gratis y no te compromete a nada.
      </p>
    </form>
  );
}
