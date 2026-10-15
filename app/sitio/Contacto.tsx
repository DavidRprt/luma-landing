"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { LeadForm } from "./LeadForm";
import { CONTACTO_EVENT, type ContactoDetalle } from "./constants";
import s from "./sitio.module.css";

// Ventana corta de contacto. Se abre encima de la página (no mueve nada) con el plan o el proyecto ya elegido.
export function Contacto() {
  const [abierto, setAbierto] = useState(false);
  const [d, setD] = useState<ContactoDetalle | null>(null);
  const [n, setN] = useState(0); // fuerza un formulario nuevo en cada apertura
  const [enviado, setEnviado] = useState(false); // ya se mandó: la ventana muestra solo la confirmación
  const cuerpo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = (e: Event) => { setD((e as CustomEvent<ContactoDetalle>).detail); setN((x) => x + 1); setEnviado(false); setAbierto(true); };
    window.addEventListener(CONTACTO_EVENT, on);
    return () => window.removeEventListener(CONTACTO_EVENT, on);
  }, []);

  return (
    <Dialog.Root open={abierto} onOpenChange={setAbierto}>
      <Dialog.Portal>
        <Dialog.Overlay className={s.modalFondo} />
        <Dialog.Content
          className={`${s.root} ${s.modal}`}
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => { e.preventDefault(); cuerpo.current?.querySelector<HTMLInputElement>("input[name='nombre'], input[type='tel']")?.focus(); }}
        >
          <div ref={cuerpo}>
            <Dialog.Title className={enviado ? "sr-only" : s.panelTitulo}>{enviado ? "Consulta enviada" : d?.titulo}</Dialog.Title>
            {d?.subtitulo && !enviado && <p className={s.panelSub}>{d.soloWhatsApp ? d.subtitulo.replace("Dejanos tu nombre y tu WhatsApp", "Dejanos tu WhatsApp") : d.subtitulo}</p>}
            {d && (
              <LeadForm
                key={n}
                placement={d.placement as "plan" | "proyecto"}
                variante="corto"
                plano
                title=""
                subtitle=""
                planInicial={d.plan}
                contexto={d.contexto}
                soloWhatsApp={d.soloWhatsApp}
                onEnviado={() => setEnviado(true)}
                boton="Quiero mi sitio"
              />
            )}
          </div>
          <Dialog.Close className={s.modalCerrar} aria-label="Cerrar"><X size={20} strokeWidth={1.5} aria-hidden="true" /></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
