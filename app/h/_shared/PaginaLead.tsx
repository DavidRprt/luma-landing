import { Aurora, Resto, Shell, TopBar } from "./Sections";
import { PrimaryCta } from "./Demo";
import { Reveal } from "./Reveal";
import { ampliar, type Lead } from "./lead";
import { Despiece } from "./Despiece";
import b from "./base.module.css";
import a from "./despiece.module.css";

// La landing personalizada: su sitio flota al centro, iluminado, y cada hallazgo sale de su zona hacia una nota.

// El recorte real de su captura, ampliado sobre la zona donde aplica la idea.
function Recorte({ lead, i }: { lead: Lead; i: number }) {
  const h = lead.hallazgos[i];
  const c = ampliar(h.caja, lead.captura.w, lead.captura.h);
  const ar = ((c.w / 100) * lead.captura.w) / ((c.h / 100) * lead.captura.h);
  const px = c.w >= 100 ? 0 : (c.x / (100 - c.w)) * 100;
  const py = c.h >= 100 ? 0 : (c.y / (100 - c.h)) * 100;
  return (
    <div role="img" aria-label={`Zoom on the area of the current ${lead.negocio} website`}
      style={{ width: "100%", aspectRatio: `${ar}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 0 rgba(0,0,0,.04), 0 12px 32px -12px rgba(0,0,0,.35)",
        backgroundImage: `url(${lead.captura.src})`, backgroundRepeat: "no-repeat", backgroundSize: `${10000 / c.w}% auto`, backgroundPosition: `${px}% ${py}%` }} />
  );
}

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
                <div className={a.tile}><Recorte lead={lead} i={i} /></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Resto negocio={lead.negocio} />
    </Shell>
  );
}
