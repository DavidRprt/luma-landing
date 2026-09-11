"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Dialog } from "radix-ui";
import Image from "next/image";
import {
  LayoutDashboard, CreditCard, PackageSearch, Users,
  FileText, MessageSquare, Upload, Database,
  MousePointerClick, Server, Bot, Timer, Languages,
  Plus, X, ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { t, type Lang } from "../constants/translations";

const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  payment: CreditCard,
  catalog: PackageSearch,
  users: Users,
  docs: FileText,
  chat: MessageSquare,
  upload: Upload,
  database: Database,
  conversion: MousePointerClick,
  backend: Server,
  ai: Bot,
  timer: Timer,
  lang: Languages,
};

// Real brand marks (CC0, simpleicons.org), inlined so no color/logo drifts from the monochrome UI — rendered with currentColor.
const BRAND_ICONS = {
  mercadopago: {
    viewBox: "0 0 24 24",
    path: "M11.115 16.479a.93.927 0 0 1-.939-.886c-.002-.042-.006-.155-.103-.155-.04 0-.074.023-.113.059-.112.103-.254.206-.46.206a.816.814 0 0 1-.305-.066c-.535-.214-.542-.578-.521-.725.006-.038.007-.08-.02-.11l-.032-.03h-.034c-.027 0-.055.012-.093.039a.788.786 0 0 1-.454.16.7.699 0 0 1-.253-.05c-.708-.27-.65-.928-.617-1.126.005-.041-.005-.072-.03-.092l-.05-.04-.047.043a.728.726 0 0 1-.505.203.73.728 0 0 1-.732-.725c0-.4.328-.722.732-.722.364 0 .675.27.721.63l.026.195.11-.165c.01-.018.307-.46.852-.46.102 0 .21.016.316.05.434.13.508.52.519.68.008.094.075.1.09.1.037 0 .064-.024.083-.045a.746.744 0 0 1 .54-.225c.128 0 .263.03.402.09.69.293.379 1.158.374 1.167-.058.144-.061.207-.005.244l.027.013h.02c.03 0 .07-.014.134-.035.093-.032.235-.08.367-.08a.944.942 0 0 1 .94.93.936.934 0 0 1-.94.928zm7.302-4.171c-1.138-.98-3.768-3.24-4.481-3.77-.406-.302-.685-.462-.928-.533a1.559 1.554 0 0 0-.456-.07c-.182 0-.376.032-.58.095-.46.145-.918.505-1.362.854l-.023.018c-.414.324-.84.66-1.164.73a1.986 1.98 0 0 1-.43.049c-.362 0-.687-.104-.81-.258-.02-.025-.007-.066.04-.125l.008-.008 1-1.067c.783-.774 1.525-1.506 3.23-1.545h.085c1.062 0 2.12.469 2.24.524a7.03 7.03 0 0 0 3.056.724c1.076 0 2.188-.263 3.354-.795a9.135 9.11 0 0 0-.405-.317c-1.025.44-2.003.66-2.946.66-.962 0-1.925-.229-2.858-.68-.05-.022-1.22-.567-2.44-.57-.032 0-.065 0-.096.002-1.434.033-2.24.536-2.782.976-.528.013-.982.138-1.388.25-.361.1-.673.186-.979.185-.125 0-.35-.01-.37-.012-.35-.01-2.115-.437-3.518-.962-.143.1-.28.203-.415.31 1.466.593 3.25 1.053 3.812 1.089.157.01.323.027.491.027.372 0 .744-.103 1.104-.203.213-.059.446-.123.692-.17l-.196.194-1.017 1.087c-.08.08-.254.294-.14.557a.705.703 0 0 0 .268.292c.243.162.677.27 1.08.271.152 0 .297-.015.43-.044.427-.095.874-.448 1.349-.82.377-.296.913-.672 1.323-.782a1.494 1.49 0 0 1 .37-.05.611.61 0 0 1 .095.005c.27.034.533.125 1.003.472.835.62 4.531 3.815 4.566 3.846.002.002.238.203.22.537-.007.186-.11.352-.294.466a.902.9 0 0 1-.484.15.804.802 0 0 1-.428-.124c-.014-.01-1.28-1.157-1.746-1.543-.074-.06-.146-.115-.22-.115a.122.122 0 0 0-.096.045c-.073.09.01.212.105.294l1.48 1.47c.002 0 .184.17.204.395.012.244-.106.447-.35.606a.957.955 0 0 1-.526.171.766.764 0 0 1-.42-.127l-.214-.206a21.035 20.978 0 0 0-1.08-1.009c-.072-.058-.148-.112-.221-.112a.127.127 0 0 0-.094.038c-.033.037-.056.103.028.212a.698.696 0 0 0 .075.083l1.078 1.198c.01.01.222.26.024.511l-.038.048a1.18 1.178 0 0 1-.1.096c-.184.15-.43.164-.527.164a.8.798 0 0 1-.147-.012c-.106-.018-.178-.048-.212-.089l-.013-.013c-.06-.06-.602-.609-1.054-.98-.059-.05-.133-.11-.21-.11a.128.128 0 0 0-.096.042c-.09.096.044.24.1.293l.92 1.003a.204.204 0 0 1-.033.062c-.033.044-.144.155-.479.196a.91.907 0 0 1-.122.007c-.345 0-.712-.164-.902-.264a1.343 1.34 0 0 0 .13-.576 1.368 1.365 0 0 0-1.42-1.357c.024-.342-.025-.99-.697-1.274a1.455 1.452 0 0 0-.575-.125c-.146 0-.287.025-.42.075a1.153 1.15 0 0 0-.671-.564 1.52 1.515 0 0 0-.494-.085c-.28 0-.537.08-.767.242a1.168 1.165 0 0 0-.903-.43 1.173 1.17 0 0 0-.82.335c-.287-.217-1.425-.93-4.467-1.613a17.39 17.344 0 0 1-.692-.189 4.822 4.82 0 0 0-.077.494l.67.157c3.108.682 4.136 1.391 4.309 1.525a1.145 1.142 0 0 0-.09.442 1.16 1.158 0 0 0 1.378 1.132c.096.467.406.821.879 1.003a1.165 1.162 0 0 0 .415.08c.09 0 .179-.012.266-.034.086.22.282.493.722.668a1.233 1.23 0 0 0 .457.094c.122 0 .241-.022.355-.063a1.373 1.37 0 0 0 1.269.841c.37.002.726-.147.985-.41.221.121.688.341 1.163.341.06 0 .118-.002.175-.01.47-.059.689-.24.789-.382a.571.57 0 0 0 .048-.078c.11.032.234.058.373.058.255 0 .501-.086.75-.265.244-.174.418-.424.444-.637v-.01c.083.017.167.026.251.026.265 0 .527-.082.773-.242.48-.31.562-.715.554-.98a1.28 1.279 0 0 0 .978-.194 1.04 1.04 0 0 0 .502-.808 1.088 1.085 0 0 0-.16-.653c.804-.342 2.636-1.003 4.795-1.483a4.734 4.721 0 0 0-.067-.492 27.742 27.667 0 0 0-5.049 1.62zm5.123-.763c0 4.027-5.166 7.293-11.537 7.293-6.372 0-11.538-3.266-11.538-7.293 0-4.028 5.165-7.293 11.539-7.293 6.371 0 11.537 3.265 11.537 7.293zm.46.004c0-4.272-5.374-7.755-12-7.755S.002 7.277.002 11.55L0 12.004c0 4.533 4.695 8.203 11.999 8.203 7.347 0 12-3.67 12-8.204z",
  },
} as const satisfies Record<string, { viewBox: string; path: string }>;

type BrandName = keyof typeof BRAND_ICONS;

function BrandIcon({ name, size = 12 }: { name: BrandName; size?: number }) {
  const icon = BRAND_ICONS[name];
  return (
    <svg viewBox={icon.viewBox} width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

// Highlight icon key -> real logo override (falls back to the generic lucide icon otherwise).
const HIGHLIGHT_BRAND: Partial<Record<string, BrandName>> = {
  payment: "mercadopago",
};

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

const STATIC_IMAGES: Record<string, { src: string; alt: string }> = {
  redxmayor: { src: "/redxmayor.png", alt: "Red X Mayor" },
  fluxia: { src: "/fluxia.png", alt: "Fluxia Group" },
  nash: { src: "/nash.png", alt: "Nash" },
  seofy: { src: "/seofy.png", alt: "SeoFy" },
};

function WorkImg({ img, lang }: { img: string; lang: Lang }) {
  if (img === "pulse") return <PulseChatPreview lang={lang} />;
  const staticImg = STATIC_IMAGES[img];
  if (staticImg) return (
    <div className="w-full overflow-hidden shrink-0">
      <Image src={staticImg.src} alt={staticImg.alt} width={0} height={0} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px" className="w-full h-auto block" />
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

export type Highlight = { icon: string; title: string; desc: string };
export type Work = {
  num: string; title: string; category: string; year: string; desc: string;
  stat: string; img: string; link?: string;
  highlights?: readonly Highlight[];
};

function HighlightGrid({ highlights }: { highlights: readonly Highlight[] }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 mb-6">
      {highlights.map((h) => {
        const brand = HIGHLIGHT_BRAND[h.icon];
        const Icon = HIGHLIGHT_ICONS[h.icon] ?? Server;
        return (
          <div
            key={h.title}
            className="flex gap-3 rounded-xl p-3.5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="shrink-0 flex items-center justify-center rounded-lg"
              style={{ width: 32, height: 32, background: "rgba(106,169,255,0.1)", color: "#6aa9ff" }}
            >
              {brand ? <BrandIcon name={brand} size={16} /> : <Icon size={16} />}
            </div>
            <div>
              <p className="text-white/80 font-medium mb-0.5" style={{ fontSize: 13 }}>{h.title}</p>
              <p className="text-white/35" style={{ fontSize: 12.5, lineHeight: 1.55 }}>{h.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function WorkCard({
  w,
  i,
  cta,
  detailsCta,
  closeCta,
  lang,
}: {
  w: Work;
  i: number;
  cta: string;
  detailsCta: string;
  closeCta: string;
  lang: Lang;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
      className="work-card rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#0d0d13" }}
    >
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="group flex flex-col flex-1 text-left"
            style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer", font: "inherit", color: "inherit" }}
          >
            <WorkImg img={w.img} lang={lang} />
            <div className="flex flex-col flex-1 p-5 pb-6 border-t border-white/[0.12] relative overflow-hidden w-full">
              <span
                aria-hidden="true"
                className="absolute font-mono select-none pointer-events-none"
                style={{ top: -10, right: 14, fontSize: 92, fontWeight: 700, color: "rgba(255,255,255,0.035)", lineHeight: 1, letterSpacing: "-0.04em" }}
              >
                {w.num}
              </span>
              <div className="relative flex flex-col flex-1 w-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="uppercase text-white/[0.28]" style={{ fontSize: 10, letterSpacing: "0.2em" }}>{w.category}</span>
                  <span className="font-mono text-white/[0.18]" style={{ fontSize: 10 }}>{w.year}</span>
                </div>
                <h3 className="text-white font-semibold mb-2" style={{ fontSize: 26, letterSpacing: "-0.025em" }}>{w.title}</h3>
                <p className="text-white/[0.38] leading-relaxed flex-1 mb-4" style={{ fontSize: 13, lineHeight: 1.65 }}>{w.desc}</p>
                {w.stat && (
                  <div
                    className="font-mono w-fit mb-4"
                    style={{ fontSize: 11, color: "#6aa9ff", background: "rgba(106,169,255,0.08)", padding: "5px 10px", borderRadius: 6, letterSpacing: "0.01em" }}
                  >
                    {w.stat}
                  </div>
                )}
                <span
                  className="flex items-center gap-1.5 text-white/35 transition-colors duration-300 group-hover:text-white/75 mt-auto"
                  style={{ fontSize: 12, letterSpacing: "0.06em" }}
                >
                  <span
                    className="flex items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-90"
                    style={{ width: 16, height: 16, border: "1px solid rgba(255,255,255,0.25)" }}
                  >
                    <Plus size={10} />
                  </span>
                  {detailsCta}
                </span>
              </div>
            </div>
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 data-[state=open]:[animation:luma-overlay-in_0.2s_ease-out] data-[state=closed]:[animation:luma-overlay-out_0.15s_ease-in]"
            style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(3px)", zIndex: 100 }}
          />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 w-[92vw] max-w-xl overflow-hidden rounded-2xl border flex flex-col data-[state=open]:[animation:luma-dialog-in_0.28s_cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:[animation:luma-dialog-out_0.18s_ease-in]"
            style={{
              transform: "translate(-50%, -50%)",
              borderColor: "rgba(255,255,255,0.1)",
              background: "#0d0d13",
              maxHeight: "88vh",
              boxShadow: "0 40px 100px -20px rgba(0,0,0,0.7)",
              zIndex: 101,
            }}
          >
            <div className="relative shrink-0">
              <WorkImg img={w.img} lang={lang} />
              <Dialog.Close asChild>
                <button
                  aria-label={closeCta}
                  className="absolute flex items-center justify-center rounded-full"
                  style={{ top: 12, right: 12, width: 32, height: 32, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.85)" }}
                >
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>
            <div className="overflow-y-auto p-6 md:p-8">
              <div className="flex items-center justify-between mb-3">
                <span className="uppercase text-white/[0.28]" style={{ fontSize: 10, letterSpacing: "0.2em" }}>{w.category}</span>
                <span className="font-mono text-white/[0.25]" style={{ fontSize: 10 }}>{w.year}</span>
              </div>
              <Dialog.Title asChild>
                <h3 className="text-white font-semibold mb-3" style={{ fontSize: 28, letterSpacing: "-0.025em" }}>{w.title}</h3>
              </Dialog.Title>
              {w.stat && (
                <div
                  className="font-mono w-fit mb-4"
                  style={{ fontSize: 11, color: "#6aa9ff", background: "rgba(106,169,255,0.08)", padding: "5px 10px", borderRadius: 6, letterSpacing: "0.01em" }}
                >
                  {w.stat}
                </div>
              )}
              <Dialog.Description asChild>
                <p className="text-white/[0.45] leading-relaxed mb-6" style={{ fontSize: 14, lineHeight: 1.7 }}>{w.desc}</p>
              </Dialog.Description>
              {w.highlights && w.highlights.length > 0 && <HighlightGrid highlights={w.highlights} />}
              {w.link && (
                <a
                  href={w.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full font-medium transition-opacity hover:opacity-80"
                  style={{ fontSize: 13, padding: "10px 20px", background: "white", color: "#0a0a0a" }}
                >
                  {cta}
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </motion.div>
  );
}
