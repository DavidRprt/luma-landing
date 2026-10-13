import Link from "next/link";
import { CreditCard, UserRound, MessageCircle, Bot, Search, ShieldCheck, Check } from "lucide-react";
import AuroraGlow from "../../components/AuroraGlow";
import { ClosingCta, DemoProvider, StickyDemo } from "./Demo";
import { MotionRoot, Reveal } from "./Reveal";
import { textos, type Idioma } from "./textos";
import s from "./base.module.css";

// Piezas que comparten las cuatro composiciones: el mundo visual de _luma y la parte de abajo de la página.

export function Shell({ children, token, idioma = "en" }: { children: React.ReactNode; token?: string; idioma?: Idioma }) {
  return (
    <DemoProvider token={token} idioma={idioma}>
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

export function TopBar({ idioma = "en" }: { idioma?: Idioma }) {
  return (
    <div className={s.topWrap}>
      <div className={s.top}>
        <span className={s.logo}><i className={s.logoBar} />luma</span>
        <span className={s.topTag}>{textos(idioma).topTag}</span>
      </div>
    </div>
  );
}

const ICONOS = [CreditCard, UserRound, MessageCircle, Bot, Search, ShieldCheck];

// Una sección de la landing: título a la izquierda y una lista de filas a la derecha.
export function Bloque({ titulo, intro, filas, destacada }: { titulo: React.ReactNode; intro?: string; filas: readonly (readonly [string, string])[]; destacada?: boolean }) {
  return (
    <div className={`${s.sec} ${s.more}`}>
      <div className={s.wrap}>
        <div className={s.moreGrid}>
          <Reveal className={s.moreHead}>
            <h2 className={s.h2}>{titulo}</h2>
            {intro && <p>{intro}</p>}
          </Reveal>
          {filas.length > 0 && <ul className={s.rows}>
            {filas.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.05} className={s.row}>
                {destacada ? <Check size={22} strokeWidth={1.75} aria-hidden="true" /> : <span aria-hidden="true" />}
                <div><strong>{t}</strong><span>{d}</span></div>
              </Reveal>
            ))}
          </ul>}
        </div>
      </div>
    </div>
  );
}

export function Resto({ negocio, idioma = "en", sinExtras = false }: { negocio: string; idioma?: Idioma; sinExtras?: boolean }) {
  const t = textos(idioma);
  return (
    <>
      {!sinExtras && <div className={`${s.sec} ${s.more}`}>
        <div className={s.wrap}>
          <div className={s.moreGrid}>
            <Reveal className={s.moreHead}>
              <h2 className={s.h2}>{t.masA}<em>{t.masB}</em></h2>
              <p>{t.masP}</p>
            </Reveal>
            <ul className={s.rows}>
              {t.extras.map(([t, d], i) => {
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
      </div>}

      <div className={`${s.sec} ${s.how}`}>
        <div className={s.wrap}>
          <Reveal><h2 className={`${s.h2} ${s.howHead}`}>{t.comoA}<em>{t.comoB}</em></h2></Reveal>
          <ol className={s.steps}>
            {t.pasos.map(([t, d], i) => (
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
          <h3 className={s.h3}>{t.acerca}</h3>
          <div>
            <p>{t.acercaP}</p>
            <Link href={t.proyectosHref}>{t.verProyectos}</Link>
          </div>
        </div>
        <div className={s.foot}>{t.pie}</div>
      </div>
    </>
  );
}
