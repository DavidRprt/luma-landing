import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaginaLead } from "../_shared/PaginaLead";
import { leerLanding } from "@/lib/landings";

// La landing de un mail de outreach. No se indexa y el token del link no se puede adivinar.
export const metadata: Metadata = { title: "A page made for you", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const lead = await leerLanding(token);
  if (!lead) notFound();
  return <PaginaLead lead={lead} token={token} />;
}
