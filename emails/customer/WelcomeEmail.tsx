import { Button, Heading, Section, Text } from "@react-email/components";
import { EmailLayout, emailAccent } from "../components/EmailLayout";

interface WelcomeEmailProps {
  planName: string;
  price: string;
  whatsappUrl: string;
}

export default function WelcomeEmail({
  planName = "Landing",
  price = "59",
  whatsappUrl = "https://wa.me/5491157387432",
}: WelcomeEmailProps) {
  return (
    <EmailLayout preview={`Tu plan ${planName} ya está activo — coordinamos el arranque por WhatsApp.`}>
      <Text style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: emailAccent }}>
        Suscripción confirmada
      </Text>
      <Heading style={{ margin: "0 0 16px", fontSize: 26, lineHeight: 1.25, color: "#111318" }}>
        ¡Listo, tu plan {planName} ya está en marcha!
      </Heading>
      <Text style={{ margin: "0 0 28px", fontSize: 15, lineHeight: 1.6, color: "#4b4f58" }}>
        Gracias por confiar en _luma. A partir de ahora tu sitio va a estar siempre online, y nosotros nos
        encargamos de todo lo técnico — hosting, dominio y mantenimiento incluidos.
      </Text>

      <Section style={{ background: "#f9fafb", border: "1px solid #e4e6ea", borderRadius: 12, padding: "18px 20px", marginBottom: 28 }}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tr>
            <td>
              <Text style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a8f98" }}>
                Plan
              </Text>
              <Text style={{ margin: "2px 0 0", fontSize: 17, fontWeight: 700, color: "#111318" }}>{planName}</Text>
            </td>
            <td align="right">
              <Text style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a8f98" }}>
                Precio
              </Text>
              <Text style={{ margin: "2px 0 0", fontSize: 17, fontWeight: 700, color: "#111318" }}>
                ${price}
                <span style={{ fontSize: 12, fontWeight: 400, color: "#8a8f98" }}>/mes</span>
              </Text>
            </td>
          </tr>
        </table>
      </Section>

      <Text style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a8f98" }}>
        Qué sigue
      </Text>
      <Text style={{ margin: "0 0 6px", fontSize: 14.5, lineHeight: 1.6, color: "#4b4f58" }}>
        <strong style={{ color: "#111318" }}>1.</strong> Te escribimos por WhatsApp en las próximas horas para coordinar un kickoff de 30 minutos.
      </Text>
      <Text style={{ margin: "0 0 28px", fontSize: 14.5, lineHeight: 1.6, color: "#4b4f58" }}>
        <strong style={{ color: "#111318" }}>2.</strong> De ahí en más, no tenés que hacer nada más — diseñamos y desarrollamos nosotros.
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
        Escribinos por WhatsApp
      </Button>

      <Text style={{ margin: "24px 0 0", fontSize: 12.5, lineHeight: 1.6, color: "#8a8f98" }}>
        ¿Tenés alguna duda mientras tanto? Respondé este mismo email o escribinos por WhatsApp — te leemos.
      </Text>
    </EmailLayout>
  );
}
