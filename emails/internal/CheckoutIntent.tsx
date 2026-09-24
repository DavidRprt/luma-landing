import { Heading, Hr, Text } from "@react-email/components";
import type { Lang } from "../../app/constants/translations";

// Se dispara apenas alguien completa el formulario de /planes/empezar, ANTES
// de que Mercado Pago confirme nada — así el equipo tiene estos datos para
// contactar a la persona incluso si abandona el pago. Si termina suscribiendo,
// va a llegar también el aviso de "Suscripción authorized" del webhook — con
// email en común, así que ambos se pueden cruzar a mano.
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

interface CheckoutIntentProps {
  planName: string;
  email: string;
  telefono: string;
  empresa: string;
  descripcion?: string;
  lang: Lang;
}

export default function CheckoutIntent({
  planName,
  email,
  telefono,
  empresa,
  descripcion,
  lang,
}: CheckoutIntentProps) {
  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 14, color: "#111318", maxWidth: 560 }}>
      <Heading style={{ margin: "0 0 16px", fontSize: 20 }}>
        {lang === "en" ? "Nueva solicitud de plan (versión en inglés)" : "Nuevo intento de checkout"}
      </Heading>
      <Text style={{ margin: "0 0 16px", fontSize: 13, lineHeight: 1.5, color: "#5b5f66" }}>
        {lang === "en"
          ? "Pidió el plan desde la versión en inglés, que todavía no tiene cobro automático. Hay que enviarle el link de pago a mano (respondiendo a su email)."
          : "Completó el formulario de suscripción y va camino a Mercado Pago — todavía no confirmó el pago."}
      </Text>
      <Field label="Plan" value={planName} />
      <Field label="Email" value={email} />
      <Field label="Teléfono" value={telefono} />
      <Field label="Empresa" value={empresa} />
      <Field label="Idioma del sitio" value={LANG_LABEL[lang]} />
      {descripcion && (
        <>
          <Hr style={{ borderColor: "#e4e6ea", margin: "16px 0" }} />
          <Text style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "#111318" }}>Descripción del negocio:</Text>
          <Text style={{ margin: 0, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-line" }}>{descripcion}</Text>
        </>
      )}
    </div>
  );
}
