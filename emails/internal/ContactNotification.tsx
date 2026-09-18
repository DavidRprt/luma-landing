import { Heading, Hr, Text } from "@react-email/components";
import type { Lang } from "../../app/constants/translations";

// Mail interno (al equipo) — siempre en español, sin la caja de marca de los
// emails de cliente: es una notificación de trabajo, no algo que represente
// a _luma hacia afuera. El idioma del sitio queda como un dato más, para
// saber en qué idioma seguir la conversación con esa persona.
const LANG_LABEL: Record<Lang, string> = {
  es: "Español",
  en: "Inglés",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Text style={{ margin: "0 0 10px", fontSize: 14, lineHeight: 1.5, color: "#111318" }}>
      <strong>{label}:</strong> {value}
    </Text>
  );
}

interface ContactNotificationProps {
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string;
  motivo: string;
  mensaje: string;
  lang: Lang;
}

export default function ContactNotification({
  nombre,
  email,
  telefono,
  empresa,
  motivo,
  mensaje,
  lang,
}: ContactNotificationProps) {
  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 14, color: "#111318", maxWidth: 560 }}>
      <Heading style={{ margin: "0 0 16px", fontSize: 20 }}>Nueva consulta desde underluma.com</Heading>
      <Field label="Nombre" value={nombre} />
      <Field label="Email" value={email} />
      <Field label="Teléfono" value={telefono} />
      {empresa && <Field label="Empresa" value={empresa} />}
      <Field label="Motivo" value={motivo} />
      <Field label="Idioma del sitio" value={LANG_LABEL[lang]} />
      <Hr style={{ borderColor: "#e4e6ea", margin: "16px 0" }} />
      <Text style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "#111318" }}>Mensaje:</Text>
      <Text style={{ margin: 0, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-line" }}>{mensaje}</Text>
    </div>
  );
}
