"use client";

import { motion, AnimatePresence } from "motion/react";
import AuroraGlow from "../components/AuroraGlow";
import { t, type Lang } from "../constants/translations";

interface Props {
  lang: Lang;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const Hero = ({ lang }: Props) => {
  const c = t[lang].hero;

  const scrollToServices = () => {
    document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative flex flex-col h-[100dvh] items-center justify-center bg-black overflow-hidden">
      <AuroraGlow />

      <div className="relative flex flex-col items-center justify-between h-full w-full px-5 md:px-16 py-32 text-center">

        <div className="flex-1 flex flex-col items-center justify-center gap-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative inline-flex items-center gap-x-3 gap-y-1.5 flex-wrap justify-center rounded-full overflow-hidden"
            style={{
              padding: "9px 20px",
              border: "1px solid rgba(106,169,255,0.22)",
              background: "linear-gradient(135deg, rgba(106,169,255,0.09), rgba(106,169,255,0.02))",
            }}
          >
            <span
              aria-hidden="true"
              className="absolute pointer-events-none"
              style={{
                top: -20,
                bottom: -20,
                left: 0,
                width: "26%",
                background: "linear-gradient(115deg, transparent, rgba(255,255,255,0.16), transparent)",
                animation: "luma-eyebrow-shine 4.5s ease-in-out infinite",
              }}
            />
            {c.eyebrow.split(" · ").map((part, i) => (
              <span key={part} className="relative flex items-center gap-3">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="shrink-0 rounded-full"
                    style={{ width: 3, height: 3, background: "#6aa9ff", boxShadow: "0 0 6px rgba(106,169,255,0.7)" }}
                  />
                )}
                <span className="font-mono text-white/45 text-xs tracking-[0.18em] uppercase whitespace-nowrap">{part}</span>
              </span>
            ))}
          </motion.div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={lang}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-semibold tracking-tight leading-[1.05] text-white max-w-4xl"
            >
              {c.h1a}
              <br />
              {c.h1b}{" "}
              <span className="italic text-white/60">{c.italic}</span>
            </motion.h1>
          </AnimatePresence>
        </div>

        <motion.button
          onClick={scrollToServices}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
          className="group flex flex-col items-center gap-3 cursor-pointer"
        >
          <span className="text-white/30 text-xs tracking-[0.25em] uppercase group-hover:text-white/60 transition-colors duration-300">
            {c.scrollCta}
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white/0 to-white/30 group-hover:to-white/60 transition-all duration-300" />
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full border border-white/20 group-hover:border-white/50 flex items-center justify-center transition-colors duration-300"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v8M2 7l4 4 4-4" stroke="white" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.button>

      </div>
    </div>
  );
};

export default Hero;
