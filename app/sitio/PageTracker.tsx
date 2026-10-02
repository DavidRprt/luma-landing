"use client";

import { useEffect } from "react";
import { captureAttribution, trackGa, trackMeta } from "@/lib/tracking";

// Al entrar: guarda de dónde vino la persona y avisa que vio el contenido
// (ViewContent), que además de PageView le da a Meta una señal más rica.
export function PageTracker() {
  useEffect(() => {
    captureAttribution();
    trackMeta("ViewContent", { content_name: "Landing /sitio" });
    trackGa("view_landing", { page: "/sitio" });
  }, []);
  return null;
}
