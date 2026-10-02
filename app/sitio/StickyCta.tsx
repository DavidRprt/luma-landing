"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { WhatsAppLink } from "./TrackedLink";
import { WHATSAPP_URL } from "./constants";
import { irAlFormulario } from "./irAlFormulario";

// Barra fija abajo, solo en celular. Aparece al bajar del primer pantallazo y
// se esconde cuando el formulario ya está a la vista (para no taparlo).
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let pasoElInicio = false;
    let formVisible = false;
    const update = () => setVisible(pasoElInicio && !formVisible);

    const onScroll = () => {
      pasoElInicio = window.scrollY > 480;
      update();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const forms = Array.from(document.querySelectorAll("[data-lead-form]"));
    const visibles = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visibles.add(e.target);
        else visibles.delete(e.target);
      }
      formVisible = visibles.size > 0;
      update();
    });
    forms.forEach((f) => io.observe(f));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <div
      className={`lg:hidden fixed inset-x-0 bottom-0 z-40 px-4 pt-3 transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))", background: "linear-gradient(to top, rgba(0,0,0,0.95) 60%, rgba(0,0,0,0))" }}
      aria-hidden={!visible}
    >
      <div className="flex gap-2.5">
        <a
          href="#form"
          onClick={(e) => { e.preventDefault(); irAlFormulario(); }}
          tabIndex={visible ? 0 : -1}
          className="flex-1 inline-flex items-center justify-center rounded-full bg-white text-black font-semibold py-3.5"
          style={{ fontSize: 15 }}
        >
          Quiero mi sitio
        </a>
        <WhatsAppLink
          href={WHATSAPP_URL}
          placement="sticky"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-[#06240f] font-semibold px-5 py-3.5"
          style={{ fontSize: 15 }}
        >
          <WhatsAppIcon /> WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  );
}
