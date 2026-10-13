// Qué puede hacer un sitio nuevo según el rubro del negocio. Son oportunidades reales del rubro, sin números inventados
// ni promesas: cada una dice qué cambia para el cliente del negocio.
export type Oportunidad = [titulo: string, detalle: string];
export type Familia = { etiqueta: string; items: Oportunidad[] };

const EN: [RegExp, Familia][] = [
  [/roof/i, { etiqueta: "roofing company", items: [
    ["Request a roof inspection online", "Homeowners send the address and a photo at any hour, instead of waiting for business hours to call."],
    ["Finished roofs, shown by neighborhood", "Before-and-after photos next to the city names people search for, so the work speaks for itself."],
    ["Found for “roof repair near me”", "A fast site built around the towns you serve, so nearby homeowners find you first."]] }],
  [/landscap|lawn|tree/i, { etiqueta: "landscaping and outdoor business", items: [
    ["A gallery that sells the work", "Big before-and-after photos by type of project, each with a button to request a similar one."],
    ["Quote requests by address", "Customers send their address and what they want done, and you reply with the details in hand."],
    ["Seasonal services up front", "Spring cleanups, aeration, snow removal: the service people need right now, on the first screen."]] }],
  [/pest|fumig/i, { etiqueta: "pest control company", items: [
    ["Book a visit in two taps", "Pests are urgent. A clear Call or Request a visit button on every page gets the job before a competitor does."],
    ["Recurring plans, explained simply", "A page for quarterly and monthly plans so one visit turns into a long-term customer."],
    ["Reviews where people decide", "Real customer reviews next to every service, because trust is what closes this kind of job."]] }],
  [/garage/i, { etiqueta: "garage door company", items: [
    ["Emergency call button, always visible", "A broken door can't wait. One tap to call from anywhere on the site."],
    ["Repair or replace, made easy to choose", "Clear pages for each so customers know what to ask for before they call."],
    ["Photo-based quote requests", "Customers send a picture of the door and you can give a quicker, better answer."]] }],
  [/plumb|cerraj|gasista|plomer/i, { etiqueta: "plumbing and home repair business", items: [
    ["Urgent jobs, one tap away", "A call and WhatsApp button that follows the visitor on every page, day and night."],
    ["Service areas that Google understands", "A page for each area you cover, so people nearby find you when something breaks."],
    ["Describe the problem, get a faster quote", "A short form with photo upload so you arrive prepared and customers feel looked after."]] }],
  [/hvac|aire|climat|refriger/i, { etiqueta: "heating and cooling company", items: [
    ["Schedule service online", "Customers pick a day and describe the issue, without waiting on hold."],
    ["Maintenance plans as a clear offer", "A page that explains the yearly plan so repairs turn into regular customers."],
    ["Season-aware homepage", "AC in the summer, heating in the winter: the first screen shows what people need right now."]] }],
  [/electric/i, { etiqueta: "electrical company", items: [
    ["Request a visit with the address", "A short form so homeowners and businesses ask for a quote in under a minute."],
    ["Every service on its own page", "Panels, lighting, EV chargers, generators: each one found separately in Google."],
    ["Licensed and insured, shown clearly", "Credentials and real reviews near the button, where people decide to call."]] }],
  [/paint|pintor/i, { etiqueta: "painting company", items: [
    ["Before-and-after galleries", "Big photos of finished rooms and exteriors, because painting is sold with the eyes."],
    ["Free estimate requests with photos", "Customers send pictures of the rooms and you reply with a faster quote."],
    ["Color and project inspiration", "A page that helps people imagine the result and ask for yours."]] }],
  [/fence|concrete|pressure|carpet|wash|clean/i, { etiqueta: "home services company", items: [
    ["Photo galleries by project type", "Finished jobs, grouped so each visitor sees the work they want done."],
    ["A simple quote request", "Name, phone and what they need, nothing more, so more visitors actually send it."],
    ["Local pages for the towns you serve", "A page per area so people nearby find you instead of a bigger company."]] }],
];

const ES: [RegExp, Familia][] = [
  [/odont|dent|kinesi|psic|veterin|óptica|optica|salud/i, { etiqueta: "consultorio", items: [
    ["Turnos online las 24 horas", "Tus pacientes eligen día y horario desde el celular, sin esperar a que atiendan el teléfono."],
    ["Cada especialidad en su página", "Para que Google te muestre cuando alguien busca justo eso en Rosario."],
    ["Reseñas y equipo a la vista", "Fotos reales de los profesionales y opiniones de pacientes, donde la gente decide."]] }],
  [/contab|abog|jur[ií]d|escriban|arquitect/i, { etiqueta: "estudio profesional", items: [
    ["Consulta inicial en un paso", "Un formulario corto y WhatsApp para que cada visita pueda escribirte hoy."],
    ["Áreas de trabajo explicadas con claridad", "Una página por servicio, escrita para quien busca resolver ese problema."],
    ["Confianza desde la primera pantalla", "Tu equipo, tu trayectoria y casos reales, antes de que decidan llamar a otro."]] }],
  [/inmobil/i, { etiqueta: "inmobiliaria", items: [
    ["Propiedades con buscador propio", "Filtros por zona, precio y tipo, con fotos grandes y contacto en cada ficha."],
    ["Tasaciones pedidas online", "Un formulario simple para captar a quien quiere vender, las 24 horas."],
    ["WhatsApp en cada propiedad", "Un botón que ya sabe de qué propiedad te escriben."]] }],
  [/taller|mec[aá]n/i, { etiqueta: "taller mecánico", items: [
    ["Turnos para el taller online", "El cliente elige el día y cuenta qué le pasa al auto."],
    ["Servicios claros, uno por uno", "Frenos, service, alineación: cada trabajo explicado y encontrable en Google."],
    ["Presupuesto por WhatsApp con fotos", "Tus clientes mandan una foto y reciben una primera respuesta más rápido."]] }],
  [/plomer|electricista|gasista|cerrajer|aire|fumig|tanque|herrer|carpint|pintor|paisaj|jard|mudanz/i, { etiqueta: "servicio a domicilio", items: [
    ["Urgencias a un toque", "Botón de llamada y WhatsApp visible en todas las páginas, de día y de noche."],
    ["Trabajos terminados a la vista", "Fotos de antes y después para que el cliente vea lo que vas a hacer en su casa."],
    ["Zonas de Rosario bien marcadas", "Páginas por barrio y ciudad cercana, para aparecer cuando buscan cerca de ellos."]] }],
  [/gimnas|peluquer|viaj/i, { etiqueta: "negocio con clientes habituales", items: [
    ["Reservas y turnos online", "Que reserven solos desde el celular y dejen de escribirte para coordinar."],
    ["Promociones y novedades siempre al día", "Una portada que cambia con tus ofertas, sin depender de nadie."],
    ["Fotos y reseñas que dan confianza", "El lugar, el equipo y las opiniones de clientes en la primera pantalla."]] }],
];

const GENERICO: Record<"en" | "es", Familia> = {
  en: { etiqueta: "local business", items: [
    ["A clear way to contact you", "Call, text and request-a-quote buttons on every page, so interested visitors don't leave."],
    ["Every service found on Google", "One page per service and area, so nearby customers find you first."],
    ["Reviews and real work up front", "The proof people look for before they pick a business."]] },
  es: { etiqueta: "negocio local", items: [
    ["Una forma clara de contactarte", "Botones de llamada, WhatsApp y presupuesto en cada página, para que nadie se vaya sin escribir."],
    ["Cada servicio encontrado en Google", "Una página por servicio y por zona, para que los clientes cercanos te encuentren primero."],
    ["Reseñas y trabajos reales a la vista", "La prueba que la gente busca antes de elegir."]] },
};

export function familiaDe(rubro: string | undefined, idioma: "en" | "es"): Familia {
  const lista = idioma === "es" ? ES : EN;
  const r = rubro ?? "";
  return lista.find(([re]) => re.test(r))?.[1] ?? GENERICO[idioma];
}
