"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { t, type Lang } from "../constants/translations";

const Subscription = ({ lang }: { lang: Lang }) => {
  const c = t[lang].services;
  const s = t[lang].subscription;

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
        {[s.plans.landing, s.plans.corporate].map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px 0px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
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

            <Link
              href={`/suscripcion/empezar?plan=${i === 0 ? "landing" : "corporativo"}`}
              className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-opacity hover:opacity-85 shrink-0"
              style={{ fontSize: 14, padding: "12px 24px", background: "#6aa9ff", color: "#06122a" }}
            >
              {s.plans.ctaLabel}
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <p className="text-white/45" style={{ fontSize: 14.5 }}>{c.morePrompt}</p>
        <Link
          href="/suscripcion"
          className="group inline-flex items-center gap-2 rounded-full border font-medium transition-colors duration-300 hover:border-white/30 shrink-0"
          style={{ fontSize: 14, padding: "12px 26px", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)" }}
        >
          {c.moreCta}
          <span className="flex items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight size={16} />
          </span>
        </Link>
      </motion.div>
    </section>
  );
};

export default Subscription;
