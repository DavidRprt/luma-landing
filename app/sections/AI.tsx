"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

// ── Visuals ────────────────────────────────────────────────────────────────────

function ChatVisual({ inView }: { inView: boolean }) {
  const messages = [
    { from: "user", text: "¿Podés ayudarme con mis ventas?" },
    { from: "ai", text: "Claro. Analizando tus datos..." },
    { from: "ai", text: "Tus conversiones bajan un 40% los lunes. ¿Querés que programe una campaña automática?" },
  ];
  return (
    <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-2 pointer-events-none">
      {messages.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 + i * 0.25, duration: 0.4, ease: "easeOut" }}
          className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
        >
          <span
            className={`text-[10px] leading-relaxed px-3 py-1.5 rounded-xl max-w-[80%] ${
              m.from === "user"
                ? "bg-white/10 text-white/60"
                : "bg-blue-500/15 text-blue-300/80 border border-blue-500/10"
            }`}
          >
            {m.text}
          </span>
        </motion.div>
      ))}
      {/* typing indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.1 }}
        className="flex justify-start"
      >
        <span className="bg-blue-500/10 border border-blue-500/10 px-3 py-1.5 rounded-xl flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={inView ? { opacity: [0.2, 1, 0.2] } : {}}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
              className="w-1 h-1 rounded-full bg-blue-400/60 block"
            />
          ))}
        </span>
      </motion.div>
    </div>
  );
}

function FlowVisual({ inView }: { inView: boolean }) {
  const nodes = [
    { x: 20, y: 50, label: "Trigger" },
    { x: 50, y: 50, label: "IA" },
    { x: 80, y: 50, label: "Acción" },
  ];
  const paths = ["M72,50 L118,50", "M192,50 L238,50"];
  return (
    <div className="absolute top-8 right-6 w-48 pointer-events-none">
      <svg width="100%" height="60" viewBox="0 0 280 60" fill="none">
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="rgba(139,92,246,0.35)"
            strokeWidth="1"
            strokeDasharray="4 3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.3, duration: 0.6 }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 + i * 0.25, duration: 0.35 }}
          >
            <rect
              x={n.x * 2.8 - 24} y={38}
              width={48} height={24}
              rx={12}
              fill={i === 1 ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)"}
              stroke={i === 1 ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}
              strokeWidth={1}
            />
            <text
              x={n.x * 2.8}
              y={53}
              textAnchor="middle"
              fontSize={9}
              fill={i === 1 ? "rgba(167,139,250,0.9)" : "rgba(255,255,255,0.35)"}
              fontFamily="monospace"
            >
              {n.label}
            </text>
          </motion.g>
        ))}
      </svg>
      {/* flow examples */}
      <div className="flex flex-col gap-1.5 mt-3">
        {["Nuevo lead → Email personalizado", "Formulario → CRM + Slack", "Venta → Reporte IA"].map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.7 + i * 0.12, duration: 0.35 }}
            className="flex items-center gap-2"
          >
            <div className="w-1 h-1 rounded-full bg-violet-400/40 shrink-0" />
            <span className="text-white/25 text-[10px] font-mono">{t}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsVisual({ inView }: { inView: boolean }) {
  const bars = [42, 68, 55, 80, 63, 90, 74];
  const metrics = [
    { label: "Conversión", value: "+34%", color: "text-blue-400/80" },
    { label: "Tiempo resp.", value: "−82%", color: "text-violet-400/80" },
  ];
  return (
    <div className="absolute top-8 right-8 pointer-events-none flex flex-col gap-4 items-end">
      <div className="flex items-end gap-1.5 h-14">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={inView ? { scaleY: 1, opacity: 1 } : {}}
            transition={{ delay: 0.2 + i * 0.07, duration: 0.45, ease: "easeOut" }}
            style={{ height: `${h * 0.56}px` }}
            className="w-3.5 rounded-sm bg-gradient-to-t from-violet-500/60 to-violet-300/20 origin-bottom"
          />
        ))}
      </div>
      <div className="flex gap-4">
        {metrics.map((m) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="flex flex-col items-end gap-0.5"
          >
            <span className={`text-sm font-semibold ${m.color}`}>{m.value}</span>
            <span className="text-white/20 text-[9px] font-mono uppercase tracking-wider">{m.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const capabilities = [
  {
    number: "01",
    title: "Chatbots inteligentes",
    desc: "Agentes conversacionales entrenados con tu negocio. Atienden, venden y resuelven 24/7.",
    visual: "chat",
    col: "md:col-span-5",
    hoverGradient: "from-blue-950/40",
    hoverShadow: "hover:shadow-blue-950/50",
  },
  {
    number: "02",
    title: "Automatización de procesos",
    desc: "Conectamos tus herramientas y eliminamos el trabajo manual con flujos inteligentes.",
    visual: "flow",
    col: "md:col-span-4",
    hoverGradient: "from-violet-950/40",
    hoverShadow: "hover:shadow-violet-950/50",
  },
  {
    number: "03",
    title: "Análisis y reportes",
    desc: "Dashboards que se actualizan solos y resúmenes generados por IA para tomar mejores decisiones.",
    visual: "analytics",
    col: "md:col-span-3",
    hoverGradient: "from-indigo-950/40",
    hoverShadow: "hover:shadow-indigo-950/50",
  },
];

// ── Card ──────────────────────────────────────────────────────────────────────

function CapabilityCard({ c, i }: { c: (typeof capabilities)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
      className={`group relative ${c.col} min-h-[280px] rounded-2xl border border-white/[0.07] bg-[#0b0b0b] overflow-hidden hover:border-white/[0.13] transition-all duration-500 hover:shadow-2xl ${c.hoverShadow} flex flex-col`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${c.hoverGradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />

      {c.visual === "chat"      && <ChatVisual      inView={inView} />}
      {c.visual === "flow"      && <FlowVisual      inView={inView} />}
      {c.visual === "analytics" && <AnalyticsVisual inView={inView} />}

      <div className="relative z-10 p-8 flex flex-col gap-2">
        <span className="text-white/15 text-xs font-mono mb-1">{c.number}</span>
        <h3 className="text-white text-xl md:text-2xl font-semibold leading-snug">{c.title}</h3>
        <p className="text-white/35 text-sm leading-relaxed max-w-xs">{c.desc}</p>
      </div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

const AI = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-60px 0px" });

  return (
    <>
      <section id="ia" className="bg-black px-5 md:px-20 pt-20 pb-20 flex flex-col justify-center">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-14"
        >
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">Inteligencia artificial</p>
          <h2 className="text-3xl md:text-5xl font-semibold text-white max-w-xl">
            IA que trabaja<br />por tu negocio.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[5fr_4fr_3fr] gap-3">
          {capabilities.map((c, i) => (
            <CapabilityCard key={c.title} c={c} i={i} />
          ))}
        </div>
      </section>

      {/* CTA / Contacto */}
      <section
        id="contacto"
        className="bg-black px-5 md:px-20 py-28 border-t border-white/[0.06]"
      >
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 28 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-10"
        >
          <div className="flex flex-col gap-4 max-w-lg">
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase">Contacto</p>
            <h2 className="text-4xl md:text-6xl font-semibold text-white leading-[1.05]">
              ¿Empezamos?
            </h2>
            <p className="text-white/40 text-base leading-relaxed">
              Contanos tu proyecto y te respondemos en menos de 24 hs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:hola@luma.com"
              className="group flex items-center justify-center gap-2 bg-white text-black text-sm font-medium rounded-full px-7 py-3.5 hover:bg-white/85 transition-colors duration-300"
            >
              Hablemos
              <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </a>
            <a
              href="mailto:hola@luma.com"
              className="flex items-center justify-center text-white/40 hover:text-white/70 text-sm border border-white/10 hover:border-white/25 rounded-full px-7 py-3.5 transition-all duration-300"
            >
              hola@luma.com
            </a>
          </div>
        </motion.div>

        {/* footer line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ctaInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-between mt-20 pt-8 border-t border-white/[0.06]"
        >
          <span className="text-white/20 text-xs font-semibold">_luma</span>
          <span className="text-white/15 text-xs font-mono">© 2025</span>
        </motion.div>
      </section>
    </>
  );
};

export default AI;
