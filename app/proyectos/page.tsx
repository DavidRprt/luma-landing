"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import NavBar from "../components/NavBar";
import ChatWidget from "../components/ChatWidget";
import Footer from "../sections/Footer";
import { WorkCard } from "../components/WorkCard";
import { t, type Lang } from "../constants/translations";

export default function ProyectosPage() {
  const [lang, setLang] = useState<Lang>("es");
  const c = t[lang].works;
  const [filter, setFilter] = useState<string>(c.allFilter);

  const categories = useMemo(
    () => [c.allFilter, ...Array.from(new Set(c.items.map((w) => w.category)))],
    [c]
  );
  const filtered = filter === c.allFilter ? c.items : c.items.filter((w) => w.category === filter);

  return (
    <main>
      <NavBar lang={lang} setLang={setLang} homeHref="/" sectionsBase="/" />

      <section className="bg-black px-5 md:px-20 pt-32 pb-8 md:pb-10 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">{c.eyebrow}</p>
          <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4">{c.title}</h1>
          <p className="text-white/40 max-w-xl" style={{ fontSize: 15, lineHeight: 1.6 }}>{c.pageSubtitle}</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mt-8">
          {categories.map((cat) => {
            const active = cat === filter;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className="rounded-full font-medium transition-colors duration-300"
                style={{
                  fontSize: 13,
                  padding: "8px 18px",
                  border: `1px solid ${active ? "transparent" : "rgba(255,255,255,0.15)"}`,
                  background: active ? "white" : "transparent",
                  color: active ? "#0a0a0a" : "rgba(255,255,255,0.6)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-black px-5 md:px-20 pb-16 md:pb-24">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))" }}>
          {filtered.map((w, i) => (
            <WorkCard key={w.num} w={w} i={i} cta={c.cta} detailsCta={c.detailsCta} closeCta={c.closeCta} lang={lang} />
          ))}
        </div>
      </section>

      <Footer lang={lang} />
      <ChatWidget lang={lang} />
    </main>
  );
}
