import { Resend } from "resend";
import { emailListFromEnv, FROM_EMAIL } from "@/lib/email";
import { registrarRespuesta } from "@/lib/landings";

export const dynamic = "force-dynamic";

// El negocio tocó un botón de su landing: se guarda y se avisa al equipo.
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const cuerpo = await req.json().catch(() => ({}));
  const respuesta = cuerpo?.respuesta === "no" ? "no" : cuerpo?.respuesta === "demo" ? "demo" : null;
  if (!respuesta) return Response.json({ ok: false }, { status: 400 });
  // WhatsApp (solo en español): se limpia y se valida; si no parece un número, se descarta.
  const crudo = String(cuerpo?.telefono ?? "").replace(/[^\d+]/g, "").slice(0, 20);
  const digitos = crudo.replace(/\D/g, "").length;
  const telefono = respuesta === "demo" && digitos >= 8 && digitos <= 15 ? crudo : undefined;
  const lead = await registrarRespuesta(token, respuesta, telefono);
  if (!lead) return Response.json({ ok: false }, { status: 404 });

  const para = emailListFromEnv(process.env.CONTACT_TO_EMAIL);
  if (process.env.RESEND_API_KEY && para.length) {
    const asunto = respuesta === "demo" ? `${lead.negocio} quiere ver la vista previa de su sitio` : `${lead.negocio} dijo que no, gracias`;
    const texto = `${lead.negocio} (${lead.dominio}) tocó "${respuesta === "demo" ? "Yes, show me a preview" : "No thanks"}" en su landing.\n${telefono ? `WhatsApp que dejó: ${telefono}\n` : ""}Lead #${lead.leadId} en outreach.${respuesta === "no" ? "\nNo volver a escribirle." : ""}`;
    await new Resend(process.env.RESEND_API_KEY).emails.send({ from: FROM_EMAIL, to: para, subject: asunto, text: texto }).catch((e) => console.error("[landing respuesta] aviso no enviado", e));
  }
  // El mail del negocio se devuelve recién al tocar el botón (así no viaja en el HTML de la página).
  return Response.json({ ok: true, ...(respuesta === "demo" && lead.mail ? { mail: lead.mail } : {}) });
}
