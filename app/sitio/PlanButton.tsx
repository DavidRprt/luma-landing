"use client";

import { abrirContacto, type PlanId } from "./constants";
import { trackGa } from "@/lib/tracking";

const NOMBRES: Record<PlanId, string> = { landing: "Landing", corporativo: "Corporativo", "no-se": "" };

// Botón de un plan: la persona ya eligió, así que abre la ventana de contacto con ese plan cargado.
export function PlanButton({ plan, precio, className, children }: { plan: PlanId; precio?: string; className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        trackGa("select_plan", { plan });
        abrirContacto({
          titulo: `Plan ${NOMBRES[plan]}`,
          subtitulo: `${precio ? `${precio} · ` : ""}Sin pago inicial. Dejanos tu nombre y tu WhatsApp y te escribimos.`,
          plan,
          contexto: `Eligió el plan ${NOMBRES[plan]}`,
          placement: "plan",
        });
      }}
    >
      {children}
    </button>
  );
}
