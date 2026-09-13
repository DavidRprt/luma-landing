import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout, emailAccent } from "./components/EmailLayout";

interface ContactAutoReplyProps {
  nombre: string;
  whatsappUrl: string;
}

export default function ContactAutoReply({
  nombre = "Nombre",
  whatsappUrl = "https://wa.me/5491157387432",
}: ContactAutoReplyProps) {
  return (
    <EmailLayout preview="Recibimos tu mensaje — te respondemos en menos de 24hs.">
      <Text style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: emailAccent }}>
        Mensaje recibido
      </Text>
      <Heading style={{ margin: "0 0 16px", fontSize: 26, lineHeight: 1.25, color: "#111318" }}>
        ¡Gracias por escribirnos, {nombre}!
      </Heading>
      <Text style={{ margin: "0 0 28px", fontSize: 15, lineHeight: 1.6, color: "#4b4f58" }}>
        Recibimos tu consulta y la estamos revisando. Te vamos a responder a este mismo email en menos de 24hs
        con los detalles que necesitás.
      </Text>

      <Text style={{ margin: "0 0 20px", fontSize: 14.5, lineHeight: 1.6, color: "#4b4f58" }}>
        Si es algo urgente, escribinos directo por WhatsApp y te contestamos al toque.
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
    </EmailLayout>
  );
}
