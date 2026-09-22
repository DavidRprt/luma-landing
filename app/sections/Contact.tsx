"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { t, type Lang } from "../constants/translations";
import { ShineButton } from "../components/ShineButton";

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 10a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" />
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
  motivo: string;
  mensaje: string;
}

const emptyForm: FormState = { nombre: "", email: "", telefono: "", empresa: "", motivo: "", mensaje: "" };

function ContactForm({ lang }: { lang: Lang }) {
  const c = t[lang].contact.form;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm(emptyForm);
    } catch {
      setStatus("error");
    }
  };

  // Sin caja ni fondo — el campo es solo una línea de base que se enciende
  // en celeste al enfocar. El span "underline" es hermano del input (no hijo)
  // para poder animarlo desde afuera con el truco `peer` de Tailwind, sin JS.
  const fieldClass =
    "peer w-full bg-transparent border-0 border-b border-white/[0.12] rounded-none text-white/90 placeholder:text-white/20 outline-none transition-colors duration-300 focus:border-transparent";
  const fieldStyle: React.CSSProperties = { fontSize: 15, padding: "8px 0 10px" };
  const underline = (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-0 bottom-0 w-full origin-left scale-x-0 transition-transform duration-300 ease-out peer-focus:scale-x-100"
      style={{ height: 1.5, background: "#6aa9ff" }}
    />
  );
  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="flex items-center gap-2 text-white/40 mb-2" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>
      <span className="shrink-0 rounded-full" style={{ width: 4, height: 4, background: "#6aa9ff" }} />
      {children}
    </label>
  );

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-3" style={{ padding: "40px 0" }}>
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 40, height: 40, background: "rgba(106,169,255,0.1)", border: "1px solid rgba(106,169,255,0.3)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 12l5 5L20 6" stroke="#6aa9ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-white/70" style={{ fontSize: 15, lineHeight: 1.6, maxWidth: 340 }}>{c.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col" style={{ gap: 22 }}>
      <p className="text-white/30 uppercase" style={{ fontSize: 11, letterSpacing: "0.3em" }}>{c.title}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 22 }}>
        <div className="relative">
          <Label>{c.name}</Label>
          <input required value={form.nombre} onChange={update("nombre")} placeholder={c.namePlaceholder} className={fieldClass} style={fieldStyle} />
          {underline}
        </div>
        <div className="relative">
          <Label>{c.phone}</Label>
          <input required type="tel" value={form.telefono} onChange={update("telefono")} placeholder={c.phonePlaceholder} className={fieldClass} style={fieldStyle} />
          {underline}
        </div>
      </div>

      <div className="relative">
        <Label>{c.email}</Label>
        <input required type="email" value={form.email} onChange={update("email")} placeholder={c.emailPlaceholder} className={fieldClass} style={fieldStyle} />
        {underline}
      </div>

      <div className="relative">
        <Label>
          {c.company} <span className="normal-case text-white/25">{c.companyOptional}</span>
        </Label>
        <input value={form.empresa} onChange={update("empresa")} placeholder={c.companyPlaceholder} className={fieldClass} style={fieldStyle} />
        {underline}
      </div>

      <div>
        <Label>{c.motivo}</Label>
        <div className="relative">
          <select
            required
            value={form.motivo}
            onChange={update("motivo")}
            className={`${fieldClass} appearance-none cursor-pointer`}
            style={{ ...fieldStyle, paddingRight: 22, color: form.motivo ? undefined : "rgba(255,255,255,0.2)" }}
          >
            <option value="" disabled style={{ color: "#000" }}>{c.motivoPlaceholder}</option>
            {c.motivoOptions.map((opt) => (
              <option key={opt} value={opt} style={{ color: "#000" }}>{opt}</option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-white/30"
            style={{ right: 2 }}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {underline}
        </div>
      </div>

      <div className="relative">
        <Label>{c.message}</Label>
        <textarea
          required
          value={form.mensaje}
          onChange={update("mensaje")}
          placeholder={c.messagePlaceholder}
          rows={3}
          className={fieldClass}
          style={{ ...fieldStyle, resize: "vertical", minHeight: 60 }}
        />
        {underline}
      </div>

      {status === "error" && (
        <p className="text-red-400/80" style={{ fontSize: 12.5 }}>{c.error}</p>
      )}

      <ShineButton type="submit" disabled={status === "sending"} className="self-start mt-2">
        {status === "sending" ? c.sending : c.submit}
        <ArrowRight size={15} />
      </ShineButton>
    </form>
  );
}

const Contact = ({ lang, standalone = false }: { lang: Lang; standalone?: boolean }) => {
  const c = t[lang].contact;

  return (
    <section
      id="contacto"
      className={`bg-black px-5 md:px-20 pb-28 ${standalone ? "pt-32" : "pt-20"}`}
      style={standalone ? undefined : { borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
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
            <ContactLink href="https://instagram.com/_underluma" icon={<InstagramIcon />} label="Instagram" value={c.instagram} />
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
