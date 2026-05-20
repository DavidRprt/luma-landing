"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { t, type Lang } from "../constants/translations";

const imgSchemes: Record<string, { gradient: string; label: string; stripe: string }> = {
  bloom: {
    gradient: "linear-gradient(135deg,rgba(251,113,133,0.22) 0%,rgba(249,168,37,0.12) 60%,rgba(0,0,0,0) 100%)",
    label: "product shot",
    stripe: "rgba(251,190,150,0.04)",
  },
  pulse: {
    gradient: "linear-gradient(135deg,rgba(37,99,235,0.22) 0%,rgba(96,165,250,0.1) 60%,rgba(0,0,0,0) 100%)",
    label: "AI interface",
    stripe: "rgba(96,165,250,0.04)",
  },
  axis: {
    gradient: "linear-gradient(135deg,rgba(109,40,217,0.22) 0%,rgba(99,102,241,0.1) 60%,rgba(0,0,0,0) 100%)",
    label: "dashboard view",
    stripe: "rgba(139,92,246,0.04)",
  },
};

function WorkImg({ img }: { img: string }) {
  const s = imgSchemes[img] ?? imgSchemes.bloom;
  return (
    <div className="w-full relative overflow-hidden shrink-0" style={{ aspectRatio: "16/9", background: s.gradient }}>
      <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(45deg,${s.stripe} 0,${s.stripe} 1px,transparent 1px,transparent 20px)` }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono uppercase text-white/[0.16]" style={{ fontSize: 10, letterSpacing: "0.22em" }}>{s.label}</span>
      </div>
    </div>
  );
}

function WorkCard({
  w,
  i,
  inView,
  cta,
}: {
  w: { num: string; title: string; category: string; year: string; desc: string; stat: string; tags: readonly string[]; img: string };
  i: number;
  inView: boolean;
  cta: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl overflow-hidden flex flex-col cursor-default"
      style={{
        background: "#0d0d13",
        border: `1px solid ${hovered ? "rgba(96,165,250,0.3)" : "rgba(255,255,255,0.08)"}`,
        boxShadow: hovered ? "0 24px 60px rgba(0,0,0,0.55)" : "none",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      <WorkImg img={w.img} />
      <div className="flex flex-col flex-1 p-5 pb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="uppercase text-white/[0.28]" style={{ fontSize: 10, letterSpacing: "0.2em" }}>{w.category}</span>
          <span className="font-mono text-white/20" style={{ fontSize: 10 }}>{w.year}</span>
        </div>
        <h3 className="text-white font-semibold mb-2" style={{ fontSize: 26, letterSpacing: "-0.025em" }}>{w.title}</h3>
        <p className="text-white/[0.38] leading-relaxed flex-1 mb-4" style={{ fontSize: 13, lineHeight: 1.65 }}>{w.desc}</p>
        <div className="rounded-[10px] mb-4" style={{ padding: "9px 13px", background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.1)" }}>
          <span className="font-medium" style={{ fontSize: 12, color: "rgba(96,165,250,0.85)" }}>{w.stat}</span>
        </div>
        <div className="flex flex-wrap gap-[5px] mb-[18px]">
          {w.tags.map((tag) => (
            <span key={tag} className="font-mono text-white/25" style={{ fontSize: 11, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 999, padding: "3px 10px" }}>{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-white/30" style={{ fontSize: 12, letterSpacing: "0.06em" }}>
          <span>{cta}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

const Works = ({ lang }: { lang: Lang }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const c = t[lang].works;

  return (
    <section id="trabajos" className="bg-black px-5 md:px-20 pt-20 pb-28 flex flex-col justify-center">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-14"
      >
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">{c.eyebrow}</p>
        <h2 className="text-3xl md:text-5xl font-semibold text-white">{c.title}</h2>
      </motion.div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {c.items.map((w, i) => (
          <WorkCard key={w.num} w={w} i={i} inView={inView} cta={c.cta} />
        ))}
      </div>
    </section>
  );
};

export default Works;
