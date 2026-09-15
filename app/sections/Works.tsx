"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WorkCard } from "../components/WorkCard";
import { t, type Lang } from "../constants/translations";
import { withLang } from "@/lib/i18n";

const HOMEPAGE_COUNT = 3;

const Works = ({ lang }: { lang: Lang }) => {
  const c = t[lang].works;
  const items = c.items.slice(0, HOMEPAGE_COUNT);

  return (
    <section id="trabajos" className="bg-black px-5 md:px-20 pt-10 md:pt-14 pb-10 md:pb-14 flex flex-col justify-center border-t border-white/[0.1]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px 0px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-6 md:mb-10"
      >
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">{c.eyebrow}</p>
        <h2 className="text-3xl md:text-5xl font-semibold text-white">{c.title}</h2>
      </motion.div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }}>
        {items.map((w, i) => (
          <WorkCard key={w.num} w={w} i={i} cta={c.cta} detailsCta={c.detailsCta} closeCta={c.closeCta} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px 0px" }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="flex justify-center mt-8 md:mt-10"
      >
        <Link
          href={withLang("/proyectos", lang)}
          className="group inline-flex items-center gap-2 rounded-full border font-medium transition-colors duration-300"
          style={{ fontSize: 14, padding: "12px 26px", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)" }}
        >
          {c.viewMore}
          <span className="flex items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight size={16} />
          </span>
        </Link>
      </motion.div>
    </section>
  );
};

export default Works;
