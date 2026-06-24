"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { t, type Lang } from "../constants/translations";

interface Message {
  from: "ai" | "user";
  text: string;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .trim()
}

function AIChat({ lang }: { lang: Lang }) {
  const c = t[lang].contact;
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const convIdRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBusy(true)
    fetch("/api/bot-info")
      .then(r => r.json())
      .then(({ mensaje_inicial }) => {
        if (mensaje_inicial) {
          setMsgs([{ from: "ai", text: stripMarkdown(mensaje_inicial) }])
          setBusy(false)
          return
        }

        return fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mensaje: "hola", conversacion_id: null }),
        })
          .then(r => r.json())
          .then(data => {
            if (data.conversacion_id) {
              convIdRef.current = data.conversacion_id
            }
            const reply = stripMarkdown(
              data.respuesta_formateada ?? data.respuesta_modelo ?? data.respuesta ?? c.greeting
            )
            setMsgs([{ from: "ai", text: reply }])
          })
          .finally(() => setBusy(false))
      })
      .catch(() => {
        setMsgs([{ from: "ai", text: c.greeting }])
        setBusy(false)
      })
  }, [])

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, busy]);

  const send = async () => {
    if (!input.trim() || busy) return;
    const text = input.trim();
    setInput("");
    const updated: Message[] = [...msgs, { from: "user", text }];
    setMsgs(updated);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: text, conversacion_id: convIdRef.current }),
      })
      const data = await res.json()

      if (data.conversacion_id) {
        convIdRef.current = data.conversacion_id
      }

      const reply = stripMarkdown(
        data.respuesta_formateada ?? data.respuesta_modelo ?? data.respuesta ?? c.mockReply
      )
      setMsgs([...updated, { from: "ai", text: reply }])
    } catch {
      setMsgs([...updated, { from: "ai", text: c.mockReply }])
    } finally {
      setBusy(false)
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl" style={{ background: "#0d0d13", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-[18px] py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="relative w-2 h-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <div className="absolute rounded-full bg-blue-400/25" style={{ inset: -3, animation: "luma-ping 2s ease-in-out infinite" }} />
        </div>
        <span className="text-white/70 font-semibold" style={{ fontSize: 12, letterSpacing: "0.02em" }}>{c.chatHeader}</span>
        <span className="ml-auto text-blue-400/70" style={{ fontSize: 11 }}>{c.online}</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex flex-col gap-2.5 p-4 overflow-y-auto" style={{ height: 260, scrollbarWidth: "thin" }}>
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div style={{
              maxWidth: "82%", padding: "9px 13px",
              borderRadius: m.from === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
              background: m.from === "user" ? "rgba(255,255,255,0.08)" : "rgba(96,165,250,0.08)",
              border: m.from === "user" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(96,165,250,0.12)",
              fontSize: 13, color: "rgba(255,255,255,0.88)", lineHeight: 1.6,
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="flex gap-[5px] items-center" style={{ padding: "9px 14px", background: "rgba(96,165,250,0.07)", border: "1px solid rgba(96,165,250,0.1)", borderRadius: "14px 14px 14px 3px" }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="block rounded-full bg-blue-400/70" style={{ width: 5, height: 5, animation: `luma-typing 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={c.placeholder}
          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-[10px] text-white/80 placeholder:text-white/25 outline-none focus:border-white/[0.15] transition-colors duration-200"
          style={{ fontSize: 13, padding: "10px 14px" }}
        />
        <button
          onClick={send}
          disabled={busy || !input.trim()}
          className="rounded-[10px] border-none font-medium transition-opacity duration-200"
          style={{ padding: "10px 16px", background: "white", color: "#000", fontSize: 15, cursor: busy || !input.trim() ? "not-allowed" : "pointer", opacity: busy || !input.trim() ? 0.35 : 1 }}
        >
          →
        </button>
      </div>
    </div>
  );
}

const Contact = ({ lang }: { lang: Lang }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const c = t[lang].contact;

  return (
    <section id="contacto" className="bg-black px-5 md:px-20 pt-20 pb-28" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div ref={ref} className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 items-start" style={{ gap: "clamp(40px, 6vw, 80px)" }}>
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col"
        >
          <p className="uppercase text-white/30" style={{ fontSize: 11, letterSpacing: "0.3em", marginBottom: 16 }}>{c.eyebrow}</p>
          <h2 className="text-white font-semibold leading-[1.05]" style={{ fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-0.03em", marginBottom: 18 }}>{c.title}</h2>
          <p className="text-white/40 leading-relaxed" style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>{c.sub}</p>
          <a
            href={`mailto:${c.email}`}
            className="inline-flex items-center gap-1.5 text-white/35 hover:text-white/70 transition-colors duration-300 no-underline"
            style={{ fontSize: 13, letterSpacing: "0.04em" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {c.email}
          </a>
        </motion.div>

        {/* Right — chat */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          style={{ minWidth: 0 }}
        >
          <AIChat key={lang} lang={lang} />
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
