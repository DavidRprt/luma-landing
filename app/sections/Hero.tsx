"use client";

import { motion } from "motion/react";
import { AuroraBackground } from "../ui/aurora-background";
import ScrambleText from "../components/ScrambleText";
import { t, type Lang } from "../constants/translations";

interface Props {
  lang: Lang;
}

const Hero = ({ lang }: Props) => {
  const c = t[lang].hero;

  const scrollToServices = () => {
    document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AuroraBackground>
      <div className="relative flex flex-col items-center justify-between h-full w-full px-5 md:px-16 py-32 text-center">

        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-white/40 text-xs tracking-[0.3em] uppercase"
          >
            {c.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-semibold tracking-tight leading-[1.05] text-white max-w-4xl"
          >
            <ScrambleText text={c.h1a} startDelay={80} duration={480} />
            <br />
            <ScrambleText text={c.h1b} startDelay={230} duration={420} />{" "}
            <span className="italic text-white/60">{c.italic}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="text-white/40 text-base md:text-lg max-w-md leading-relaxed whitespace-pre-line"
          >
            {c.sub}
          </motion.p>
        </div>

        <motion.button
          onClick={scrollToServices}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
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
    </AuroraBackground>
  );
};

export default Hero;
