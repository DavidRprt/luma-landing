import { Button, Heading, Text } from "@react-email/components";
import type { Lang } from "../../app/constants/translations";
import { EmailLayout, emailAccent } from "../components/EmailLayout";

const COPY: Record<Lang, {
  preview: string;
  eyebrow: string;
  title: (name: string) => string;
  body: string;
  urgent: string;
  cta: string;
}> = {
  es: {
    preview: "Recibimos tu mensaje — te respondemos en menos de 24hs.",
    eyebrow: "Mensaje recibido",
    title: (name) => `¡Gracias por escribirnos, ${name}!`,
    body: "Recibimos tu consulta y la estamos revisando. Te vamos a responder a este mismo email en menos de 24hs con los detalles que necesitás.",
    urgent: "Si es algo urgente, escribinos directo por WhatsApp y te respondemos a la brevedad.",
    cta: "Escribinos por WhatsApp",
  },
  en: {
    preview: "We got your message — we'll reply within 24 hours.",
    eyebrow: "Message received",
    title: (name) => `Thanks for reaching out, ${name}!`,
    body: "We received your message and we're looking into it. We'll reply to this same email within 24 hours with the details you need.",
    urgent: "If it's urgent, message us directly on WhatsApp and we'll get back to you right away.",
    cta: "Message us on WhatsApp",
  },
};

interface ContactAutoReplyProps {
  nombre: string;
  whatsappUrl: string;
  lang?: Lang;
}

export default function ContactAutoReply({
  nombre = "Nombre",
  whatsappUrl = "https://wa.me/5491157387432",
  lang = "es",
}: ContactAutoReplyProps) {
  const c = COPY[lang];
  return (
    <EmailLayout preview={c.preview} lang={lang}>
      <Text style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: emailAccent }}>
        {c.eyebrow}
      </Text>
      <Heading style={{ margin: "0 0 16px", fontSize: 26, lineHeight: 1.25, color: "#111318" }}>
        {c.title(nombre)}
      </Heading>
      <Text style={{ margin: "0 0 28px", fontSize: 15, lineHeight: 1.6, color: "#4b4f58" }}>
        {c.body}
      </Text>

      <Text style={{ margin: "0 0 20px", fontSize: 14.5, lineHeight: 1.6, color: "#4b4f58" }}>
        {c.urgent}
      </Text>

      <Button
        href={whatsappUrl}
        style={{
          background: emailAccent,
          color: "#ffffff",
          fontSize: 14,
          fontWeight: 600,
          padding: "13px 26px",
          borderRadius: 999,
          textDecoration: "none",
        }}
      >
        {c.cta}
      </Button>
    </EmailLayout>
  );
}
