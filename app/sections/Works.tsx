"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight, ImageIcon } from "lucide-react";

const works = [
  {
    number: "01",
    title: "Studio Nómade",
    category: "Diseño · Desarrollo",
    year: "2025",
    desc: "Landing page para estudio de arquitectura con animaciones de scroll y galería de proyectos interactivos. Construida con Next.js y GSAP.",
    tags: ["Next.js", "GSAP", "Tailwind"],
    images: [null, null, null],
    accent: "from-blue-950/60 via-blue-900/20 to-transparent",
  },
  {
    number: "02",
    title: "Vetra Finance",
    category: "Desarrollo · IA",
    year: "2025",
    desc: "Dashboard financiero con chatbot integrado y reportes generados por IA en tiempo real. Autenticación, roles y visualización de datos.",
    tags: ["React", "OpenAI", "Supabase"],
    images: [null, null, null],
    accent: "from-violet-950/60 via-indigo-900/20 to-transparent",
  },
  {
    number: "03",
    title: "Bloom Market",
    category: "Diseño · Mobile",
    year: "2024",
    desc: "E-commerce mobile-first para marca de cosmética natural. Experiencia de compra optimizada, carrito persistente y checkout en un paso.",
    tags: ["Next.js", "Shopify", "Framer"],
    images: [null, null, null],
    accent: "from-cyan-950/60 via-blue-900/20 to-transparent",
  },
];

// Placeholder — reemplazá `src` con la ruta real cuando tengas las imágenes
function ImageFrame({ src, gradient }: { src: string | null; gradient: string }) {
  return (
    <div className="relative w-72 md:w-80 h-52 md:h-60 shrink-0 rounded-xl overflow-hidden border border-white/[0.07] bg-white/[0.02]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 opacity-20">
              <ImageIcon size={20} className="text-white" />
              <span className="text-white text-[10px] tracking-[0.2em] uppercase font-mono">imagen</span>
            </div>
          </div>
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>
      )}
    </div>
  );
}

function WorkItem({ w, i }: { w: (typeof works)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
      className="group border-b border-white/[0.07] py-12 md:py-16 hover:bg-white/[0.015] transition-colors duration-500 -mx-5 md:-mx-20 px-5 md:px-20"
    >
      {/* header row */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="flex items-baseline gap-4 md:gap-6">
          <span className="text-white/15 text-xs font-mono shrink-0">{w.number}</span>
          <h3 className="text-white text-2xl md:text-4xl font-semibold leading-tight">
            {w.title}
          </h3>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-white/20 text-xs font-mono hidden md:block">{w.year}</span>
          <button className="group/btn w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all duration-300">
            <ArrowUpRight
              size={15}
              className="text-white/30 group-hover/btn:text-white/70 transition-colors duration-300"
            />
          </button>
        </div>
      </div>

      {/* body: text + images */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* left — info */}
        <div className="md:w-[34%] flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-white/30 text-xs tracking-[0.25em] uppercase">{w.category}</span>
            <p className="text-white/40 text-sm leading-relaxed">{w.desc}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {w.tags.map((tag) => (
              <span
                key={tag}
                className="text-white/25 text-[11px] border border-white/[0.07] rounded-full px-3 py-1 font-mono tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* right — carousel */}
        <div className="md:flex-1 min-w-0">
          <div
            className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", paddingBottom: "2px" }}
          >
            {w.images.map((src, idx) => (
              <div key={idx} className="snap-start">
                <ImageFrame src={src} gradient={w.accent} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-3 h-px bg-white/15" />
            <span className="text-white/15 text-[10px] tracking-[0.25em] uppercase font-mono">
              deslizá
            </span>
            <div className="w-3 h-px bg-white/15" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const Works = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      id="trabajos"
      className="bg-black px-5 md:px-20 pt-20 pb-28 flex flex-col justify-center"
    >
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-16"
      >
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">Proyectos</p>
        <h2 className="text-3xl md:text-5xl font-semibold text-white">Lo que hemos hecho.</h2>
      </motion.div>

      <div className="border-t border-white/[0.07]">
        {works.map((w, i) => (
          <WorkItem key={w.title} w={w} i={i} />
        ))}
      </div>
    </section>
  );
};

export default Works;
