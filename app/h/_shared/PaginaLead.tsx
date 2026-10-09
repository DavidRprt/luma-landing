import Image from "next/image";
import { Aurora, Resto, Shell, TopBar } from "./Sections";
import { PrimaryCta } from "./Demo";
import { Reveal } from "./Reveal";
import type { Lead } from "./lead";
import { Despiece } from "./Despiece";
import b from "./base.module.css";
import a from "./despiece.module.css";

// La landing personalizada: su sitio flota al centro, iluminado, y cada hallazgo sale de su zona hacia una nota.

export function PaginaLead({ lead, token }: { lead: Lead; token?: string }) {
  return (
    <Shell token={token}>
      <div className={a.hero}>
        <Aurora />
        <TopBar />
        <div className={b.wrap}>
          <header className={a.head}>
            <h1 className={b.h1}>Hi, {lead.negocio}.<br /><em>Here’s what we noticed.</em></h1>
            <p className={a.lede}>We build websites by hand for local businesses. We looked at yours, and here’s what we’d do differently in a new one.</p>
            <div className={a.by}>
              <Image src="/david.jpg" alt="David, from the _luma team" width={44} height={44} className={a.byFoto} />
              <span>David, from our team</span>
            </div>
          </header>
        </div>
        <Despiece lead={lead} />
        <div className={a.cta}><PrimaryCta /></div>
      </div>

      <div className={`${b.sec} ${a.ideas}`}>
        <div className={b.wrap}>
          <Reveal><h2 className={b.h2}>What your new website <em>would have.</em></h2></Reveal>
          {lead.hallazgos.map((h, i) => (
            <Reveal key={h.id}>
              <div className={a.idea}>
                <div className={a.ideaText}>
                  <span className={a.ideaNum}>{i + 1}</span>
                  <h3 className={b.h3}>{h.idea}</h3>
                  <p>{h.ideaDetalle}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Resto negocio={lead.negocio} />
    </Shell>
  );
}
