"use client";

import { PLAN_EVENT, type PlanId } from "./constants";
import { trackGa } from "@/lib/tracking";
import { irAlFormulario } from "./irAlFormulario";

// Botón de un plan: elige ese plan en el formulario y lleva hasta él.
export function PlanButton({ plan, className, children }: { plan: PlanId; className?: string; children: React.ReactNode }) {
  return (
    <a
      href="#form"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(PLAN_EVENT, { detail: plan }));
        trackGa("select_plan", { plan });
        irAlFormulario();
      }}
    >
      {children}
    </a>
  );
}
