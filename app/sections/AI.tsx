"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { t, type Lang } from "../constants/translations";

// ── Mini visuals ──────────────────────────────────────────────────────────────

function ChatVisual() {
  return (
    <div className="flex flex-col gap-2 pointer-events-none">
      <div className="flex justify-end">
        <div style={{ background: "#6aa9ff", color: "#06122a", fontSize: 11, fontWeight: 500, padding: "6px 11px", borderRadius: "10px 10px 2px 10px", maxWidth: 180 }}>
          ¿Tienen el modelo en azul?
        </div>
      </div>
      <div className="flex gap-2 items-end">
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", flexShrink: 0 }}>IA</div>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 11, padding: "6px 11px", borderRadius: "10px 10px 10px 2px", color: "rgba(255,255,255,0.75)", maxWidth: 200 }}>
          Sí, lo tenemos en azul y gris. ¿Querés que te mande el link?
        </div>
      </div>
      <div className="flex justify-end">
        <div style={{ background: "#6aa9ff", color: "#06122a", fontSize: 11, fontWeight: 500, padding: "6px 11px", borderRadius: "10px 10px 2px 10px" }}>
          Sí por favor 🙌
        </div>
      </div>
    </div>
  );
}

function AutoVisual() {
  const tasks = [
    { label: "Email de bienvenida enviado", done: true },
    { label: "CRM actualizado",             done: true },
    { label: "Reporte semanal generado",    done: true },
  ];
  return (
    <div className="flex flex-col gap-1.5 pointer-events-none">
      {tasks.map((task) => (
        <div key={task.label} className="flex items-center gap-2">
          <div style={{ width: 14, height: 14, borderRadius: 4, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 4L3.5 6L6.5 2" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{task.label}</span>
        </div>
      ))}
      <div className="flex gap-3 mt-1">
        {[["12", "tareas hoy"], ["3.2h", "ahorradas"]].map(([n, l]) => (
          <div key={l} style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 6, padding: "3px 8px", display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}>{n}</span>
            <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WebVisual() {
  return (
    <div className="relative pointer-events-none" style={{ height: 64 }}>
      {/* mini browser */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{ height: 16, background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 4, padding: "0 8px" }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />)}
        </div>
        <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", width: "70%" }} />
          <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.04)", width: "50%" }} />
        </div>
      </div>
      {/* floating chat badge */}
      <div style={{ position: "absolute", bottom: 6, right: 8, width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

const visuals = [<ChatVisual key="chat" />, <AutoVisual key="auto" />, <WebVisual key="web" />];
const accents = ["#6aa9ff", "#a78bfa", "#34d399"];

// ── Card ──────────────────────────────────────────────────────────────────────

function AICard({
  item,
  i,
}: {
  item: { num: string; tag: string; title: string; desc: string };
  i: number;
}) {
  const [hovered, setHovered] = useState(false);
  const accent = accents[i];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl flex flex-col"
      style={{
        background: "#0d0d13",
        padding: "28px 24px",
        border: `1px solid ${hovered ? `${accent}30` : "rgba(255,255,255,0.07)"}`,
        transition: "border-color 0.4s",
        gap: 20,
      }}
    >
      {/* glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 70% 60% at 10% 10%, ${accent}12 0%, transparent 70%)`,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.5s",
      }} />

      {/* visual — altura fija para que el divisor quede exactamente al mismo nivel */}
      <div className="relative flex flex-col justify-end overflow-hidden" style={{ height: 140 }}>
        {visuals[i]}
      </div>

      {/* divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

      {/* text */}
      <div className="relative flex flex-col gap-2">
        <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: `${accent}bb`, fontWeight: 500 }}>
          {item.tag}
        </span>
        <h3 className="text-white font-semibold leading-snug" style={{ fontSize: 18, letterSpacing: "-0.02em" }}>
          {item.title}
        </h3>
        <p className="text-white/40 leading-relaxed" style={{ fontSize: 13, lineHeight: 1.7 }}>
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

const AI = ({ lang }: { lang: Lang }) => {
  const c = t[lang].ai;

  return (
    <section id="ia" className="bg-black px-5 md:px-20 pt-10 md:pt-14 pb-10 md:pb-14 flex flex-col justify-center border-t border-white/[0.1]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px 0px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8 md:mb-12 flex flex-col gap-3 max-w-[580px]"
      >
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase">{c.eyebrow}</p>
        <h2
          className="text-white font-semibold leading-[1.08]"
          style={{ fontSize: "clamp(30px, 4.5vw, 54px)", letterSpacing: "-0.03em", whiteSpace: "pre-line" }}
        >
          {c.title}
        </h2>
        <p className="text-white/40 leading-relaxed" style={{ fontSize: 15, lineHeight: 1.7 }}>{c.sub}</p>
      </motion.div>

      <div className="grid gap-3 md:grid-cols-3">
        {c.items.map((item, i) => (
          <AICard key={item.num} item={item} i={i} />
        ))}
      </div>
    </section>
  );
};

export default AI;
