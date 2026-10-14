import { t } from "@/app/constants/translations";
import type { Analisis, Guino } from "@/app/sitio/analisisTipos";

// Guiños: si alguien analiza un sitio que hicimos nosotros, o el nuestro, el analizador no lo critica (sería mala publicidad):
// lo muestra con su captura y cuenta lo que tiene. Sin IA y sin marcar nada malo.
const host = (u: string) => u.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/[/?#].*$/, "");

type Proyecto = { title: string; category: string; desc: string; stat: string; link?: string; highlights: { title: string; desc: string }[] };
const PROYECTOS = (t.es.works.items as unknown as Proyecto[]).filter((p) => p.link);

// Marcas gigantes: el analizador no las critica. Se reconocen por el nombre del dominio (apple.com, apple.com.ar, www.apple.com…).
const GIGANTES = new Set((
  "apple google youtube amazon microsoft meta facebook instagram whatsapp netflix spotify disney hbo tesla nike adidas puma reebok coca-cola cocacola pepsi mcdonalds burgerking starbucks " +
  "samsung sony lg intel nvidia amd ibm oracle adobe salesforce sap cisco dell hp lenovo asus huawei xiaomi oppo " +
  "uber airbnb booking expedia paypal visa mastercard stripe shopify twitter x linkedin pinterest reddit tiktok snapchat twitch discord dropbox zoom slack notion figma canva " +
  "walmart costco ikea zara hm nestle unilever loreal gucci chanel dior louisvuitton rolex cartier " +
  "toyota honda ford chevrolet bmw mercedes-benz audi volkswagen volvo renault peugeot fiat ferrari porsche " +
  "mercadolibre mercadopago despegar globant arcor quilmes fravega garbarino carrefour jumbo cencosud naranjax galicia santander bbva bancor " +
  "nytimes bbc cnn bloomberg forbes wikipedia nasa mit stanford harvard oxford " +
  "fedex ups dhl boeing airbus lufthansa emirates qantas shell exxonmobil chevron bp " +
  "pfizer moderna novartis johnsonandjohnson bayer " +
  "openai anthropic claude chatgpt " +
  "ebay aliexpress alibaba etsy wish temu shein zalando asos nordstrom macys target-corp homedepot lowes bestbuy gamestop " +
  "nintendo playstation xbox ea ubisoft rockstargames epicgames steampowered riotgames blizzard activision " +
  "volkswagen nissan mazda hyundai kia subaru mitsubishi suzuki yamaha kawasaki harley-davidson lamborghini bugatti jaguar landrover mini citroen " +
  "gillette colgate nivea dove pampers huggies kelloggs heinz danone kraftheinz mondelez ferrero lindt nespresso redbull monsterenergy heineken corona budweiser fanta sprite " +
  "kfc subway dominos pizzahut wendys tacobell dunkindonuts " +
  "hilton marriott hyatt ihg accor tripadvisor trivago kayak skyscanner " +
  "americanairlines delta-airlines united southwest jetblue ryanair easyjet airfrance klm iberia latam aerolineas flybondi " +
  "citibank jpmorgan chase wellsfargo bankofamerica goldmansachs hsbc barclays americanexpress " +
  "telefonica vodafone verizon att t-mobile movistar claro personal telecom " +
  "ypf pampaenergia tenaris techint arcor molinos havanna freddo bimbo mastellone sancor la-serenisima cervecerialquilmes " +
  "lacoste calvinklein ralphlauren tommy hugoboss prada versace burberry hermes tiffany swarovski omega " +
  "bosch siemens philips panasonic canon nikon gopro bose jbl sennheiser logitech " +
  "bbva-argentina santander-argentina macro hsbc-argentina supervielle brubank uala " +
  "clarin lanacion infobae perfil pagina12 tn ole espn foxsports tycsports " +
  "mckinsey deloitte pwc kpmg accenture bain bcg " +
  "unicef who un worldbank imf unesco redcross greenpeace wwf"
).split(/\s+/));
const TLDS = new Set(["com", "net", "org", "io", "co", "ar", "es", "mx", "br", "cl", "uy", "uk", "us", "de", "fr", "it", "jp", "ai", "tv", "me"]);

function marcaGigante(d: string): boolean {
  const partes = d.split(".").filter(Boolean);
  while (partes.length > 1 && TLDS.has(partes[partes.length - 1])) partes.pop();
  return partes.length > 0 && GIGANTES.has(partes[partes.length - 1]);
}

export function guinoDe(dominio: string): Guino | null {
  const d = host(dominio);
  if (marcaGigante(d)) {
    return {
      tipo: "gigante",
      titulo: "Buen ojo: ese es un sitio de primer nivel.",
      texto: "Mirá lo que hace tan bien. Es la clase de calidad que buscamos en cada sitio que armamos.",
      virtudes: [
        { titulo: "Un mensaje claro en segundos", detalle: "Quien entra entiende enseguida qué ofrecen y qué hacer después." },
        { titulo: "Cuidado en cada detalle", detalle: "Tipografía, espacios y movimiento pensados hasta el último píxel." },
        { titulo: "Rápido y fluido en cualquier dispositivo", detalle: "Se ve y funciona igual de bien en el celular que en la computadora." },
        { titulo: "Cada pantalla lleva a una acción", detalle: "Todo el recorrido guía a comprar, escribir o descubrir algo más." },
      ],
    };
  }
  if (d === "underluma.com" || d.endsWith(".underluma.com") || d === "underluma.online" || d === "underluma.link") {
    return {
      tipo: "luma",
      titulo: "Ey, ese es el nuestro.",
      texto: "Nos estás analizando a nosotros. Así es un sitio de _luma: programado a mano, sin plantillas ni piezas ajenas.",
      virtudes: [
        { titulo: "Programado a mano", detalle: "Sin plantillas ni constructores: cada pantalla está hecha para lo que queremos contar." },
        { titulo: "Rápido en el celular", detalle: "Liviano, para que abra enseguida desde cualquier teléfono." },
        { titulo: "Pensado para conseguir clientes", detalle: "Mensajes claros, un camino simple hasta el contacto y un analizador como este para mostrar qué se puede hacer." },
        { titulo: "Todo incluido, sin pago inicial", detalle: "Hosting, dominio y mantenimiento mes a mes, para no juntar un pago grande antes de arrancar." },
      ],
    };
  }
  const p = PROYECTOS.find((x) => host(x.link!) === d);
  if (!p) return null;
  return {
    tipo: "portfolio",
    titulo: "Uy, a este lo conocemos bien.",
    texto: `Digamos que estuvimos metidos en cada rincón de ${p.title}. ${p.desc}`,
    ...(p.stat ? { dato: p.stat } : {}),
    virtudes: p.highlights.map((h) => ({ titulo: h.title, detalle: h.desc })),
  };
}

// Un reporte mínimo, sin hallazgos ni plan: el reporte y el panel muestran el guiño en su lugar.
export function analisisGuino(dominio: string, g: Guino, captura?: Analisis["captura"]): Analisis {
  return { dominio, puntaje: 100, hallazgos: [], planRecomendado: "corporativo", motivoPlan: "", tienda: false, guino: g, ...(captura ? { captura } : {}) };
}
