import Image from "next/image";
import { Aurora, Bloque, Resto, Shell, TopBar } from "./Sections";
import { PrimaryCta } from "./Demo";
import { Reveal } from "./Reveal";
import type { Lead } from "./lead";
import { Despiece } from "./Despiece";
import { textos } from "./textos";
import { familiaDe } from "./rubros";
import b from "./base.module.css";
import a from "./despiece.module.css";

// La landing personalizada: su sitio flota al centro, iluminado, y cada hallazgo sale de su zona hacia una nota.

export function PaginaLead({ lead, token }: { lead: Lead; token?: string }) {
  const idioma = lead.idioma ?? "en";
  const t = textos(idioma);
  const d = lead.datos ?? {};
  const familia = familiaDe(d.rubro, idioma);
  // Lo que el sitio nuevo tendría: las ideas de este sitio y, solo si hoy les falta, lo básico que sí tendrían con nosotros.
  const filasNuevo: [string, string][] = [
    ...lead.hallazgos.map((h): [string, string] => [h.idea, h.ideaDetalle]),
    ...(d.sinHttps ? [t.baseHttps as unknown as [string, string]] : []),
    ...(d.noResponsive ? [t.baseMovil as unknown as [string, string]] : []),
    ...(d.plataforma && /wix|squarespace|godaddy|weebly/i.test(d.plataforma) ? [t.basePlat(d.plataforma) as [string, string]] : []),
  ];
  const tieneResenas = Number(d.rating) >= 4.2 && Number(d.resenas) >= 8;
  return (
    <Shell token={token} idioma={idioma}>
      <div className={a.hero}>
        <Aurora />
        <TopBar idioma={idioma} />
        <div className={b.wrap}>
          <header className={a.head}>
            <h1 className={b.h1}>{t.hola} {lead.negocio}.<br /><em>{t.hallamos}</em></h1>
            <p className={a.lede}>{t.lede}</p>
            <div className={a.by}>
              <Image src="/david.jpg" alt={t.foto} width={44} height={44} className={a.byFoto} />
              <span>{t.por}</span>
            </div>
          </header>
        </div>
        <Despiece lead={lead} />
        <div className={a.cta}><PrimaryCta /></div>
      </div>

      <Bloque
        titulo={<>{t.nuevoA}<em>{t.nuevoB}</em></>}
        intro={t.nuevoP(lead.dominio)}
        filas={filasNuevo}
        destacada
      />

      {tieneResenas && <Bloque titulo={t.resenasT(String(d.rating), Number(d.resenas))} intro={t.resenasP} filas={[]} />}

      {d.oportunidades?.length
        ? <Bloque titulo={t.oportH(lead.negocio)} intro={t.rubroP} filas={d.oportunidades} destacada />
        : <Bloque titulo={t.rubroH(familia.etiqueta)} intro={t.rubroP} filas={familia.items} destacada />}

      <Resto negocio={lead.negocio} idioma={idioma} sinExtras />
    </Shell>
  );
}
