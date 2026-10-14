import type { Metadata } from "next";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { t } from "../constants/translations";
import { SITE_URL } from "@/lib/seo";
import { Analizador } from "./Analizador";
import { Proyectos } from "./Proyectos";
import { Faq } from "./Faq";
import { StickyCta } from "./StickyCta";
import { PageTracker } from "./PageTracker";
import { PlanButton } from "./PlanButton";
import { IrAlForm } from "./IrAlForm";
import { PildoraPlanes } from "./PildoraPlanes";
import { WhatsAppLink } from "./TrackedLink";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { WHATSAPP_URL } from "./constants";
import { Contacto } from "./Contacto";
import { Reporte } from "./Reporte";
import { QuieroUnSitio } from "./QuieroUnSitio";
import { CierreTitulo, Pasos, Reveal } from "./Movimiento";
import s from "./sitio.module.css";

const sub = t.es.subscription;
const plans = [
  { id: "landing" as const, ...sub.plans.landing },
  { id: "corporativo" as const, ...sub.plans.corporate },
];
const PROYECTOS = ["nash", "redxmayor", "fluxia", "seofy"];
const proyectos = PROYECTOS.map((img) => t.es.works.items.find((w) => w.img === img)).filter((w) => w !== undefined);

const TITLE = `Sitio web profesional desde $${sub.plans.landing.price} por mes`;
const DESCRIPTION =
  "Diseñamos y programamos tu sitio web a medida. Sin pago inicial: hosting, dominio y mantenimiento incluidos, y pagás mes a mes. Pedí tu sitio sin compromiso.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | _luma` },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/sitio` },
  // Es una página para campañas pagas: no compite con la home en Google.
  robots: { index: false, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/sitio`, locale: "es_AR", type: "website", images: [{ url: "/og-image.png", width: 1200, height: 630 }] },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const BENEFICIOS = [
  { titulo: "Sin pago inicial", corto: "Pagás mes a mes, con todo incluido.", texto: "No juntás un pago grande antes de arrancar. Pagás mes a mes y todo está incluido." },
  { titulo: "A medida, sin plantillas", corto: "Programado de cero para tu negocio.", texto: "Lo programamos de cero: pagos con Mercado Pago, formularios, chat… lo que tu negocio necesite." },
  { titulo: "Nos encargamos de todo", corto: "Hosting, dominio y mantenimiento.", texto: "Hosting, dominio y mantenimiento resueltos. Vos no tocás nada técnico." },
  { titulo: "Pensado para conseguir clientes", corto: "Rápido en el celular y optimizado para Google.", texto: "Rápido en el celular, optimizado para Google y listo para recibir tu publicidad." },
];

const FAQ = [
  { q: "¿Necesito tener algo armado (logo, textos, fotos)?", a: "No. En el kickoff de 30 minutos relevamos todo lo que necesitamos y de ahí en más lo diseñamos y desarrollamos nosotros." },
  { q: "¿Cómo se paga?", a: "Es una suscripción mensual con Mercado Pago. No hay pago inicial: pagás mes a mes, con hosting, dominio y mantenimiento incluidos." },
  { q: "¿Cuánto tardan en tener mi sitio online?", a: "Arrancamos apenas terminamos el kickoff — la mayoría de los sitios están online en 2 a 3 semanas." },
  { q: "¿El dominio es mío?", a: "Sí. Si lo compramos nosotros como parte de la gestión, queda registrado a tu nombre." },
];

export default function WebLanding() {
  return (
    <main className={s.root}>
      <PageTracker />
      <div aria-hidden="true" className={s.luz} />

      <div className={s.pantalla}>
      {/* Header mínimo: sin menú, para que nadie se distraiga. */}
      <div className={s.cont}>
        <header className={s.header}>
          <Link href="/" className={`group relative flex shrink-0 items-center gap-0 ${s.logo}`} aria-label="_luma, ir al inicio">
            {/* Mismo logo y animación que la barra del sitio (los estilos .logo-dot / .logo-bar están en globals.css). */}
            <span className="relative mr-[3px] inline-flex flex-col items-center" style={{ width: 17, gap: 3.5 }}>
              <span className="logo-dot rounded-full bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ width: 6, height: 6 }} />
              <span className="logo-bar rounded-sm bg-[#6aa9ff]" style={{ width: 17, height: 3 }} />
            </span>
            <span className="font-semibold" style={{ fontSize: 17, letterSpacing: "-0.02em" }}>luma</span>
          </Link>
          <WhatsAppLink href={WHATSAPP_URL} placement="header" className={s.wa}>
            <WhatsAppIcon /> WhatsApp
          </WhatsAppLink>
        </header>
      </div>

      {/* Portada: la promesa a la izquierda y, a la derecha, el analizador del sitio. */}
      <section className={s.portada}>
        <div className={s.cont}>
          <div className={s.grid}>
            <div className={s.portadaTxt}>
              <h1 className={s.display}>
                <span className={s.mask}><span className={s.up} style={{ ["--d" as string]: "0.05s" }}>Tu sitio web profesional,</span></span>
                <span className={s.mask}><span className={`${s.up} ${s.em}`} style={{ ["--d" as string]: "0.17s" }}>sin pago inicial.</span></span>
              </h1>
              <p className={`${s.lead} ${s.aparece}`} style={{ ["--d" as string]: "0.45s" }}>
                Hosting, dominio y mantenimiento incluidos. <span className={s.precioLinea}>Desde <span className={`${s.precio} ${s.num}`}>${sub.plans.landing.price}</span> por mes.</span>
              </p>
            </div>
            <div className={`${s.portadaPanel} ${s.aparece}`} style={{ ["--d" as string]: "0.6s" }}>
              <Analizador />
              <p className={`${s.small} ${s.soloDesk}`} style={{ marginTop: 24, textAlign: "center" }}>
                ¿Preferís hablar ya?{" "}
                <WhatsAppLink href={WHATSAPP_URL} placement="hero" className={`${s.link}`} >
                  Escribinos por WhatsApp
                </WhatsAppLink>
              </p>
            </div>
          </div>

        </div>
      </section>

      </div>

      <Reporte />

      {/* Planes */}
      <section id="planes" className={s.sec}>
        <div className={s.cont}>
          <Reveal>
            <div className={s.cabSec}>
              <h2 className={s.h2}>Elegí el tuyo.</h2>
              <p className={s.lead} style={{ marginTop: 16 }}>Sin pago inicial. Pagás mes a mes, con todo incluido.</p>
            </div>
          </Reveal>
          <div className={s.planes}>
            {plans.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 0.1} className={s.plan}>
                <h3 className={s.h3}>{plan.name}</h3>
                <p className={s.body} style={{ marginTop: 8 }}>{plan.tagline}</p>
                <p className={s.precioPlan}>
                  <strong>${plan.price}</strong>
                  <span>{plan.priceSuffix}</span>
                </p>
                <ul className={s.feat}>
                  {plan.features.map((f) => (
                    <li key={f.text}>
                      {f.addon ? <Plus size={16} strokeWidth={2} aria-hidden="true" /> : <Check size={16} strokeWidth={2} aria-hidden="true" />}
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <div className={s.planPie}>
                  <p className={s.small}>{plan.footnote}</p>
                </div>
                <PlanButton plan={plan.id} precio={`$${plan.price}${plan.priceSuffix}`} className={`${s.btn} ${s.btnFull}`}>
                  Quiero el plan {plan.name}
                </PlanButton>
              </Reveal>
            ))}
          </div>
          <p className={`${s.body} ${s.planNota}`}>
            <span className={s.planNotaTxt}>¿Vendés online? Armamos tiendas a medida, con Mercado Pago y 0% de comisión.</span>{" "}
            <WhatsAppLink href={WHATSAPP_URL} placement="tienda" className={s.link}>Hablemos por WhatsApp</WhatsAppLink>
          </p>
        </div>
      </section>

      {/* Proyectos reales */}
      <section className={s.sec}>
        <div className={s.cont}>
          <Reveal>
            <div className={`${s.cabProy} ${s.cabSec}`}>
              <h2 className={s.h2}>Lo que ya construimos.</h2>
              <QuieroUnSitio className={`${s.link} ${s.linkBtn}`}>Quiero un sitio así</QuieroUnSitio>
            </div>
          </Reveal>
          <Reveal><Proyectos items={proyectos} /></Reveal>
        </div>
      </section>

      {/* Por qué */}
      <section className={s.sec}>
        <div className={s.cont}>
          <div className={s.grid}>
            <Reveal className={s.porQueTxt}>
              <h2 className={s.h2}>Hoy tus clientes te buscan en Google antes de escribirte.</h2>
              <p className={s.lead} style={{ marginTop: 24 }}>Un sitio propio te da presencia, confianza y un lugar donde mandar toda tu publicidad.</p>
            </Reveal>
            <ul className={s.porQueLista}>
              {BENEFICIOS.map((b, i) => (
                <Reveal as="li" key={b.titulo} delay={i * 0.06}>
                  <h3 className={s.h3}>{b.titulo}</h3>
                  <p className={`${s.body} ${s.soloDesk}`}>{b.texto}</p>
                  <p className={`${s.body} ${s.soloMovil}`}>{b.corto}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className={s.sec}>
        <div className={s.cont}>
          <Reveal className={s.cabSec}><h2 className={s.h2}>{sub.steps.title}</h2></Reveal>
          <Pasos items={sub.steps.items} />
        </div>
      </section>

      {/* Cierre */}
      <section className={`${s.sec} ${s.cierre}`}>
        <div className={s.cont}>
          <CierreTitulo>¿Arrancamos?</CierreTitulo>
          <Reveal>
            <p className={s.lead}>Pegá la dirección de tu sitio y te mostramos qué mejorar. Sin compromiso.</p>
            <div className={s.cierreAcc}>
              <IrAlForm placement="cierre" className={`${s.btn} ${s.btnLg}`}>Analizar mi sitio</IrAlForm>
              <WhatsAppLink href={WHATSAPP_URL} placement="cierre" className={`${s.btn} ${s.btnWa} ${s.btnLg}`}>
                <WhatsAppIcon /> Hablar por WhatsApp
              </WhatsAppLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className={s.sec}>
        <div className={s.cont}>
          <Reveal><h2 className={s.h2}>Preguntas frecuentes</h2></Reveal>
          <Faq items={FAQ} />
        </div>
      </section>

      <footer className={s.footer} style={{ paddingBottom: 96 }}>
        <div className={`${s.cont} ${s.footerIn}`}>
          <span>© {new Date().getFullYear()} _luma · Diseño web · Desarrollo</span>
          <span className="flex flex-wrap gap-x-6 gap-y-1">
            <a href="mailto:hello@underluma.com">hello@underluma.com</a>
            <a href="https://instagram.com/_underluma" target="_blank" rel="noopener noreferrer">@_underluma</a>
            <Link href="/planes">Ver todos los planes</Link>
          </span>
        </div>
      </footer>

      <StickyCta />
      <PildoraPlanes />
      <Contacto />
    </main>
  );
}
