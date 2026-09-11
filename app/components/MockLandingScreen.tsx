"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Menu, Zap, ShieldCheck, Sparkles } from "lucide-react";
import type { Lang } from "../constants/translations";

const EASE = [0.16, 1, 0.3, 1] as const;

// Copy for the mock site shown inside the browser/phone frame — kept local since
// it's a prop, not real site content, but still needs to follow the lang toggle.
const MOCK = {
  es: {
    brand: "tuempresa",
    navLinks: ["Producto", "Precios", "Nosotros"],
    navCta: "Empezar",
    eyebrow: "Para tu negocio",
    headingA: "Todo lo que necesitás,",
    headingB: "en un solo",
    headingItalic: "lugar.",
    sub: "Gestioná tu negocio desde un mismo panel, sin vueltas.",
    primaryCta: "Empezar gratis",
    secondaryCta: "Ver demo",
    trust: ["Carga en 2s", "SSL incluido", "Soporte 24/7"],
  },
  en: {
    brand: "yourcompany",
    navLinks: ["Product", "Pricing", "About"],
    navCta: "Get started",
    eyebrow: "For your business",
    headingA: "Everything you need,",
    headingB: "in one",
    headingItalic: "place.",
    sub: "Run your whole business from one dashboard, no hassle.",
    primaryCta: "Start for free",
    secondaryCta: "See demo",
    trust: ["Loads in 2s", "SSL included", "24/7 support"],
  },
} as const;

const SLIDES = [
  "radial-gradient(120% 120% at 20% 20%, #3b82f6 0%, #1e1b4b 60%)",
  "radial-gradient(120% 120% at 80% 30%, #8b5cf6 0%, #1e1b4b 60%)",
  "radial-gradient(120% 120% at 30% 80%, #2dd4bf 0%, #0f172a 60%)",
  "radial-gradient(120% 120% at 70% 70%, #6aa9ff 0%, #171730 60%)",
];

function Carousel({ className, ratio = "4 / 3" }: { className?: string; ratio?: string }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-xl" style={{ aspectRatio: ratio }}>
        <motion.div className="flex h-full" animate={{ x: `-${index * 100}%` }} transition={{ duration: 0.7, ease: EASE }}>
          {SLIDES.map((bg, i) => (
            <div key={i} className="h-full w-full shrink-0" style={{ background: bg }} />
          ))}
        </motion.div>
      </div>
      <div className="flex gap-1.5 justify-center mt-2.5">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-300"
            style={{ width: i === index ? 14 : 5, background: i === index ? "#6aa9ff" : "rgba(255,255,255,0.2)" }}
          />
        ))}
      </div>
    </div>
  );
}

const TRUST_ICONS = [Zap, ShieldCheck, Sparkles];

/** A single-line mono "readout" strip instead of the classic three-boxed-cards-with-a-
 * colored-icon-square pattern — that specific layout is what makes a page read as an AI
 * template at a glance. This borrows the real site's own visual language instead (mono
 * stat chips, thin dividers, no boxes). */
function TrustBar({ lang }: { lang: Lang }) {
  const items = MOCK[lang].trust;
  return (
    <div className="flex items-center justify-center flex-wrap gap-x-5 gap-y-1.5">
      {items.map((label, i) => {
        const Icon = TRUST_ICONS[i];
        return (
          <motion.div
            key={label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
            className="flex items-center gap-4"
          >
            {i > 0 && <span className="text-white/15" style={{ fontSize: 10 }}>&middot;</span>}
            <span className="flex items-center gap-1.5 font-mono text-white/40" style={{ fontSize: 9.5 }}>
              <Icon size={10} className="text-[#6aa9ff]" />
              {label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

function Nav({ lang, compact }: { lang: Lang; compact?: boolean }) {
  const m = MOCK[lang];
  return (
    <div className="flex items-center justify-between" style={{ padding: compact ? "10px 14px 6px" : "14px 28px" }}>
      <div className="flex items-center gap-1.5">
        <div style={{ width: 12, height: 3, borderRadius: 2, background: "#6aa9ff" }} />
        <span className="text-white font-bold" style={{ fontSize: compact ? 11 : 13 }}>{m.brand}</span>
      </div>
      {compact ? (
        <Menu size={14} className="text-white/60" />
      ) : (
        <>
          <div className="flex items-center gap-4">
            {m.navLinks.map((link) => (
              <span key={link} className="text-white/55" style={{ fontSize: 10.5 }}>{link}</span>
            ))}
          </div>
          <div className="rounded-full bg-white text-[#0a0a0a] font-bold" style={{ fontSize: 10, padding: "5px 12px" }}>{m.navCta}</div>
        </>
      )}
    </div>
  );
}

/** The desktop layout: text + CTAs on the left, rotating "product photo" carousel on
 * the right — a standard modern SaaS hero composition. Everything here is live
 * React/CSS (not a static screenshot), so the carousel actually rotates. */
export function MockLandingDesktop({ lang }: { lang: Lang }) {
  const m = MOCK[lang];
  return (
    <div className="relative" style={{ background: "#000" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(60% 50% at 85% 0%, rgba(59,130,246,0.35), transparent 70%), radial-gradient(50% 40% at 5% 10%, rgba(139,92,246,0.28), transparent 70%)" }} />
      <div className="relative">
        <Nav lang={lang} />
        <div className="grid grid-cols-2 gap-6 items-center" style={{ padding: "10px 24px 16px" }}>
          <div>
            <p className="font-mono text-white/40 uppercase mb-1.5" style={{ fontSize: 8, letterSpacing: 2 }}>{m.eyebrow}</p>
            <h1 className="text-white font-bold" style={{ fontSize: 21, lineHeight: 1.15, marginBottom: 6 }}>
              {m.headingA}<br />{m.headingB} <span className="italic text-white/60">{m.headingItalic}</span>
            </h1>
            <p className="text-white/45 mb-3" style={{ fontSize: 9.5, lineHeight: 1.5 }}>
              {m.sub}
            </p>
            <div className="flex gap-2">
              <div className="rounded-full font-bold" style={{ fontSize: 9.5, padding: "7px 14px", background: "#6aa9ff", color: "#06122a" }}>{m.primaryCta}</div>
              <div className="rounded-full font-semibold" style={{ fontSize: 9.5, padding: "7px 14px", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.8)" }}>{m.secondaryCta}</div>
            </div>
          </div>
          <Carousel ratio="16 / 11" />
        </div>
        <div style={{ padding: "0 24px 14px" }}>
          <TrustBar lang={lang} />
        </div>
      </div>
    </div>
  );
}

/** Mobile layout: same content, stacked in a single column, carousel full-width. */
export function MockLandingMobile({ lang }: { lang: Lang }) {
  const m = MOCK[lang];
  return (
    <div className="relative h-full flex flex-col" style={{ background: "#000" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(70% 40% at 85% 0%, rgba(59,130,246,0.35), transparent 70%), radial-gradient(60% 35% at 10% 10%, rgba(139,92,246,0.28), transparent 70%)" }} />
      <div className="relative flex flex-col flex-1">
        <Nav lang={lang} compact />
        <div className="flex flex-col items-center text-center flex-1" style={{ padding: "6px 14px 78px" }}>
          <p className="font-mono text-white/40 uppercase mb-1.5" style={{ fontSize: 7, letterSpacing: 1.5 }}>{m.eyebrow}</p>
          <h1 className="text-white font-bold" style={{ fontSize: 15, lineHeight: 1.25, marginBottom: 8 }}>
            {m.headingA} {m.headingB} <span className="italic text-white/60">{m.headingItalic}</span>
          </h1>
          <div className="rounded-full font-bold text-center w-full mb-3" style={{ fontSize: 9.5, padding: "8px 0", background: "#6aa9ff", color: "#06122a" }}>
            {m.primaryCta}
          </div>
          <Carousel className="w-full" ratio="16 / 9" />
          <div className="mt-auto pt-3">
            <TrustBar lang={lang} />
          </div>
        </div>
      </div>
    </div>
  );
}
