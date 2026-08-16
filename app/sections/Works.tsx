"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { t, type Lang } from "../constants/translations";


const BotAvatar = ({ size }: { size: number }) => (
  <div
    className="rounded-full flex items-center justify-center font-bold text-white shrink-0"
    style={{ width: size, height: size, background: "linear-gradient(135deg, #6aa9ff, #2d6dd1)", fontSize: Math.round(size * 0.4) }}
  >
    R
  </div>
);

function PulseChatPreview({ lang }: { lang: Lang }) {
  const c = t[lang].pulseChat;
  return (
    <div
      className="w-full relative overflow-hidden shrink-0"
      style={{
        aspectRatio: "2940/1664",
        background: "linear-gradient(135deg, #0e1a36 0%, #0a1226 60%, #060a16 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 14px)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(60% 50% at 50% 0%, rgba(106,169,255,0.10), transparent 70%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent 30%)" }} />
      {/* Browser window */}
      <div
        className="absolute flex flex-col overflow-hidden"
        style={{ inset: 14, borderRadius: 12, background: "#0a0f1c", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 50px -20px rgba(0,0,0,0.7), 0 8px 24px -10px rgba(106,169,255,0.18)" }}
      >
        {/* Chat — flex column, children must not overflow */}
        <div className="flex flex-col min-h-0" style={{ flex: 1, background: "#0c1322", padding: "10px 14px 14px" }}>
          {/* Header */}
          <div className="flex items-center gap-2 shrink-0" style={{ paddingBottom: 8, marginBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <BotAvatar size={28} />
            <div>
              <div className="flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 700, color: "#e9edf3" }}>
                Raul
                <span className="flex items-center gap-1" style={{ fontSize: 9.5, fontWeight: 600, color: "#5fc48a" }}>
                  <span className="rounded-full inline-block" style={{ width: 4, height: 4, background: "#5fc48a" }} />
                  {c.online}
                </span>
              </div>
              <div style={{ fontSize: 10, color: "#8a93a3", marginTop: 1 }}>{c.role}</div>
            </div>
          </div>
          {/* Messages — overflow hidden so they never push the input */}
          <div className="flex flex-col shrink-0" style={{ gap: 6, overflow: "hidden" }}>
            <div className="flex justify-end">
              <div style={{ background: "#6aa9ff", color: "#06122a", fontWeight: 500, fontSize: 11, padding: "6px 10px", borderRadius: "9px 9px 2px 9px", maxWidth: "78%", lineHeight: 1.4 }}>
                {c.userMsg}
              </div>
            </div>
            <div className="flex gap-1.5 items-start">
              <BotAvatar size={20} />
              <div style={{ background: "#182135", border: "1px solid #232c44", borderRadius: "9px 9px 9px 2px", padding: "6px 10px", fontSize: 11, lineHeight: 1.45, color: "#e9edf3", maxWidth: "82%" }}>
                {c.botMsg}
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5, fontFamily: "monospace", fontSize: 9.5, color: "#6aa9ff", background: "rgba(106,169,250,0.08)", padding: "2px 6px", borderRadius: 4, width: "fit-content" }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                  {c.cite}
                </div>
              </div>
            </div>
            <div className="flex gap-1.5 items-center">
              <BotAvatar size={20} />
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#182135", border: "1px solid #232c44", borderRadius: "9px 9px 9px 2px", padding: "7px 10px" }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="block rounded-full" style={{ width: 4, height: 4, background: "#6aa9ff", opacity: 0.4, animation: `luma-typing 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
          {/* Input — always at the bottom */}
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0a1020", border: "1px solid #1d2638", borderRadius: 7, paddingTop: 7, paddingBottom: 7, paddingLeft: 10, paddingRight: 10, fontSize: 10.5 }}>
            <span style={{ color: "#555c6a" }}>{c.placeholder}</span>
            <div style={{ width: 18, height: 18, borderRadius: 5, background: "#6aa9ff", color: "#06122a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11 }}>→</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkImg({ img, lang }: { img: string; lang: Lang }) {
  if (img === "pulse")     return <PulseChatPreview lang={lang} />;
  if (img === "redxmayor") return (
    <div className="w-full overflow-hidden shrink-0">
      <Image src="/redxmayor.png" alt="Red X Mayor" width={0} height={0} sizes="100vw" className="w-full h-auto block" />
    </div>
  );
  if (img === "fluxia") return (
    <div className="w-full overflow-hidden shrink-0">
      <Image src="/fluxy.png" alt="Fluxy" width={0} height={0} sizes="100vw" className="w-full h-auto block" />
    </div>
  );
  return (
    <div className="w-full relative overflow-hidden shrink-0" style={{ aspectRatio: "2940/1664", background: "linear-gradient(135deg,rgba(109,40,217,0.18) 0%,rgba(0,0,0,0) 100%)" }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono uppercase text-white/[0.16]" style={{ fontSize: 10, letterSpacing: "0.22em" }}>preview</span>
      </div>
    </div>
  );
}

function WorkCard({
  w,
  i,
  cta,
  lang,
}: {
  w: { num: string; title: string; category: string; year: string; desc: string; stat: string; tags: readonly string[]; img: string; link?: string };
  i: number;
  cta: string;
  lang: Lang;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
      className="work-card rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#0d0d13", cursor: w.link ? "pointer" : "default" }}
    >
      {w.link ? (
        <a href={w.link} target="_blank" rel="noopener noreferrer" className="block">
          <WorkImg img={w.img} lang={lang} />
        </a>
      ) : (
        <WorkImg img={w.img} lang={lang} />
      )}
      <div className="flex flex-col flex-1 p-5 pb-6 border-t border-white/[0.12]">
        <div className="flex items-center mb-3">
          <span className="uppercase text-white/[0.28]" style={{ fontSize: 10, letterSpacing: "0.2em" }}>{w.category}</span>
        </div>
        <h3 className="text-white font-semibold mb-2" style={{ fontSize: 26, letterSpacing: "-0.025em" }}>{w.title}</h3>
        <p className="text-white/[0.38] leading-relaxed flex-1 mb-4" style={{ fontSize: 13, lineHeight: 1.65 }}>{w.desc}</p>
<div className="flex flex-wrap gap-[5px] mb-[18px]">
          {w.tags.map((tag) => (
            <span key={tag} className="font-mono text-white/25" style={{ fontSize: 11, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 999, padding: "3px 10px" }}>{tag}</span>
          ))}
        </div>
        {w.link && (
          <a
            href={w.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors duration-300"
            style={{ fontSize: 12, letterSpacing: "0.06em" }}
          >
            <span>{cta}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  );
}

const Works = ({ lang }: { lang: Lang }) => {
  const c = t[lang].works;

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

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {c.items.map((w, i) => (
          <WorkCard key={w.num} w={w} i={i} cta={c.cta} lang={lang} />
        ))}
      </div>
    </section>
  );
};

export default Works;
