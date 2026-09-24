"use client";

import { Suspense, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, MessageCircle, CalendarClock, Lock } from "lucide-react";
import { t } from "../../constants/translations";
import { ShineButton } from "../../components/ShineButton";
import { LangHtmlSync } from "../../components/LangHtmlSync";
import { withLang, langFromPathname } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1] as const;

type PlanId = "landing" | "corporativo";

function isPlanId(value: string | null): value is PlanId {
  return value === "landing" || value === "corporativo";
}

// Línea de base, no caja: mismo lenguaje visual que el form de contacto.
const fieldClass =
  "peer w-full bg-transparent border-0 border-b border-white/[0.12] rounded-none text-white/90 placeholder:text-white/20 outline-none transition-colors duration-300 focus:border-transparent text-base md:text-[15px]";
const fieldStyle: React.CSSProperties = { padding: "8px 0 10px" };

function FormField({ label, className, error, children }: { label: string; className?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <label className="flex items-center gap-2 text-white/40 uppercase mb-2" style={{ fontSize: 10.5, letterSpacing: 1.5 }}>
        <span className="shrink-0 rounded-full" style={{ width: 4, height: 4, background: "#6aa9ff" }} />
        {label}
      </label>
      {children}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 w-full origin-left transition-transform duration-300 ease-out ${error ? "scale-x-100" : "scale-x-0 peer-focus:scale-x-100"}`}
        style={{ bottom: error ? 22 : 0, height: 1.5, background: error ? "#ff8383" : "#6aa9ff" }}
      />
      {error && (
        <p role="alert" className="mt-1.5" style={{ fontSize: 12, color: "#ff8383" }}>{error}</p>
      )}
    </div>
  );
}

export default function EmpezarPage() {
  return (
    <Suspense fallback={null}>
      <EmpezarContent />
    </Suspense>
  );
}

function EmpezarContent() {
  const params = useSearchParams();
  const lang = langFromPathname(usePathname());
  const c = t[lang].subscription;
  const cc = t[lang].checkout;

  const planParam = params.get("plan");
  const planId: PlanId = isPlanId(planParam) ? planParam : "landing";
  const plan = planId === "landing" ? c.plans.landing : c.plans.corporate;

  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "sent">("idle");

  const [attempted, setAttempted] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const telefonoOk = telefono.replace(/\D/g, "").length >= 7;
  const empresaOk = empresa.trim().length > 1;

  const errors = {
    email: attempted && !emailOk ? (email.trim() ? cc.emailInvalid : cc.fieldRequired) : undefined,
    telefono: attempted && !telefonoOk ? cc.fieldRequired : undefined,
    empresa: attempted && !empresaOk ? cc.fieldRequired : undefined,
    terms: attempted && !accepted ? cc.termsRequired : undefined,
  };

  const waMessage = (reason: string) =>
    `https://wa.me/5491157387432?text=${encodeURIComponent(reason)}`;

  const handleContinue = async () => {
    setAttempted(true);

    // El botón no se deshabilita: si falta algo se marca qué y se lleva a la persona hasta ahí.
    const firstInvalid = !emailOk ? "field-email" : !telefonoOk ? "field-telefono" : !empresaOk ? "field-empresa" : !accepted ? "field-terms" : null;
    if (firstInvalid) {
      const el = document.getElementById(firstInvalid);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }

    setStatus("loading");

    // Versión en inglés: todavía no hay cobro en dólares, así que no se pasa por
    // Mercado Pago. Se envía la solicitud al equipo, que responde con el link de pago.
    if (lang === "en") {
      try {
        const res = await fetch("/api/checkout-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, telefono, empresa, descripcion, plan: planId, lang }),
        });
        if (!res.ok) throw new Error("request failed");
        setStatus("sent");
      } catch {
        setStatus("error");
      }
      return;
    }

    try {
      // Se avisa al equipo antes de redirigir: si el cliente abandona el pago
      // en Mercado Pago, ya tenemos sus datos para poder contactarlo.
      const checkoutIntent = fetch("/api/checkout-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, telefono, empresa, descripcion, plan: planId, lang }),
      }).catch(() => {});

      const [res] = await Promise.all([
        fetch(`/api/mercadopago/checkout-link?plan=${planId}`),
        checkoutIntent,
      ]);
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error("checkout link failed");
      window.location.href = data.url;
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <LangHtmlSync lang={lang} />
      <div className="px-5 md:px-20 py-10 md:py-16">
        <Link
          href={withLang("/planes", lang)}
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors mb-10"
          style={{ fontSize: 13 }}
        >
          <ArrowLeft size={14} />
          {cc.backLabel}
        </Link>

        <div className="grid md:grid-cols-[1fr_1.4fr] gap-x-16 gap-y-10 md:auto-rows-min">
          {/* Resumen del plan */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="md:col-start-1 md:row-start-1 md:pt-2"
          >
            {/* Plan summary */}
            <div className="rounded-2xl p-6" style={{ background: "#0d0d13", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="font-mono text-white/30 uppercase mb-2" style={{ fontSize: 10, letterSpacing: 2 }}>{cc.planLabel}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-semibold" style={{ fontSize: 30 }}>{plan.name}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-white font-semibold" style={{ fontSize: 26 }}>${plan.price}</span>
                <span className="text-white/35" style={{ fontSize: 14 }}>{cc.priceSuffix}</span>
              </div>
              <ul className="flex flex-col gap-2">
                {plan.features.map((f: { text: string; addon?: boolean }) => (
                  <li key={f.text} className="flex items-start gap-2 text-white/55" style={{ fontSize: 13 }}>
                    <Check size={13} className="text-[#6aa9ff] shrink-0" style={{ marginTop: 2 }} />
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* RIGHT: form */}
          <motion.div className="md:col-start-2 md:row-start-1 md:row-span-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05, ease: EASE }}>
            <p className="font-mono text-white/30 uppercase mb-3" style={{ fontSize: 11, letterSpacing: 2 }}>{cc.eyebrow}</p>
            <h1 className="text-3xl md:text-4xl font-semibold mb-6">{cc.title}</h1>

            {status === "sent" ? (
              <div className="flex flex-col items-start gap-3" style={{ maxWidth: 460, padding: "16px 0" }}>
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 40, height: 40, background: "rgba(106,169,255,0.1)", border: "1px solid rgba(106,169,255,0.3)" }}
                >
                  <Check size={18} className="text-[#6aa9ff]" />
                </div>
                <p className="text-white font-medium" style={{ fontSize: 18 }}>{cc.requestSentTitle}</p>
                <p className="text-white/60" style={{ fontSize: 15, lineHeight: 1.6 }}>{cc.requestSentBody}</p>
              </div>
            ) : (
            <>
            {/* Contacto — misma línea de base que el form de contacto, sin caja */}
            <div className="grid grid-cols-1 sm:grid-cols-2 mb-5" style={{ gap: 20, maxWidth: 620 }}>
              <FormField label={cc.emailLabel} error={errors.email}>
                <input
                  id="field-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={cc.emailPlaceholder}
                  className={fieldClass}
                  style={fieldStyle}
                />
              </FormField>
              <FormField label={cc.phoneLabel} error={errors.telefono}>
                <input
                  id="field-telefono"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder={cc.phonePlaceholder}
                  className={fieldClass}
                  style={fieldStyle}
                />
              </FormField>
              <FormField label={cc.companyLabel} error={errors.empresa}>
                <input
                  id="field-empresa"
                  type="text"
                  autoComplete="organization"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  placeholder={cc.companyPlaceholder}
                  className={fieldClass}
                  style={fieldStyle}
                />
              </FormField>
              <FormField label={cc.descriptionLabel} className="sm:col-span-2">
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder={cc.descriptionPlaceholder}
                  rows={2}
                  className={fieldClass}
                  style={{ ...fieldStyle, resize: "vertical", minHeight: 48 }}
                />
              </FormField>
            </div>

            {/* Terms and conditions — dense fine print, classic corporate boilerplate */}
            <div className="mb-6">
              <p className="font-mono text-white/40 uppercase mb-2" style={{ fontSize: 10.5, letterSpacing: 1.5 }}>{cc.termsTitle}</p>
              <div
                className="rounded-xl p-4 overflow-y-auto mb-3"
                style={{ background: "#0d0d13", border: "1px solid rgba(255,255,255,0.1)", maxHeight: 190, maxWidth: 620 }}
              >
                {cc.termsBody.map((paragraph, i) => (
                  <p key={i} className="text-white/35" style={{ fontSize: 10.5, lineHeight: 1.6, marginBottom: i < cc.termsBody.length - 1 ? 10 : 0, textAlign: "justify" }}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  id="field-terms"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  aria-invalid={errors.terms ? true : undefined}
                  className="mt-0.5 shrink-0"
                  style={{ width: 15, height: 15, accentColor: "#6aa9ff", outline: errors.terms ? "2px solid #ff8383" : undefined, outlineOffset: 2 }}
                />
                <span style={{ fontSize: 12.5, lineHeight: 1.5, color: errors.terms ? "#ff8383" : "rgba(255,255,255,0.55)" }}>{cc.termsCheckbox}</span>
              </label>
              {errors.terms && (
                <p role="alert" className="mt-2" style={{ fontSize: 12.5, color: "#ff8383" }}>{errors.terms}</p>
              )}
            </div>

            {/* Continue */}
            <div className="mb-4">
              <ShineButton type="button" disabled={status === "loading"} onClick={handleContinue}>
                {status === "loading" ? cc.submittingLabel : cc.continueLabel}
                <ArrowRight size={15} />
              </ShineButton>
              {status !== "error" && (
                <p className="flex items-center gap-1.5 text-white/30 mt-3" style={{ fontSize: 12 }}>
                  <Lock size={11} />
                  {cc.redirectNote}
                </p>
              )}
              {status === "error" && <p className="mt-3" style={{ fontSize: 13, color: "#ff8383" }}>{cc.errorBody}</p>}
            </div>
            </>
            )}
          </motion.div>

          {/* Ayuda: queda después del formulario para que lo primero sea suscribirse */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="md:col-start-1 md:row-start-2"
          >
            <p className="font-mono text-white/30 uppercase mb-3" style={{ fontSize: 10.5, letterSpacing: 2 }}>{cc.talkEyebrow}</p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-5">{cc.talkTitle}</h2>

            <p className="text-white/45 mb-7" style={{ fontSize: 14.5, lineHeight: 1.6, maxWidth: 360 }}>{cc.talkSub}</p>
            <div className="flex flex-col gap-3" style={{ maxWidth: 300 }}>
              <a
                href={waMessage(
                  lang === "es" ? `Hola! Tengo dudas antes de suscribirme al plan ${plan.name}.` : `Hi! I have questions before subscribing to the ${plan.name} plan.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full font-medium transition-opacity hover:opacity-85"
                style={{ fontSize: 14, padding: "12px 18px", background: "rgba(106,169,255,0.12)", border: "1px solid rgba(106,169,255,0.3)", color: "#6aa9ff" }}
              >
                <MessageCircle size={16} />
                {cc.talkWhatsapp}
              </a>
              <a
                href={waMessage(
                  lang === "es" ? `Hola! Quiero reservar una llamada para hablar del plan ${plan.name}.` : `Hi! I'd like to book a call to talk about the ${plan.name} plan.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full font-medium transition-colors hover:border-white/30"
                style={{ fontSize: 14, padding: "12px 18px", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}
              >
                <CalendarClock size={16} />
                {cc.talkMeeting}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
