"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { t, type Lang } from "../constants/translations";

const icons = [
  <svg key="chat" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="rgba(96,165,250,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="flow" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" stroke="rgba(167,139,250,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="analytics" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="rgba(34,211,238,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

const accents = ["rgba(96,165,250", "rgba(167,139,250", "rgba(34,211,238"];

function AICard({
  item,
  i,
  inView,
}: {
  item: { num: string; tag: string; title: string; desc: string };
  i: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const a = accents[i];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl cursor-default"
      style={{
        background: "#0d0d13",
        padding: "32px 28px",
        border: `1px solid ${hovered ? `${a},0.25)` : "rgba(255,255,255,0.08)"}`,
        transition: "border-color 0.4s",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 20% 20%, ${a},0.07) 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s",
        }}
      />
      <div className="relative flex items-start justify-between mb-5">
        <div className="flex items-center justify-center rounded-[10px]" style={{ width: 36, height: 36, background: `${a},0.08)`, border: `1px solid ${a},0.15)` }}>
          {icons[i]}
        </div>
        <span className="font-mono text-white/[0.18]" style={{ fontSize: 10, letterSpacing: "0.1em" }}>{item.num}</span>
      </div>
      <span className="relative block uppercase mb-2.5" style={{ fontSize: 11, letterSpacing: "0.2em", color: `${a},0.7)` }}>{item.tag}</span>
      <h3 className="relative text-white font-semibold leading-snug mb-2.5" style={{ fontSize: 20, letterSpacing: "-0.02em" }}>{item.title}</h3>
      <p className="relative text-white/[0.38] leading-relaxed" style={{ fontSize: 13, lineHeight: 1.7 }}>{item.desc}</p>
    </motion.div>
  );
}

const AI = ({ lang }: { lang: Lang }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const c = t[lang].ai;

  return (
    <section id="ia" className="bg-black px-5 md:px-20 pt-20 pb-20 flex flex-col justify-center border-t border-white/[0.06]">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-16 flex flex-col gap-4 max-w-[640px]"
      >
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase">{c.eyebrow}</p>
        <h2
          className="text-white font-semibold leading-[1.08]"
          style={{ fontSize: "clamp(32px, 5vw, 60px)", letterSpacing: "-0.03em", whiteSpace: "pre-line" }}
        >
          {c.title}
        </h2>
        <p className="text-white/40 leading-relaxed" style={{ fontSize: 15, lineHeight: 1.7 }}>{c.sub}</p>
      </motion.div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {c.items.map((item, i) => (
          <AICard key={item.num} item={item} i={i} inView={inView} />
        ))}
      </div>
    </section>
  );
};

export default AI;
