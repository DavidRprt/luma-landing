import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { Lang } from "../../app/constants/translations";

// Fondo claro a propósito, aunque el sitio sea oscuro: muchos clientes de
// mail (Gmail, Outlook) fuerzan su propio "dark mode" sobre HTML con fondo
// oscuro y lo invierten de formas impredecibles. Un fondo claro con el mismo
// azul de acento se ve igual en todos lados.
const ACCENT = "#3d7fd6";

const FOOTER_TAGLINE: Record<Lang, string> = {
  es: "_luma · Diseño web · Desarrollo · IA",
  en: "_luma · Web design · Development · AI",
};

export function EmailLayout({
  preview,
  lang = "es",
  children,
}: {
  preview: string;
  /** Opcional — por defecto "es" para no cambiar el resultado de los emails
      que todavía no pasan idioma (p. ej. WelcomeEmail). */
  lang?: Lang;
  children: React.ReactNode;
}) {
  return (
    <Html lang={lang}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#f4f5f7", fontFamily: "Helvetica, Arial, sans-serif", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px" }}>
          {/* Logo */}
          <Section style={{ marginBottom: 32 }}>
            <table role="presentation" cellPadding={0} cellSpacing={0}>
              <tr>
                <td style={{ paddingRight: 6, verticalAlign: "middle" }}>
                  <div style={{ width: 16, height: 3, borderRadius: 2, background: ACCENT }} />
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  <Text style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111318", letterSpacing: "-0.02em" }}>
                    luma
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          {children}

          <Hr style={{ borderColor: "#e4e6ea", margin: "32px 0 20px" }} />
          <Text style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: "#8a8f98" }}>
            {FOOTER_TAGLINE[lang]}
            <br />
            hello@underluma.com · +54 9 11 5598-8007
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const emailAccent = ACCENT;
