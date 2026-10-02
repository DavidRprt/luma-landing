import type { Metadata } from "next";
import Link from "next/link";
import { t } from "../constants/translations";
import { SITE_URL } from "@/lib/seo";
import { LeadForm } from "./LeadForm";
import { ProyectoCard } from "./ProyectoCard";
import { Faq } from "./Faq";
import { StickyCta } from "./StickyCta";
import { PageTracker } from "./PageTracker";
import { PlanButton } from "./PlanButton";
import { WhatsAppLink } from "./TrackedLink";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { WHATSAPP_URL } from "./constants";

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
  { titulo: "Sin pago inicial", texto: "No juntás un pago grande antes de arrancar. Pagás mes a mes y todo está incluido." },
  { titulo: "A medida, sin plantillas", texto: "Lo programamos de cero: pagos con Mercado Pago, formularios, chat… lo que tu negocio necesite." },
  { titulo: "Nos encargamos de todo", texto: "Hosting, dominio y mantenimiento resueltos. Vos no tocás nada técnico." },
  { titulo: "Pensado para conseguir clientes", texto: "Rápido en el celular, optimizado para Google y listo para recibir tu publicidad." },
];

const FAQ = [
  { q: "¿Necesito tener algo armado (logo, textos, fotos)?", a: "No. En el kickoff de 30 minutos relevamos todo lo que necesitamos y de ahí en más lo diseñamos y desarrollamos nosotros." },
  { q: "¿Cómo se paga?", a: "Es una suscripción mensual con Mercado Pago. No hay pago inicial: pagás mes a mes, con hosting, dominio y mantenimiento incluidos." },
  { q: "¿Cuánto tardan en tener mi sitio online?", a: "Arrancamos apenas terminamos el kickoff — la mayoría de los sitios están online en 2 a 3 semanas." },
  { q: "¿El dominio es mío?", a: "Sí. Si lo compramos nosotros como parte de la gestión, queda registrado a tu nombre." },
];

const eyebrowClass = "text-[#6aa9ff] uppercase tracking-[0.18em] font-medium";
const WAIcon = <WhatsAppIcon />;

export default function WebLanding() {
  return (
    <main className="relative overflow-x-clip bg-black text-white">
      <PageTracker />

      {/* Brillo de fondo: un solo gradiente estático (liviano para celulares). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
        style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(106,169,255,0.22), rgba(106,169,255,0) 70%)" }}
      />

      {/* Header mínimo: sin menú, para que nadie se distraiga. */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link href="/" className="group relative flex shrink-0 items-center gap-0" aria-label="_luma, ir al inicio">
          {/* Mismo logo y animación que la barra del sitio (los estilos .logo-dot / .logo-bar están en globals.css). */}
          <span className="relative mr-[3px] inline-flex flex-col items-center" style={{ width: 17, gap: 3.5 }}>
            <span className="logo-dot rounded-full bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ width: 6, height: 6 }} />
            <span className="logo-bar rounded-sm bg-[#6aa9ff]" style={{ width: 17, height: 3 }} />
          </span>
          <span className="font-semibold text-white" style={{ fontSize: 17, letterSpacing: "-0.02em" }}>luma</span>
        </Link>
        <WhatsAppLink
          href={WHATSAPP_URL}
          placement="header"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 font-semibold text-[#06240f] shadow-[0_0_24px_rgba(37,211,102,0.35)] transition-all hover:bg-[#2fe074] hover:shadow-[0_0_32px_rgba(37,211,102,0.5)]"
          style={{ fontSize: 14 }}
        >
          {WAIcon} WhatsApp
        </WhatsAppLink>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl gap-x-14 gap-y-8 px-5 pb-10 pt-4 md:px-8 md:pb-14 md:pt-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-center">
          <h1 className="font-semibold" style={{ fontSize: "clamp(38px, 7vw, 64px)", lineHeight: 1.04, letterSpacing: "-0.03em" }}>
            Tu sitio web profesional,{" "}
            <span className="italic text-white/55">sin pago inicial.</span>
          </h1>
          <p className="mt-5 max-w-md text-white/60" style={{ fontSize: "clamp(16px, 2.2vw, 19px)", lineHeight: 1.55 }}>
            Hosting, dominio y mantenimiento incluidos. Desde{" "}
            <strong className="font-semibold text-white">${sub.plans.landing.price}</strong> por mes.
          </p>
        </div>

        <div id="form" className="scroll-mt-6 lg:col-start-2 lg:row-start-1 lg:self-center">
          <LeadForm placement="hero" />
          <p className="mt-4 text-center text-white/45" style={{ fontSize: 14 }}>
            ¿Preferís hablar ya?{" "}
            <WhatsAppLink href={WHATSAPP_URL} placement="hero" className="inline-flex items-center gap-1.5 font-medium text-[#25D366] hover:underline">
              Escribinos por WhatsApp
            </WhatsAppLink>
          </p>
        </div>
      </section>

      {/* Proyectos reales */}
      <section className="relative z-10 border-t border-white/[0.07] py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className={eyebrowClass} style={{ fontSize: 12 }}>Proyectos reales</p>
          <h2 className="mt-3 font-semibold" style={{ fontSize: "clamp(28px, 4.5vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            Lo que ya construimos.
          </h2>
          <ul className="-mx-5 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&>li]:h-auto [&::-webkit-scrollbar]:hidden">
            {proyectos.map((p) => (
              <li key={p.img} className="w-[70%] shrink-0 snap-center sm:w-auto">
                <ProyectoCard w={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Por qué */}
      <section className="relative z-10 border-t border-white/[0.07] py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className={eyebrowClass} style={{ fontSize: 12 }}>Por qué _luma</p>
          <h2 className="mt-3 max-w-3xl font-semibold" style={{ fontSize: "clamp(28px, 4.5vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            Hoy tus clientes te buscan en Google antes de escribirte.
          </h2>
          <p className="mt-4 max-w-2xl text-white/55" style={{ fontSize: 17, lineHeight: 1.6 }}>
            Un sitio propio te da presencia, confianza y un lugar donde mandar toda tu publicidad.
          </p>
          <ul className="mt-7 grid gap-4 sm:grid-cols-2">
            {BENEFICIOS.map((b) => (
              <li key={b.titulo} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="font-semibold" style={{ fontSize: 18 }}>{b.titulo}</h3>
                <p className="mt-2 text-white/55" style={{ fontSize: 15, lineHeight: 1.6 }}>{b.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Planes */}
      <section id="planes" className="relative z-10 border-t border-white/[0.07] py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className={eyebrowClass} style={{ fontSize: 12 }}>Planes</p>
          <h2 className="mt-3 font-semibold" style={{ fontSize: "clamp(28px, 4.5vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            Elegí el tuyo.
          </h2>
          <p className="mt-3 text-white/55" style={{ fontSize: 17 }}>Sin pago inicial. Pagás mes a mes, con todo incluido.</p>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {plans.map((plan) => (
              <div key={plan.id} className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-7">
                <h3 className="text-white/70" style={{ fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase" }}>{plan.name}</h3>
                <p className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-semibold" style={{ fontSize: 44, letterSpacing: "-0.03em" }}>${plan.price}</span>
                  <span className="text-white/40" style={{ fontSize: 15 }}>{plan.priceSuffix}</span>
                </p>
                <p className="mt-2 text-white/60" style={{ fontSize: 15 }}>{plan.tagline}</p>
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex gap-2.5 text-white/75" style={{ fontSize: 14.5, lineHeight: 1.5 }}>
                      <span aria-hidden="true" className="text-[#6aa9ff]">{f.addon ? "+" : "✓"}</span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-white/40" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{plan.footnote}</p>
                <PlanButton
                  plan={plan.id}
                  className="mt-auto inline-flex w-full items-center justify-center rounded-full bg-white py-3.5 font-semibold text-black transition-opacity hover:opacity-90"
                >
                  Quiero el plan {plan.name}
                </PlanButton>
              </div>
            ))}
          </div>
          <p className="mt-6 text-white/45" style={{ fontSize: 14.5 }}>
            ¿Vendés online? También armamos tiendas a medida, con Mercado Pago integrado y 0% de comisión de plataforma.{" "}
            <WhatsAppLink href={WHATSAPP_URL} placement="tienda" className="font-medium text-white/80 underline underline-offset-4 hover:text-white">
              Hablemos
            </WhatsAppLink>
          </p>
        </div>
      </section>

      {/* Cierre */}
      <section className="relative z-10 border-t border-white/[0.07] py-10 md:py-14">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:px-8 lg:grid-cols-2">
          <div>
            <h2 className="font-semibold" style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              ¿Arrancamos?
            </h2>
            <p className="mt-4 max-w-md text-white/55" style={{ fontSize: 18, lineHeight: 1.6 }}>
              Contanos de tu negocio y te decimos qué plan te conviene. Sin compromiso.
            </p>
            <WhatsAppLink
              href={WHATSAPP_URL}
              placement="cierre"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-[#06240f]"
              style={{ fontSize: 15 }}
            >
              {WAIcon} Hablar por WhatsApp
            </WhatsAppLink>
          </div>
          <LeadForm placement="final" title="O dejanos tus datos" />
        </div>
      </section>

      {/* Preguntas frecuentes: chicas y al final, para quien todavía tiene una duda. */}
      <section className="relative z-10 border-t border-white/[0.07] py-8 md:py-10">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="font-semibold text-white/80" style={{ fontSize: 17, letterSpacing: "-0.01em" }}>Preguntas frecuentes</h2>
          <Faq items={FAQ} />
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.07] px-5 pb-28 pt-8 text-white/35 md:px-8 lg:pb-10" style={{ fontSize: 13 }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} _luma · Diseño web · Desarrollo</span>
          <span className="flex flex-wrap gap-x-5 gap-y-1">
            <a href="mailto:hello@underluma.com" className="hover:text-white/70">hello@underluma.com</a>
            <a href="https://instagram.com/_underluma" target="_blank" rel="noopener noreferrer" className="hover:text-white/70">@_underluma</a>
            <Link href="/planes" className="hover:text-white/70">Ver todos los planes</Link>
          </span>
        </div>
      </footer>

      <StickyCta />
    </main>
  );
}
