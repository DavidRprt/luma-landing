"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowDownRight } from "lucide-react";

// ── Visuals — reciben inView del card padre ────────────────────────────────────

function DesignVisual({ inView }: { inView: boolean }) {
  const swatches = [
    "bg-blue-500/50", "bg-violet-500/45", "bg-blue-400/30",
    "bg-indigo-500/40", "bg-blue-400/55", "bg-violet-400/25",
    "bg-blue-300/25", "bg-indigo-400/35", "bg-violet-500/50",
  ];
  return (
    <div className="absolute top-7 right-7 pointer-events-none">
      <div className="w-36 rounded-xl border border-white/[0.07] overflow-hidden">
        <div className="h-5 bg-white/[0.04] flex items-center gap-1.5 px-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/15" />
          ))}
        </div>
        <div className="p-3 flex flex-col gap-2">
          <div className="h-7 rounded-md bg-gradient-to-r from-blue-500/25 to-violet-500/20" />
          <div className="grid grid-cols-3 gap-1.5">
            {swatches.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.35 + i * 0.045, duration: 0.3 }}
                className={`h-7 rounded-md ${c}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpeedVisual({ inView }: { inView: boolean }) {
  const heights = [28, 48, 36, 72, 52, 88, 60, 76];
  return (
    <div className="absolute bottom-8 right-8 flex items-end gap-1.5 pointer-events-none">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={inView ? { scaleY: 1, opacity: 1 } : {}}
          transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: "easeOut" }}
          style={{ height: `${h}px` }}
          className="w-3.5 rounded-sm bg-gradient-to-t from-indigo-500/70 to-indigo-300/20 origin-bottom"
        />
      ))}
    </div>
  );
}

function AIVisual({ inView }: { inView: boolean }) {
  const connections = [
    "M18,18 L50,48", "M55,10 L50,48", "M84,20 L50,48",
    "M10,52 L50,48", "M50,48 L82,58", "M50,48 L24,80",
    "M50,48 L65,76", "M82,58 L90,84",
  ];
  const dots: [number, number, boolean][] = [
    [18, 18, false], [55, 10, false], [84, 20, false],
    [10, 52, false], [50, 48, true],  [82, 58, false],
    [24, 80, false], [65, 76, false], [90, 84, false],
  ];
  return (
    <div className="absolute top-6 right-4 w-28 h-24 opacity-60 pointer-events-none">
      <svg width="104" height="96" viewBox="0 0 104 96" fill="none">
        {connections.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="rgba(167,139,250,0.4)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.55 }}
          />
        ))}
        {dots.map(([x, y, hl], i) => (
          <motion.circle
            key={i}
            cx={x} cy={y} r={hl ? 5.5 : 3}
            fill={hl ? "rgba(167,139,250,0.95)" : "rgba(167,139,250,0.45)"}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.06 }}
          />
        ))}
      </svg>
    </div>
  );
}

function MobileVisual({ inView }: { inView: boolean }) {
  return (
    <div className="absolute top-5 right-6 pointer-events-none flex items-end gap-3">

      {/* tablet — behind */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
        className="w-24 h-32 rounded-xl border border-white/10 bg-white/[0.015] relative overflow-hidden self-end mb-1"
      >
        <div className="absolute inset-0 p-2.5 flex flex-col gap-1.5 mt-1">
          <div className="h-4 rounded bg-gradient-to-r from-cyan-500/20 to-blue-500/15 w-full" />
          <div className="grid grid-cols-2 gap-1 flex-1">
            <div className="rounded bg-white/[0.04]" />
            <div className="rounded bg-white/[0.04]" />
            <div className="rounded bg-white/[0.04] col-span-2" />
          </div>
          <div className="h-1 rounded bg-white/[0.06] w-3/4" />
          <div className="h-1 rounded bg-white/[0.06] w-1/2" />
        </div>
        <div className="absolute bottom-1.5 inset-x-0 flex justify-center">
          <div className="w-8 h-0.5 rounded-full bg-white/10" />
        </div>
      </motion.div>

      {/* phone — foreground */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.55, ease: "easeOut" }}
        className="w-[52px] h-[96px] rounded-[20px] border border-white/20 bg-white/[0.03] relative overflow-hidden shadow-xl shadow-black/40"
      >
        <div className="absolute top-2 inset-x-0 flex justify-center z-10">
          <div className="w-6 h-[5px] rounded-full bg-white/15" />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="absolute top-0 inset-x-0 h-[38px] bg-gradient-to-br from-blue-600/30 via-cyan-500/20 to-transparent"
        />
        <div className="absolute inset-x-2 top-11 flex flex-col gap-1.5">
          {[["w-full", 0.45], ["w-4/5", 0.52], ["w-3/5", 0.58]].map(([w, d], i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: d as number, duration: 0.35, ease: "easeOut" }}
              className={`h-[5px] rounded-full bg-white/[0.12] ${w} origin-left`}
            />
          ))}
          <div className="grid grid-cols-2 gap-1 mt-0.5">
            {[["bg-blue-500/15", 0.65], ["bg-cyan-500/15", 0.72]].map(([c, d], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: d as number }}
                className={`h-7 rounded-md ${c}`}
              />
            ))}
          </div>
        </div>
        <div className="absolute bottom-1.5 inset-x-0 flex justify-center">
          <div className="w-6 h-[3px] rounded-full bg-white/15" />
        </div>
        <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_0_12px_rgba(96,165,250,0.07)]" />
      </motion.div>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const features = [
  {
    number: "01",
    title: "Diseño moderno",
    desc: "Sitios que destacan desde el primer scroll.",
    col: "md:col-span-3",
    visual: "design",
    hoverGradient: "from-blue-950/40",
    hoverShadow: "hover:shadow-blue-950/60",
  },
  {
    number: "02",
    title: "Rápidos y optimizados",
    desc: "Performance real, no solo en el papel.",
    col: "md:col-span-2",
    visual: "speed",
    hoverGradient: "from-indigo-950/40",
    hoverShadow: "hover:shadow-indigo-950/60",
  },
  {
    number: "03",
    title: "IA integrada",
    desc: "Chatbots, automatizaciones y más desde el día uno.",
    col: "md:col-span-2",
    visual: "ai",
    hoverGradient: "from-violet-950/40",
    hoverShadow: "hover:shadow-violet-950/60",
  },
  {
    number: "04",
    title: "Mobile first",
    desc: "Perfecto en cualquier dispositivo.",
    col: "md:col-span-3",
    visual: "mobile",
    hoverGradient: "from-cyan-950/35",
    hoverShadow: "hover:shadow-cyan-950/60",
  },
];

// ── Card ──────────────────────────────────────────────────────────────────────

function FeatureCard({ f, i }: { f: (typeof features)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
      className={`group relative ${f.col} min-h-[280px] rounded-2xl border border-white/[0.07] bg-[#0b0b0b] overflow-hidden hover:border-white/[0.13] transition-all duration-500 hover:shadow-2xl ${f.hoverShadow} flex flex-col`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${f.hoverGradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />

      {f.visual === "design" && <DesignVisual inView={inView} />}
      {f.visual === "speed" && <SpeedVisual inView={inView} />}
      {f.visual === "ai"    && <AIVisual    inView={inView} />}
      {f.visual === "mobile" && <MobileVisual inView={inView} />}

      <div className="relative z-10 p-8 flex-1 flex flex-col justify-end">
        <span className="text-white/15 text-xs font-mono mb-3 block">{f.number}</span>
        <h3 className="text-white text-2xl md:text-3xl font-semibold mb-2 leading-snug">
          {f.title}
        </h3>
        <p className="text-white/35 text-sm leading-relaxed max-w-[22rem]">{f.desc}</p>
      </div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

const Features = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      id="servicios"
      className="bg-black px-5 md:px-20 pt-28 pb-20 flex flex-col justify-center"
    >
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-14 flex items-end justify-between gap-6"
      >
        <div>
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">
            Servicios
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold text-white">
            Lo que hacemos.
          </h2>
        </div>

        <button
          onClick={() =>
            document.getElementById("trabajos")?.scrollIntoView({ behavior: "smooth" })
          }
          className="group flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors duration-300 shrink-0 mb-1"
        >
          <span className="text-xs tracking-[0.2em] uppercase">Ver trabajos</span>
          <div className="w-7 h-7 rounded-full border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-colors duration-300">
            <ArrowDownRight
              size={13}
              className="text-white/30 group-hover:text-white/70 transition-colors duration-300"
            />
          </div>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {features.map((f, i) => (
          <FeatureCard key={f.title} f={f} i={i} />
        ))}
      </div>
    </section>
  );
};

export default Features;
