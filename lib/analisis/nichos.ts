import type { Analisis, Nicho } from "@/app/sitio/analisisTipos";
import type { TipoAdulto } from "./contenido";
import type { Hallazgo } from "@/app/sitio/analisisTipos";

// Sitios para adultos: no se capturan ni se mandan a la IA. Se identifica de qué trata el sitio solo con reglas (página de
// links, creador, videos, cams, tienda) y se le ofrece trabajo a medida. Todo el texto es fijo y no hace críticas.
type Idea = { titulo: string; detalle: string };

const CAFECITO: Idea = { titulo: "Un botón de apoyo, tipo Cafecito", detalle: "Tus seguidores pueden invitarte un cafecito o dejar una propina en un toque, sin salir de tu sitio." };
const EDAD: Idea = { titulo: "Edad y avisos legales bien resueltos", detalle: "Verificación de edad, términos y privacidad armados con cuidado." };

const IDEAS: Record<TipoAdulto, Idea[]> = {
  links: [
    { titulo: "Tu propio sitio en vez de una página de links", detalle: "Un lugar con tu dominio, tu estilo y todos tus perfiles ordenados, que no depende de otra plataforma." },
    { titulo: "Cada link, medido", detalle: "Mirás qué enlace y de qué red llega más gente, para poner tu tiempo donde rinde." },
    CAFECITO,
    { titulo: "Tu comunidad, directo", detalle: "Lista de mails y avisos por WhatsApp o Telegram para contar las novedades sin depender del algoritmo." },
    { titulo: "Tienda y contenido propio", detalle: "Packs, cursos o membresías en tu sitio, con los medios de cobro que mejor te funcionen, que vemos juntos." },
    EDAD,
  ],
  creador: [
    { titulo: "Tu sitio propio, con tu marca", detalle: "Una casa en internet con tu dominio, para no depender de que una plataforma cambie las reglas." },
    { titulo: "Suscripciones y contenido en tu sitio", detalle: "Membresías, packs o cursos con acceso ordenado y los medios de cobro que mejor te funcionen, que vemos juntos." },
    CAFECITO,
    { titulo: "Saber de dónde viene cada fan", detalle: "Qué red, qué publicación y qué link trae más suscriptores." },
    { titulo: "Tu comunidad, directo", detalle: "Lista de mails y avisos por WhatsApp o Telegram para contar novedades." },
    EDAD,
  ],
  video: [
    { titulo: "Reproducción rápida en el celular", detalle: "Videos que arrancan enseguida y miniaturas livianas, que es lo que más pesa en la experiencia." },
    { titulo: "Buscador y categorías claras", detalle: "Que cada persona encuentre lo que busca en pocos toques, con filtros y resultados ordenados." },
    { titulo: "Cuentas, favoritos y listas", detalle: "Cada usuario guarda lo que le gusta y vuelve, lo que hace crecer las visitas recurrentes." },
    { titulo: "Panel para gestionar el contenido", detalle: "Subir, ordenar y publicar sin depender de un desarrollador para cada cambio." },
    { titulo: "Estadísticas de lo que más se ve", detalle: "Saber qué contenido, qué categoría y qué horario funcionan mejor." },
    EDAD,
  ],
  cams: [
    { titulo: "Una agenda de shows y avisos", detalle: "Que tu comunidad sepa cuándo estás en vivo y reciba un aviso en el celular." },
    { titulo: "Una página por cada artista", detalle: "Perfil, horarios y novedades en un lugar propio, fácil de compartir." },
    CAFECITO,
    { titulo: "Chat y comunidad", detalle: "Espacios para que tus seguidores se encuentren, con moderación simple." },
    { titulo: "Panel de estadísticas", detalle: "Quién entra, de dónde viene y qué horarios funcionan mejor." },
    EDAD,
  ],
  tienda: [
    { titulo: "Un catálogo ordenado y rápido", detalle: "Categorías claras, buscador y fichas que se ven bien en el celular." },
    { titulo: "Compra simple, con tus medios de cobro", detalle: "Un carrito corto y los medios de pago que mejor te funcionen, que vemos juntos." },
    { titulo: "Envíos con empaque discreto", detalle: "Explicado con claridad en cada producto, para que comprar sea cómodo." },
    { titulo: "Cuentas de cliente y pedidos", detalle: "Cada cliente ve sus compras y vuelve a comprar más fácil." },
    { titulo: "Panel de stock y precios", detalle: "Cambiar productos y precios sin tocar código." },
    EDAD,
  ],
  general: [
    { titulo: "Un sitio rápido y claro", detalle: "Que cargue enseguida en el celular y deje claro qué ofrecés y cómo contactarte." },
    { titulo: "Una forma simple de contactarte", detalle: "WhatsApp, formulario corto y botones claros en cada sección." },
    CAFECITO,
    { titulo: "Saber qué te trae clientes", detalle: "Reportes de cuánta gente entra, de dónde viene y cuántos te consultan." },
    { titulo: "Tu comunidad, directo", detalle: "Lista de mails y avisos para contar novedades." },
    EDAD,
  ],
};

const TRATO: Idea[] = [
  { titulo: "Discreción", detalle: "Tu proyecto y tus datos quedan entre nosotros." },
  { titulo: "Tuyo de verdad", detalle: "El dominio y el contenido son tuyos, y no quedás atado a nadie." },
  { titulo: "Todo incluido, sin pago inicial", detalle: "Hosting, dominio y mantenimiento mes a mes, para no juntar un pago grande antes de arrancar." },
  { titulo: "Atención directa", detalle: "Hablás con las personas que hacen tu sitio, sin vueltas." },
];

const PEDIMOS: Record<TipoAdulto, string[]> = {
  links: ["Qué plataformas o redes usás hoy", "Qué querés que haga tu sitio: vender, juntar suscriptores, ordenar tus links", "Si ya tenés marca, dominio o contenido para empezar"],
  creador: ["Qué plataformas o redes usás hoy", "Qué querés que haga tu sitio: vender, juntar suscriptores, mostrar tu marca", "Si ya tenés marca, dominio o contenido para empezar"],
  video: ["Cuánto contenido y cuánta gente tiene hoy el sitio", "Qué te gustaría mejorar: velocidad, búsqueda, cuentas, panel", "Si hay algo que hoy te frene o te cueste mantener"],
  cams: ["Cuántos artistas o shows tenés", "Qué te gustaría que tu comunidad pudiera hacer en el sitio", "Si hay algo que hoy te frene o te cueste mantener"],
  tienda: ["Qué vendés y cuántos productos tenés", "Cómo cobrás hoy y cómo querés cobrar", "Qué te gustaría que fuera más fácil de administrar"],
  general: ["A qué se dedica tu sitio", "Qué querés que haga tu sitio", "Qué te gustaría resolver primero"],
};

// El texto no es igual para todos: cambia según de qué trata el sitio, pero siempre dice lo mismo: no mostramos captura y nos encantaría trabajar juntos.
const TEXTO: Record<TipoAdulto, string> = {
  links: "No podemos mostrar una captura de un sitio así, pero eso no cambia nada: nos encantaría trabajar con vos. Vimos que tu página junta tus perfiles y enlaces, y esto es lo que podemos ofrecerte para que tenga un lugar propio.",
  creador: "No podemos mostrar una captura de un sitio así, pero eso no cambia nada: nos encantaría trabajar con vos. Vimos que ofrecés contenido y suscripciones, y esto es lo que podemos ofrecerte para que tu marca tenga un sitio propio.",
  video: "No podemos mostrar una captura de un sitio así, pero eso no cambia nada: nos encantaría trabajar con ustedes. Vimos que es un sitio de videos, y esto es lo que podemos ofrecerles para que sea más rápido y fácil de manejar.",
  cams: "No podemos mostrar una captura de un sitio así, pero eso no cambia nada: nos encantaría trabajar con ustedes. Vimos que hay transmisiones en vivo, y esto es lo que podemos ofrecerles para que la comunidad crezca.",
  tienda: "No podemos mostrar una captura de un sitio así, pero eso no cambia nada: nos encantaría trabajar con ustedes. Vimos que tienen una tienda, y esto es lo que podemos ofrecerles para vender mejor.",
  general: "No podemos mostrar una captura de un sitio así, pero eso no cambia nada: nos encantaría trabajar con ustedes. Esto es lo que podemos ofrecerles.",
};

export function analisisNicho(dominio: string, tipo: TipoAdulto = "general", _candidatos: Hallazgo[] = []): Analisis {
  void _candidatos;
  const nicho: Nicho = {
    panelTitulo: "No podemos mostrar una captura de este sitio, pero nos encantaría trabajar con vos.",
    titulo: "Nos encantaría trabajar con vos.",
    texto: TEXTO[tipo],
    hallazgos: [],
    ideas: IDEAS[tipo],
    trato: TRATO,
    pedimos: PEDIMOS[tipo],
  };
  return { dominio, puntaje: 100, hallazgos: [], planRecomendado: "corporativo", motivoPlan: "", tienda: false, nicho };
}
