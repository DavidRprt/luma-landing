"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { t, type Lang } from "../constants/translations";

interface Message {
  from: "ai" | "user";
  text: string;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .trim();
}

const ChatWidget = ({ lang }: { lang: Lang }) => {
  const c = t[lang].contact;
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const convIdRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startConversation = () => {
    if (started) return;
    setStarted(true);
    setBusy(true);
    fetch("/api/bot-info")
      .then((r) => r.json())
      .then(({ mensaje_inicial }) => {
        if (mensaje_inicial) {
          setMsgs([{ from: "ai", text: stripMarkdown(mensaje_inicial) }]);
          setBusy(false);
          return;
        }

        return fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mensaje: "hola", conversacion_id: null }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.conversacion_id) {
              convIdRef.current = data.conversacion_id;
            }
            const reply = stripMarkdown(
              data.respuesta_formateada ?? data.respuesta_modelo ?? data.respuesta ?? c.greeting
            );
            setMsgs([{ from: "ai", text: reply }]);
          })
          .finally(() => setBusy(false));
      })
      .catch(() => {
        setMsgs([{ from: "ai", text: c.greeting }]);
        setBusy(false);
      });
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
      });
      const data = await res.json();

      if (data.conversacion_id) {
        convIdRef.current = data.conversacion_id;
      }

      const reply = stripMarkdown(
        data.respuesta_formateada ?? data.respuesta_modelo ?? data.respuesta ?? c.mockReply
      );
      setMsgs([...updated, { from: "ai", text: reply }]);
    } catch {
      setMsgs([...updated, { from: "ai", text: c.mockReply }]);
    } finally {
      setBusy(false);
    }
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) startConversation();
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-[200] flex flex-col overflow-hidden rounded-2xl"
            style={{
              bottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
              right: "max(16px, env(safe-area-inset-right, 0px))",
              width: "min(380px, calc(100vw - 32px))",
              height: "min(520px, calc(100dvh - 140px))",
              background: "#0d0d13",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2.5 px-[18px] py-3.5 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="relative w-2 h-2 shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <div
                  className="absolute rounded-full bg-blue-400/25"
                  style={{ inset: -3, animation: "luma-ping 2s ease-in-out infinite" }}
                />
              </div>
              <span className="text-white/70 font-semibold" style={{ fontSize: 12, letterSpacing: "0.02em" }}>
                {c.chatHeader}
              </span>
              <span className="ml-auto text-blue-400/70" style={{ fontSize: 11 }}>
                {c.online}
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label={c.chatClose}
                className="flex items-center justify-center rounded-full text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors duration-200"
                style={{ width: 22, height: 22, marginLeft: 4, border: "none", background: "transparent", cursor: "pointer" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex flex-col gap-2.5 p-4 overflow-y-auto"
              style={{ flex: 1, minHeight: 0, scrollbarWidth: "thin" }}
            >
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "9px 13px",
                      borderRadius: m.from === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                      background: m.from === "user" ? "rgba(255,255,255,0.08)" : "rgba(96,165,250,0.08)",
                      border: m.from === "user" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(96,165,250,0.12)",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.88)",
                      lineHeight: 1.6,
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div
                    className="flex gap-[5px] items-center"
                    style={{ padding: "9px 14px", background: "rgba(96,165,250,0.07)", border: "1px solid rgba(96,165,250,0.1)", borderRadius: "14px 14px 14px 3px" }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="block rounded-full bg-blue-400/70"
                        style={{ width: 5, height: 5, animation: `luma-typing 1.2s ease-in-out ${i * 0.2}s infinite` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2 p-3 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={c.placeholder}
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-[10px] text-white/80 placeholder:text-white/25 outline-none focus:border-white/[0.15] transition-colors duration-200"
                style={{ fontSize: 13, padding: "10px 14px" }}
              />
              <button
                onClick={send}
                disabled={busy || !input.trim()}
                className="rounded-[10px] border-none font-medium transition-opacity duration-200"
                style={{
                  padding: "10px 16px",
                  background: "white",
                  color: "#000",
                  fontSize: 15,
                  cursor: busy || !input.trim() ? "not-allowed" : "pointer",
                  opacity: busy || !input.trim() ? 0.35 : 1,
                }}
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble */}
      <button
        onClick={toggle}
        aria-label={open ? c.chatClose : c.chatOpen}
        className="fixed z-[200] flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
        style={{
          bottom: "max(20px, env(safe-area-inset-bottom, 0px))",
          right: "max(20px, env(safe-area-inset-right, 0px))",
          width: 56,
          height: 56,
          background: "linear-gradient(135deg, #6aa9ff, #2d6dd1)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(45,109,209,0.45)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.15 }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -45 }}
              transition={{ duration: 0.15 }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {!started && (
          <span
            className="absolute rounded-full bg-blue-300"
            style={{ top: 2, right: 2, width: 10, height: 10, border: "2px solid #050508", animation: "luma-ping 2s ease-in-out infinite" }}
          />
        )}
      </button>
    </>
  );
};

export default ChatWidget;
