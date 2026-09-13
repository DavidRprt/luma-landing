"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Dialog } from "radix-ui";
import { ArrowRight, Check, X } from "lucide-react";
import { t, type Lang } from "../constants/translations";
import { ShineButton } from "../components/ShineButton";

type PlanId = "landing" | "corporativo";
type SubscriptionCopy = (typeof t)[Lang]["subscription"];
type PlanData = SubscriptionCopy["plans"]["landing"] | SubscriptionCopy["plans"]["corporate"];

const EASE = [0.16, 1, 0.3, 1] as const;

// Cascada de entrada: el contenedor arranca la secuencia y cada bloque hijo
// (y cada línea de feature, con su propio stagger anidado) se suma en orden.
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } },
};

function PlanCard({
  id,
  plan,
  index,
  s,
  open,
  onOpenChange,
}: {
  id: PlanId;
  plan: PlanData;
  index: number;
  s: SubscriptionCopy;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const spotRef = useRef<HTMLDivElement>(null);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = spotRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  // Guarda dónde estaba el botón que abrió el popup para que la animación de
  // apertura/cierre "salga" y "se esconda" hacia ese punto exacto, en vez de
  // crecer/achicarse siempre desde el centro de la pantalla.
  const triggerPointRef = useRef<{ x: number; y: number } | null>(null);
  const onTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerPointRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  const applyTransformOrigin = (el: HTMLDivElement) => {
    const point = triggerPointRef.current;
    if (!point) return;
    // offsetWidth/Height son de layout, no cambian con la animación de `scale`
    // (a diferencia de getBoundingClientRect, que sí refleja el transform en curso).
    const popupLeft = window.innerWidth / 2 - el.offsetWidth / 2;
    const popupTop = window.innerHeight / 2 - el.offsetHeight / 2;
    el.style.transformOrigin = `${point.x - popupLeft}px ${point.y - popupTop}px`;
  };

  // Ref callback en vez de useLayoutEffect: Radix monta el nodo del Content a
  // través de su propio mecanismo interno de presencia, un paso después del
  // render de este componente — un efecto atado a `open` corre demasiado
  // pronto y todavía encuentra spotRef.current en null. El callback ref, en
  // cambio, se dispara justo cuando el nodo real aparece (o desaparece) del DOM.
  const setSpotRef = (el: HTMLDivElement | null) => {
    spotRef.current = el;
    if (el) applyTransformOrigin(el);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-2xl p-5 md:p-6"
      style={{ background: "#0d0d13", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex-1">
        <div className="flex items-baseline gap-2.5 mb-1.5 flex-wrap">
          <span className="text-white font-semibold" style={{ fontSize: 19 }}>{plan.name}</span>
          <span className="text-white/25" style={{ fontSize: 12 }}>·</span>
          <span className="text-white/60" style={{ fontSize: 13.5 }}>{plan.tagline}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-white font-semibold" style={{ fontSize: 24 }}>${plan.price}</span>
          <span className="text-white/35" style={{ fontSize: 13 }}>{plan.priceSuffix}</span>
        </div>
      </div>

      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            onClick={onTriggerClick}
            className="group relative inline-flex items-center justify-center gap-2 rounded-full font-medium overflow-hidden shrink-0 transition-colors duration-300"
            style={{
              fontSize: 14,
              padding: "12px 24px",
              border: "1px solid rgba(106,169,255,0.35)",
              color: "#eaf2ff",
              background: "linear-gradient(135deg, rgba(106,169,255,0.14), rgba(106,169,255,0.03))",
            }}
          >
            {/* Destello diagonal que cruza el botón al hover */}
            <span
              aria-hidden="true"
              className="absolute pointer-events-none transition-transform duration-700 ease-out -translate-x-[60%] skew-x-[-20deg] group-hover:translate-x-[320%] group-hover:skew-x-[-20deg]"
              style={{
                top: -20,
                bottom: -20,
                left: "-40%",
                width: "35%",
                background: "linear-gradient(115deg, transparent, rgba(255,255,255,0.22), transparent)",
              }}
            />
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, rgba(106,169,255,0.26), rgba(106,169,255,0.06))" }}
            />
            <span className="relative">{s.plans.moreLabel}</span>
            <ArrowRight size={15} className="relative transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 data-[state=open]:[animation:luma-overlay-in_0.2s_ease-out] data-[state=closed]:[animation:luma-overlay-out_0.15s_ease-in]"
            style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(3px)", zIndex: 100 }}
          />
          <Dialog.Content
            ref={setSpotRef}
            onMouseMove={onMouseMove}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-3xl max-h-[96vh] sm:max-h-[94vh] overflow-hidden rounded-2xl border flex flex-col data-[state=open]:[animation:luma-popup-in_0.4s_cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:[animation:luma-popup-out_0.28s_cubic-bezier(0.6,0,0.8,0.2)]"
            style={{
              borderColor: "rgba(255,255,255,0.1)",
              background: "#0d0d13",
              boxShadow: "0 40px 100px -20px rgba(0,0,0,0.7)",
              zIndex: 101,
              "--spot-x": "50%",
              "--spot-y": "0%",
            } as React.CSSProperties}
          >
            {/* Mancha de luz que sigue al cursor — cubre todo el popup, incluida la fila del botón de cerrar */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(280px circle at var(--spot-x) var(--spot-y), rgba(106,169,255,0.1), transparent 70%)",
              }}
            />

            {/* Header propio para el botón de cerrar — nunca se superpone con el contenido */}
            <div className="relative flex justify-end shrink-0 px-4 pt-4 sm:px-5 sm:pt-5">
              <Dialog.Close asChild>
                <button
                  aria-label={s.plans.closeLabel}
                  className="flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
                  style={{ width: 27, height: 27, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
                >
                  <X size={14} />
                </button>
              </Dialog.Close>
            </div>

            <div className="relative overflow-y-auto max-h-[calc(96vh-46px)] sm:max-h-[calc(94vh-46px)]">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative px-5 pt-1 pb-3 sm:p-9"
              >
                <div className="grid sm:grid-cols-2 gap-x-10 gap-y-2">
                  {/* Columna izquierda — qué es el plan */}
                  <div>
                    <motion.p variants={itemVariants} className="font-mono uppercase text-white/30 mb-1" style={{ fontSize: 10.5, letterSpacing: 2 }}>
                      {plan.name}
                    </motion.p>
                    <motion.div variants={itemVariants}>
                      <Dialog.Title asChild>
                        <h3 className="text-white font-semibold mb-2" style={{ fontSize: 23, letterSpacing: "-0.02em" }}>{plan.tagline}</h3>
                      </Dialog.Title>
                    </motion.div>
                    <motion.div variants={itemVariants} className="flex items-baseline gap-1 mb-3">
                      <span className="text-white font-semibold" style={{ fontSize: 33 }}>${plan.price}</span>
                      <span className="text-white/35" style={{ fontSize: 14 }}>{plan.priceSuffix}</span>
                    </motion.div>

                    <Dialog.Description asChild>
                      <motion.ul variants={listVariants} className="flex flex-col gap-0.5 sm:gap-1">
                        {plan.features.map((f) => (
                          <motion.li
                            key={f.text}
                            variants={itemVariants}
                            className="flex items-start gap-2 text-white/65"
                            style={{ fontSize: 13, lineHeight: 1.35 }}
                          >
                            {f.addon ? (
                              <span
                                className="flex items-center justify-center shrink-0 rounded-full font-mono font-semibold"
                                style={{ width: 15, height: 15, marginTop: 1, fontSize: 10, background: "rgba(106,169,255,0.16)", color: "#6aa9ff" }}
                              >
                                +
                              </span>
                            ) : (
                              <Check size={14} className="text-[#6aa9ff] shrink-0" style={{ marginTop: 1 }} />
                            )}
                            {f.text}
                          </motion.li>
                        ))}
                      </motion.ul>
                    </Dialog.Description>
                  </div>

                  {/* Columna derecha — cómo sigue, contexto y siguiente paso */}
                  <div className="flex flex-col">
                    {/* Qué pasa después de tocar "Empezar" para ESTE plan — no repite "elegís el
                        plan" porque, al estar viendo este popup, ya lo elegiste */}
                    <motion.div variants={itemVariants} className="relative flex flex-col mt-5 mb-7 sm:mt-0 sm:mb-5">
                      {/* Una sola luz recorre todo el trayecto (1→2→3) en un solo viaje —
                          nada de segmentos independientes animando "a la vez". */}
                      <div
                        aria-hidden="true"
                        className="absolute"
                        style={{ left: 11.5, top: 12, bottom: 12, width: 1, background: "linear-gradient(180deg, rgba(106,169,255,0.5), rgba(106,169,255,0.1))" }}
                      >
                        <motion.span
                          className="absolute rounded-full"
                          style={{ left: "50%", width: 5, height: 5, marginLeft: -2.5, background: "#6aa9ff", boxShadow: "0 0 6px rgba(106,169,255,0.8)" }}
                          animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                          transition={{ duration: 1.9, repeat: Infinity, repeatDelay: 0.7, ease: "easeInOut" }}
                        />
                      </div>
                      {s.afterCta.items.map((label, idx) => {
                        const isLast = idx === s.afterCta.items.length - 1;
                        return (
                          <div key={label} className="relative flex gap-3">
                            <span
                              className="flex items-center justify-center shrink-0 rounded-full font-mono font-semibold"
                              style={{ width: 24, height: 24, fontSize: 11.5, color: "#06122a", background: "#6aa9ff" }}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-white/65" style={{ fontSize: 14, lineHeight: 1.4, paddingBottom: isLast ? 0 : 20, paddingTop: 3 }}>
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </motion.div>

                    <motion.p variants={itemVariants} className="text-white/30 mb-2.5" style={{ fontSize: 11, lineHeight: 1.35 }}>{plan.footnote}</motion.p>

                    <motion.div variants={itemVariants} className="mt-auto">
                      <ShineButton href={`/suscripcion/empezar?plan=${id}`} className="w-full">
                        {s.plans.ctaLabel}
                        <ArrowRight size={15} />
                      </ShineButton>
                      <p className="text-white/35 text-center mt-2" style={{ fontSize: 10.5, lineHeight: 1.3 }}>
                        {s.plans.altPrefix}
                        <a
                          href={`https://wa.me/5491157387432?text=${encodeURIComponent(`Hola! Quiero reservar una reunión antes de suscribirme al plan ${plan.name}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline transition-colors hover:text-white/60"
                          style={{ textDecorationColor: "rgba(255,255,255,0.25)" }}
                        >
                          {s.plans.altLink}
                        </a>
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </motion.div>
  );
}

const Subscription = ({ lang }: { lang: Lang }) => {
  const c = t[lang].services;
  const s = t[lang].subscription;
  const [openPlan, setOpenPlan] = useState<PlanId | null>(null);

  const plans: { id: PlanId; plan: PlanData }[] = [
    { id: "landing", plan: s.plans.landing },
    { id: "corporativo", plan: s.plans.corporate },
  ];

  return (
    <section id="servicios" className="bg-black px-5 md:px-20 py-14 md:py-20 border-t border-white/[0.1]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px 0px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-10 md:mb-12"
        style={{ maxWidth: 620 }}
      >
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">{c.eyebrow}</p>
        <h2 className="text-3xl md:text-5xl font-semibold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          {c.title}
        </h2>
        <p className="text-white/45 leading-relaxed" style={{ fontSize: 15.5, lineHeight: 1.7 }}>{c.sub}</p>
      </motion.div>

      <div className="flex flex-col gap-2.5 mb-8">
        {plans.map(({ id, plan }, i) => (
          <PlanCard
            key={id}
            id={id}
            plan={plan}
            index={i}
            s={s}
            open={openPlan === id}
            onOpenChange={(open) => setOpenPlan(open ? id : null)}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl"
        style={{
          padding: "22px 26px",
          background: "linear-gradient(135deg, rgba(106,169,255,0.09), rgba(106,169,255,0.02))",
          border: "1px solid rgba(106,169,255,0.2)",
        }}
      >
        <p className="text-white font-medium" style={{ fontSize: 16 }}>{c.morePrompt}</p>
        <ShineButton href="/suscripcion" className="shrink-0">
          {c.moreCta}
          <ArrowRight size={16} />
        </ShineButton>
      </motion.div>
    </section>
  );
};

export default Subscription;
