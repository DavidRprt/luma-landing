"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { t, type Lang } from "../constants/translations";

function ServiceRow({
  svc,
  i,
  inView,
}: {
  svc: { num: string; title: string; desc: string };
  i: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
      className="service-row flex items-center border-b border-white/[0.07] -mx-5 md:-mx-20 cursor-default"
      style={{ gap: "clamp(16px, 3vw, 40px)", padding: `clamp(20px, 3vw, 30px) clamp(20px, 6vw, 80px)` }}
    >
      <span className="service-num font-mono shrink-0" style={{ fontSize: 11, minWidth: 24, letterSpacing: "0.05em" }}>
        {svc.num}
      </span>

      <h3 className="service-title font-semibold flex-1 leading-tight" style={{ fontSize: "clamp(20px, 3.2vw, 42px)", letterSpacing: "-0.025em" }}>
        {svc.title}
      </h3>

      <p className="service-desc text-sm leading-relaxed text-right hidden md:block" style={{ maxWidth: 320, lineHeight: 1.65 }}>
        {svc.desc}
      </p>

      <svg className="service-arrow" width="15" height="15" viewBox="0 0 14 14" fill="none">
        <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

const Features = ({ lang }: { lang: Lang }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const c = t[lang].services;

  return (
    <section id="servicios" className="bg-black px-5 md:px-20 pt-10 md:pt-14 pb-8 md:pb-12 flex flex-col justify-center border-t border-white/[0.1]">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-6 md:mb-10 flex items-end justify-between gap-6 flex-wrap"
      >
        <div>
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">{c.eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-semibold text-white">{c.title}</h2>
        </div>
        <a
          href="#trabajos"
          className="flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors duration-300 shrink-0 mb-1 no-underline"
          style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}
        >
          {c.link}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </motion.div>

      <div className="border-t border-white/[0.07]">
        {c.items.map((svc, i) => (
          <ServiceRow key={svc.num} svc={svc} i={i} inView={inView} />
        ))}
      </div>
    </section>
  );
};

export default Features;
