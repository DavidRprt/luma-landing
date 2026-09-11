"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Check, MessageCircle, CalendarClock, Lock } from "lucide-react";
import { t, type Lang } from "../../constants/translations";

const EASE = [0.16, 1, 0.3, 1] as const;

type PlanId = "landing" | "corporativo";

function isPlanId(value: string | null): value is PlanId {
  return value === "landing" || value === "corporativo";
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
  const [lang] = useState<Lang>("es");
  const c = t[lang].subscription;
  const cc = t[lang].checkout;

  const planParam = params.get("plan");
  const planId: PlanId = isPlanId(planParam) ? planParam : "landing";
  const plan = planId === "landing" ? c.plans.landing : c.plans.corporate;

  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const canPay = accepted && email.trim().length > 3;

  const waMessage = (reason: string) =>
    `https://wa.me/5491157387432?text=${encodeURIComponent(reason)}`;

  const handleContinue = async () => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/mercadopago/checkout-link?plan=${planId}`);
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error("checkout link failed");
      window.location.href = data.url;
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="px-5 md:px-20 py-10 md:py-16">
        <Link
          href="/suscripcion"
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors mb-10"
          style={{ fontSize: 13 }}
        >
          <ArrowLeft size={14} />
          {cc.backLabel}
        </Link>

        <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16">
          {/* LEFT: talk to us instead */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="md:pt-2"
          >
            <p className="font-mono text-white/30 uppercase mb-3" style={{ fontSize: 10.5, letterSpacing: 2 }}>{cc.talkEyebrow}</p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-5">{cc.talkTitle}</h2>

            {/* Plan summary */}
            <div className="rounded-2xl p-6 mb-6" style={{ background: "#0d0d13", border: "1px solid rgba(255,255,255,0.08)" }}>
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

          {/* RIGHT: form */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05, ease: EASE }}>
            <p className="font-mono text-white/30 uppercase mb-3" style={{ fontSize: 11, letterSpacing: 2 }}>{cc.eyebrow}</p>
            <h1 className="text-3xl md:text-4xl font-semibold mb-8">{cc.title}</h1>

            {/* Email */}
            <div className="mb-6">
              <label className="block font-mono text-white/40 uppercase mb-2" style={{ fontSize: 10.5, letterSpacing: 1.5 }}>
                {cc.emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={cc.emailPlaceholder}
                className="w-full rounded-xl px-4 py-3 text-white outline-none"
                style={{ background: "#0d0d13", border: "1px solid rgba(255,255,255,0.12)", fontSize: 14, maxWidth: 420 }}
              />
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
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-0.5 shrink-0"
                  style={{ width: 15, height: 15, accentColor: "#6aa9ff" }}
                />
                <span className="text-white/55" style={{ fontSize: 12.5, lineHeight: 1.5 }}>{cc.termsCheckbox}</span>
              </label>
            </div>

            {/* Continue */}
            <div className="mb-4">
              <button
                type="button"
                disabled={!canPay || status === "loading"}
                onClick={handleContinue}
                className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-opacity"
                style={{
                  fontSize: 14,
                  padding: "13px 28px",
                  background: canPay ? "#6aa9ff" : "rgba(255,255,255,0.08)",
                  color: canPay ? "#06122a" : "rgba(255,255,255,0.3)",
                  cursor: canPay && status !== "loading" ? "pointer" : "not-allowed",
                }}
              >
                {status === "loading" ? cc.submittingLabel : cc.continueLabel}
              </button>
              {!canPay && (
                <p className="text-white/30 mt-3" style={{ fontSize: 12 }}>{cc.submitDisabledHint}</p>
              )}
              {canPay && status !== "error" && (
                <p className="flex items-center gap-1.5 text-white/30 mt-3" style={{ fontSize: 12 }}>
                  <Lock size={11} />
                  {cc.redirectNote}
                </p>
              )}
              {status === "error" && <p className="mt-3" style={{ fontSize: 13, color: "#ff8383" }}>{cc.errorBody}</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
