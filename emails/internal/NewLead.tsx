import { Heading, Hr, Link, Text } from "@react-email/components";

// Aviso interno de un lead de la landing de publicidad. Lo importante es que
// se pueda contestar en un toque: el link de WhatsApp ya viene con un mensaje
// armado. Responder rápido es lo que más pesa en la tasa de cierre.

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Text style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.5, color: "#111318" }}>
      <strong>{label}:</strong> {value}
    </Text>
  );
}

interface NewLeadProps {
  nombre: string;
  telefonoOriginal: string;
  whatsappUrl: string;
  negocio: string;
  plan: string;
  origen: string;
  recibidoEn: string;
}

export default function NewLead({ nombre, telefonoOriginal, whatsappUrl, negocio, plan, origen, recibidoEn }: NewLeadProps) {
  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 14, color: "#111318", maxWidth: 560 }}>
      <Heading style={{ margin: "0 0 16px", fontSize: 20 }}>Nuevo lead de la landing</Heading>
      <Text style={{ margin: "0 0 18px" }}>
        <Link
          href={whatsappUrl}
          style={{ background: "#25D366", color: "#06240f", padding: "12px 18px", borderRadius: 999, fontWeight: 700, textDecoration: "none", display: "inline-block" }}
        >
          Responder por WhatsApp →
        </Link>
      </Text>
      <Field label="Nombre" value={nombre} />
      <Field label="WhatsApp" value={telefonoOriginal} />
      <Field label="Negocio" value={negocio} />
      <Field label="Plan de interés" value={plan} />
      <Hr style={{ borderColor: "#e4e6ea", margin: "16px 0" }} />
      <Field label="Origen" value={origen} />
      <Field label="Recibido" value={recibidoEn} />
    </div>
  );
}
