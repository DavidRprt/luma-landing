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
  const lead = await registrarRespuesta(token, respuesta);
  if (!lead) return Response.json({ ok: false }, { status: 404 });

  const para = emailListFromEnv(process.env.CONTACT_TO_EMAIL);
  if (process.env.RESEND_API_KEY && para.length) {
    const asunto = respuesta === "demo" ? `${lead.negocio} quiere ver la vista previa de su sitio` : `${lead.negocio} dijo que no, gracias`;
    const texto = `${lead.negocio} (${lead.dominio}) tocó "${respuesta === "demo" ? "Yes, show me a preview" : "No thanks"}" en su landing.\nLead #${lead.leadId} en outreach.${respuesta === "no" ? "\nNo volver a escribirle." : ""}`;
    await new Resend(process.env.RESEND_API_KEY).emails.send({ from: FROM_EMAIL, to: para, subject: asunto, text: texto }).catch((e) => console.error("[landing respuesta] aviso no enviado", e));
  }
  return Response.json({ ok: true });
}
