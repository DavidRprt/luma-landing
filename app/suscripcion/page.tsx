"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Accordion } from "radix-ui";
import { ChevronDown, ArrowRight, Check } from "lucide-react";
import MacbookShowcase from "../components/MacbookShowcase";
import StepsTimeline from "../components/StepsTimeline";
import WhyUs from "../components/WhyUs";
import NavBar from "../components/NavBar";
import ChatWidget from "../components/ChatWidget";
import Footer from "../sections/Footer";
import AuroraGlow from "../components/AuroraGlow";
import { t, type Lang } from "../constants/translations";

const EASE = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px 0px" },
};

export default function SubscriptionPage() {
  const [lang, setLang] = useState<Lang>("es");
  const c = t[lang].subscription;

  return (
    <main>
      <NavBar lang={lang} setLang={setLang} homeHref="/" />

      {/* HERO — fits in one screen (h-[100dvh]), no scrolling required to see the whole
          thing: header text, mockup, and the scroll cue all have to share that budget,
          which is why everything here is sized tighter than the homepage hero. */}
      <div className="relative bg-black overflow-hidden h-[100dvh] flex flex-col px-5 md:px-16 pt-28 md:pt-28 text-center">
        <div className="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none">
          <AuroraGlow />
        </div>

        <div className="relative flex flex-col items-center gap-2 md:gap-3 max-w-2xl mx-auto shrink-0">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="font-mono text-white/35 text-xs tracking-[0.2em] uppercase"
          >
            {c.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight leading-[1.15] text-white"
          >
            {c.heroTitleA}
            <br />
            {c.heroTitleB}{" "}
            <span className="italic text-white/60">{c.heroItalic}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            className="text-white/45 max-w-md hidden sm:block"
            style={{ fontSize: 13.5, lineHeight: 1.5 }}
          >
            {c.heroSub}
          </motion.p>
        </div>

        <div className="relative flex-1 flex items-center justify-center min-h-0">
          <MacbookShowcase lang={lang} />
        </div>

        <motion.a
          href="#como-funciona"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
          className="group relative flex flex-col items-center gap-3 shrink-0 pb-8 md:pb-6"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-7 h-7 rounded-full border border-white/20 group-hover:border-white/50 flex items-center justify-center transition-colors duration-300"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v8M2 7l4 4 4-4" stroke="white" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <span className="text-white/30 text-xs tracking-[0.25em] uppercase group-hover:text-white/60 transition-colors duration-300">
            {c.scrollCta}
          </span>
        </motion.a>
      </div>

      {/* STEPS */}
      <section id="como-funciona" className="scroll-mt-24 bg-black px-5 md:px-20 py-12 md:py-20 border-t border-white/[0.08]">
        <motion.div {...fadeUp} transition={{ duration: 0.5, ease: EASE }} className="mb-10 md:mb-14">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">{c.steps.eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-semibold text-white">{c.steps.title}</h2>
        </motion.div>
        <StepsTimeline steps={c.steps.items} />
      </section>

      {/* WHY US */}
      <section className="bg-black px-5 md:px-20 py-12 md:py-20 border-t border-white/[0.08]">
        <motion.div {...fadeUp} transition={{ duration: 0.5, ease: EASE }} className="mb-10 md:mb-14 max-w-2xl">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">{c.whyUs.eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-4">{c.whyUs.title}</h2>
          <p className="text-white/40" style={{ fontSize: 15, lineHeight: 1.6 }}>{c.whyUs.sub}</p>
        </motion.div>
        <WhyUs c={c.whyUs} />
      </section>

      {/* PLANS */}
      <section id="planes" className="bg-black px-5 md:px-20 py-12 md:py-20 border-t border-white/[0.08]">
        <motion.div {...fadeUp} transition={{ duration: 0.5, ease: EASE }} className="mb-10">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">{c.plans.eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-3">{c.plans.title}</h2>
          <p className="text-white/35" style={{ fontSize: 14 }}>{c.plans.note}</p>
        </motion.div>

        <div className="grid gap-3 md:grid-cols-2">
          {[c.plans.landing, c.plans.corporate].map((plan, i) => (
            <motion.div
              key={plan.name}
              {...fadeUp}
              transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
              className="work-card rounded-2xl p-7 md:p-8 flex flex-col"
              style={{ background: "#0d0d13" }}
            >
              <p className="font-mono uppercase text-white/[0.3]" style={{ fontSize: 11, letterSpacing: "0.2em" }}>{plan.name}</p>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-white font-semibold" style={{ fontSize: 44 }}>${plan.price}</span>
                <span className="text-white/35" style={{ fontSize: 15 }}>{plan.priceSuffix}</span>
              </div>
              <p className="text-white/55 mb-6" style={{ fontSize: 15 }}>{plan.tagline}</p>
              <ul className={`flex flex-col gap-3 flex-1 ${"extraNote" in plan && plan.extraNote ? "mb-3" : "mb-8"}`}>
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2 text-white/60" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                    {f.addon ? (
                      <span
                        className="flex items-center justify-center shrink-0 rounded-full font-mono font-semibold"
                        style={{ width: 15, height: 15, marginTop: 1, fontSize: 10, background: "rgba(106,169,255,0.16)", color: "#6aa9ff" }}
                      >
                        +
                      </span>
                    ) : (
                      <span style={{ color: "#6aa9ff", marginTop: 2 }}>›</span>
                    )}
                    {f.text}
                  </li>
                ))}
              </ul>
              {"extraNote" in plan && plan.extraNote && (
                <p
                  className="mb-6 rounded-lg"
                  style={{ fontSize: 12, lineHeight: 1.5, color: "rgba(106,169,255,0.75)", background: "rgba(106,169,255,0.06)", padding: "10px 12px" }}
                >
                  {plan.extraNote}
                </p>
              )}
              <p className="text-white/30 mb-6" style={{ fontSize: 12, lineHeight: 1.5 }}>{plan.footnote}</p>
              <Link
                href={`/suscripcion/empezar?plan=${i === 0 ? "landing" : "corporativo"}`}
                className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-opacity hover:opacity-85"
                style={{ fontSize: 14, padding: "12px 0", background: "white", color: "#0a0a0a" }}
              >
                {c.plans.ctaLabel}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.4, ease: EASE }}
          className="text-center mt-6"
          style={{ fontSize: 13 }}
        >
          <span className="text-white/40">{c.upsell.bundle.text}</span>{" "}
          <a
            href={`https://wa.me/5491157387432?text=${encodeURIComponent(lang === "es" ? "Hola! Quiero combinar Landing y Corporativo." : "Hi! I'd like to combine the Landing and Corporate plans.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors"
            style={{ color: "rgba(255,255,255,0.65)", textDecorationColor: "rgba(255,255,255,0.25)" }}
          >
            {c.upsell.bundle.cta}
          </a>
        </motion.p>
      </section>

      {/* ECOMMERCE */}
      <section className="bg-black px-5 md:px-20 py-12 md:py-20 border-t border-white/[0.08]">
        <motion.div {...fadeUp} transition={{ duration: 0.5, ease: EASE }} className="mb-10 max-w-2xl">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">{c.upsell.ecommerce.eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-semibold text-white">{c.upsell.ecommerce.title}</h2>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="relative rounded-2xl p-7 md:p-10 overflow-hidden"
          style={{ background: "#0d0d13", border: "1px solid rgba(106,169,255,0.18)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(420px 260px at 12% 8%, rgba(106,169,255,0.16), transparent 70%)" }}
          />
          <div className="relative flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
            <div
              className="shrink-0 md:pr-10 md:border-r"
              style={{ borderColor: "rgba(106,169,255,0.16)" }}
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold" style={{ fontSize: 60, lineHeight: 1, color: "#6aa9ff" }}>{c.upsell.ecommerce.stat}</span>
              </div>
              <p className="text-white/55 mt-2" style={{ fontSize: 13.5, lineHeight: 1.4, maxWidth: 170 }}>{c.upsell.ecommerce.statLabel}</p>
              <p className="text-white/30 mt-2" style={{ fontSize: 11 }}>{c.upsell.ecommerce.statCaption}</p>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 flex-1">
              {c.upsell.ecommerce.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-white/70" style={{ fontSize: 14, lineHeight: 1.5 }}>
                  <span
                    className="flex items-center justify-center shrink-0 rounded-full"
                    style={{ width: 17, height: 17, marginTop: 1, background: "rgba(106,169,255,0.16)", color: "#6aa9ff" }}
                  >
                    <Check size={10} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center md:justify-start mt-8 pt-6" style={{ borderTop: "1px solid rgba(106,169,255,0.18)" }}>
            <a
              href={`https://wa.me/5491157387432?text=${encodeURIComponent(lang === "es" ? "Hola! Quiero armar mi tienda online." : "Hi! I'd like to set up my online store.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full font-medium transition-opacity hover:opacity-85"
              style={{ fontSize: 13.5, padding: "12px 28px", background: "#6aa9ff", color: "#06122a" }}
            >
              {c.upsell.ctaLabel}
              <ArrowRight size={15} />
            </a>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="bg-black px-5 md:px-20 py-12 md:py-20 border-t border-white/[0.08]">
        <motion.div {...fadeUp} transition={{ duration: 0.5, ease: EASE }} className="mb-10 max-w-2xl">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">{c.faq.eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-semibold text-white">{c.faq.title}</h2>
        </motion.div>

        <Accordion.Root type="single" collapsible className="grid gap-3 md:grid-cols-2 md:items-start">
          {c.faq.items.map((item, i) => (
            <Accordion.Item
              key={item.q}
              value={`item-${i}`}
              className="rounded-xl overflow-hidden"
              style={{ background: "#0d0d13", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Accordion.Header>
                <Accordion.Trigger
                  className="group flex w-full items-center justify-between gap-4 text-left"
                  style={{ padding: "18px 20px", background: "none", border: "none", cursor: "pointer" }}
                >
                  <span className="text-white/85 font-medium" style={{ fontSize: 14.5 }}>{item.q}</span>
                  <ChevronDown size={16} className="text-white/40 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=open]:[animation:luma-accordion-down_0.25s_ease-out] data-[state=closed]:[animation:luma-accordion-up_0.2s_ease-in]">
                <p className="text-white/45" style={{ padding: "0 20px 18px", fontSize: 13.5, lineHeight: 1.6 }}>{item.a}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </section>

      {/* FINAL CTA */}
      <section id="contacto-suscripcion" className="bg-black px-5 md:px-20 py-16 md:py-24 border-t border-white/[0.08] text-center">
        <motion.div {...fadeUp} transition={{ duration: 0.5, ease: EASE }}>
          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-4">{c.finalCta.title}</h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto" style={{ fontSize: 15 }}>{c.finalCta.sub}</p>
          <a
            href="https://wa.me/5491157387432"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full font-medium transition-opacity hover:opacity-85"
            style={{ fontSize: 14, padding: "14px 28px", background: "white", color: "#0a0a0a" }}
          >
            {c.finalCta.button}
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </section>

      <Footer lang={lang} />
      <ChatWidget lang={lang} />
    </main>
  );
}
