"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { t, type Lang } from "../constants/translations";

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4a8.94 8.94 0 0 0-7.74 13.4L3 20.5l3.2-1.28a8.9 8.9 0 0 0 4.85 1.42h.01a8.94 8.94 0 0 0 6.55-15.32Zm-5.55 13.7a7.4 7.4 0 0 1-3.78-1.03l-.27-.16-2.83.9.9-2.75-.18-.28a7.44 7.44 0 1 1 13.83-3.87 7.4 7.4 0 0 1-7.67 7.19Zm4.08-5.58c-.22-.11-1.3-.64-1.5-.72-.2-.07-.35-.11-.5.11s-.57.72-.7.87-.26.17-.48.06a6.06 6.06 0 0 1-1.78-1.1 6.68 6.68 0 0 1-1.23-1.53c-.13-.22 0-.34.1-.45.1-.1.22-.26.33-.39a1.5 1.5 0 0 0 .22-.37.4.4 0 0 0 0-.39c-.07-.11-.5-1.2-.68-1.65-.18-.43-.36-.37-.5-.38h-.43a.82.82 0 0 0-.6.28 2.5 2.5 0 0 0-.78 1.86 4.34 4.34 0 0 0 .91 2.3 9.95 9.95 0 0 0 3.8 3.36c.53.23.94.36 1.26.47a3.03 3.03 0 0 0 1.39.09 2.28 2.28 0 0 0 1.5-1.06 1.86 1.86 0 0 0 .13-1.06c-.06-.09-.2-.15-.42-.26Z" fill="currentColor" />
  </svg>
);

function ContactLink({ href, icon, label, value }: { href: string; icon: React.ReactNode; label: string; value: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-4 no-underline"
    >
      <div
        className="flex items-center justify-center rounded-full shrink-0 text-white/50 group-hover:text-white transition-colors duration-300"
        style={{ width: 46, height: 46, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-white/30 uppercase" style={{ fontSize: 11, letterSpacing: "0.18em" }}>{label}</span>
        <span className="text-white font-medium group-hover:text-blue-300 transition-colors duration-300" style={{ fontSize: 20, letterSpacing: "-0.01em" }}>
          {value}
        </span>
      </div>
    </a>
  );
}

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  mensaje: string;
}

const emptyForm: FormState = { nombre: "", email: "", telefono: "", empresa: "", mensaje: "" };

function ContactForm({ lang }: { lang: Lang }) {
  const c = t[lang].contact.form;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm(emptyForm);
    } catch {
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    fontSize: 13.5,
    padding: "12px 14px",
  };
  const inputClass =
    "w-full bg-white/[0.04] border border-white/[0.08] rounded-[10px] text-white/85 placeholder:text-white/25 outline-none focus:border-white/[0.2] transition-colors duration-200";
  const labelClass = "text-white/40 mb-1.5 block";
  const labelStyle: React.CSSProperties = { fontSize: 11.5, letterSpacing: "0.06em" };

  if (status === "success") {
    return (
      <div
        className="flex flex-col items-center justify-center text-center gap-3 rounded-2xl"
        style={{ background: "#0d0d13", border: "1px solid rgba(96,165,250,0.2)", padding: "48px 32px" }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 44, height: 44, background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.3)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 12l5 5L20 6" stroke="#6aa9ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-white/80" style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 320 }}>{c.success}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4 rounded-2xl"
      style={{ background: "#0d0d13", border: "1px solid rgba(255,255,255,0.08)", padding: "28px 24px" }}
    >
      <p className="text-white/70 font-semibold" style={{ fontSize: 14 }}>{c.title}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} style={labelStyle}>{c.name}</label>
          <input required value={form.nombre} onChange={update("nombre")} placeholder={c.namePlaceholder} className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>{c.phone}</label>
          <input required type="tel" value={form.telefono} onChange={update("telefono")} placeholder={c.phonePlaceholder} className={inputClass} style={inputStyle} />
        </div>
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>{c.email}</label>
        <input required type="email" value={form.email} onChange={update("email")} placeholder={c.emailPlaceholder} className={inputClass} style={inputStyle} />
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>
          {c.company} <span className="text-white/25">{c.companyOptional}</span>
        </label>
        <input value={form.empresa} onChange={update("empresa")} placeholder={c.companyPlaceholder} className={inputClass} style={inputStyle} />
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>{c.message}</label>
        <textarea
          required
          value={form.mensaje}
          onChange={update("mensaje")}
          placeholder={c.messagePlaceholder}
          rows={4}
          className={inputClass}
          style={{ ...inputStyle, resize: "vertical", minHeight: 90 }}
        />
      </div>

      {status === "error" && (
        <p className="text-red-400/80" style={{ fontSize: 12.5 }}>{c.error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-[10px] border-none font-medium transition-opacity duration-200 self-start"
        style={{
          padding: "12px 22px",
          background: "white",
          color: "#000",
          fontSize: 13.5,
          cursor: status === "sending" ? "not-allowed" : "pointer",
          opacity: status === "sending" ? 0.6 : 1,
        }}
      >
        {status === "sending" ? c.sending : c.submit}
      </button>
    </form>
  );
}

const Contact = ({ lang }: { lang: Lang }) => {
  const c = t[lang].contact;

  return (
    <section id="contacto" className="bg-black px-5 md:px-20 pt-20 pb-28" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 items-start" style={{ gap: "clamp(40px, 6vw, 80px)" }}>
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col"
        >
          <p className="uppercase text-white/30" style={{ fontSize: 11, letterSpacing: "0.3em", marginBottom: 16 }}>{c.eyebrow}</p>
          <h2 className="text-white font-semibold leading-[1.05]" style={{ fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-0.03em", marginBottom: 18 }}>{c.title}</h2>
          <p className="text-white/40 leading-relaxed" style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>{c.sub}</p>
          <div className="flex flex-col gap-6">
            <ContactLink href={`mailto:${c.email}`} icon={<MailIcon />} label={c.form.email} value={c.email} />
            <ContactLink href="https://wa.me/5491157387432" icon={<WhatsAppIcon />} label="WhatsApp" value={c.whatsapp} />
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          style={{ minWidth: 0 }}
        >
          <ContactForm key={lang} lang={lang} />
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
