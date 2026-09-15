"use client";

import { useEffect } from "react";
import type { Lang } from "../constants/translations";

/**
 * Next.js solo permite declarar <html> una vez, en el layout raíz — así que un
 * layout anidado (app/en/layout.tsx) no puede poner lang="en" ahí. Esto
 * corrige el atributo del lado del cliente apenas se monta cada página.
 */
export function LangHtmlSync({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
