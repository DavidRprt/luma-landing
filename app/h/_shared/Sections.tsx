import Link from "next/link";
import { CreditCard, UserRound, MessageCircle, Bot, Search, ShieldCheck } from "lucide-react";
import AuroraGlow from "../../components/AuroraGlow";
import { ClosingCta, DemoProvider, StickyDemo } from "./Demo";
import { MotionRoot, Reveal } from "./Reveal";
import { EXTRAS, PASOS } from "./lead";
import s from "./base.module.css";

// Piezas que comparten las cuatro composiciones: el mundo visual de _luma y la parte de abajo de la página.

export function Shell({ children, token }: { children: React.ReactNode; token?: string }) {
  return (
    <DemoProvider token={token}>
      <MotionRoot>
        <div className={s.page}>
          {children}
          <StickyDemo />
          
        </div>
      </MotionRoot>
    </DemoProvider>
  );
}

export const Aurora = () => (
  <div className={s.aurora} aria-hidden="true"><div><AuroraGlow /></div></div>
);

export function TopBar() {
  return (
    <div className={s.topWrap}>
      <div className={s.top}>
        <span className={s.logo}><i className={s.logoBar} />luma</span>
        <span className={s.topTag}>made for you</span>
      </div>
    </div>
  );
}

const ICONOS = [CreditCard, UserRound, MessageCircle, Bot, Search, ShieldCheck];

export function Resto({ negocio }: { negocio: string }) {
  return (
    <>
      <div className={`${s.sec} ${s.more}`}>
        <div className={s.wrap}>
          <div className={s.moreGrid}>
            <Reveal className={s.moreHead}>
              <h2 className={s.h2}>And everything else we <em>can build.</em></h2>
              <p>Your site is the first thing many customers see. We build it by hand, around how your business actually works, with no builders like Wix.</p>
            </Reveal>
            <ul className={s.rows}>
              {EXTRAS.map(([t, d], i) => {
                const Icono = ICONOS[i];
                return (
                  <Reveal as="li" key={t} delay={i * 0.05} className={s.row}>
                    <Icono size={22} strokeWidth={1.5} aria-hidden="true" />
                    <div><strong>{t}</strong><span>{d}</span></div>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className={`${s.sec} ${s.how}`}>
        <div className={s.wrap}>
          <Reveal><h2 className={`${s.h2} ${s.howHead}`}>How it <em>works.</em></h2></Reveal>
          <ol className={s.steps}>
            {PASOS.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.12}>
                <strong>{t}</strong>
                <span>{d}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      <div className={`${s.sec} ${s.close}`}>
        <Aurora />
        <div className={s.wrap}><Reveal><ClosingCta negocio={negocio} /></Reveal></div>
      </div>

      <div className={s.wrap}>
        <div className={s.about}>
          <h3 className={s.h3}>About _luma</h3>
          <div>
            <p>We’re a small web studio. We build websites by hand, with no builders like Wix, so they’re shaped around how your business actually works.</p>
            <Link href="/en/proyectos">See what we’ve built →</Link>
          </div>
        </div>
        <div className={s.foot}>_luma · 3401 SW 160th Ave Suite 330, Miramar, FL 33027</div>
      </div>
    </>
  );
}
