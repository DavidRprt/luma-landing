export type Lang = "es" | "en";

export const t = {
  es: {
    nav: {
      services: "Servicios",
      works:    "Trabajos",
      ai:       "IA",
      contact:  "Contacto",
      cta:      "Hablemos",
    },
    hero: {
      eyebrow:   "Diseño web · Desarrollo · IA",
      h1a:       "Tu negocio merece",
      h1b:       "un sitio que",
      italic:    "impresione.",
      sub:       "Diseñamos y desarrollamos sitios modernos\nque hacen crecer tu negocio.",
      scrollCta: "Ver servicios",
    },
    services: {
      eyebrow: "Servicios",
      title:   "Lo que hacemos.",
      link:    "Ver trabajos",
      items: [
        { num: "01", title: "Diseño & Desarrollo Web", desc: "Landings, portafolios y sitios corporativos. Construidos con las mejores tecnologías para rendimiento real desde el día uno." },
        { num: "02", title: "E-commerce",              desc: "Tiendas con Shopify y Next.js. Desde el catálogo hasta el checkout, cada detalle pensado para convertir visitas en ventas." },
        { num: "03", title: "IA Integrada",            desc: "Chatbots entrenados con tu negocio, automatización de procesos y análisis inteligente directamente en tu sitio." },
        { num: "04", title: "Performance & SEO",       desc: "Core Web Vitals optimizados desde el inicio. Sitios que cargan en menos de 2 s y se posicionan en Google." },
      ],
    },
    works: {
      eyebrow: "Proyectos",
      title:   "Lo que hemos hecho.",
      cta:     "Ver proyecto",
      items: [
        { num: "01", title: "Red X Mayor", category: "E-commerce · Diseño web", year: "2025", desc: "Diseño y desarrollo completo de una plataforma e-commerce: catálogo de 600+ productos, cuentas por cliente y un panel de gestión interno.", stat: "600+ productos · 250 ciudades", tags: ["Next.js", "Dashboard", "Catálogo"], img: "redxmayor", link: "https://www.redxmayor.com" },
        { num: "02", title: "Chatbot IA", category: "IA · Atención al cliente", year: "2025", desc: "Raul es el asistente virtual de BECHA SA. Responde consultas, centraliza documentación interna y permite que los empleados suban reportes desde el chat. Opera de forma autónoma las 24 hs.", stat: "95% resolución autónoma", tags: ["Claude API", "Python"], img: "pulse" },
        { num: "03", title: "Fluxy", category: "SaaS · Landing page", year: "2025", desc: "Diseño y desarrollo completo de una plataforma SaaS de chatbots con IA. Landing orientada a la conversión, más todo el motor detrás: lógica, integraciones y base de datos.", stat: "94% resolución autónoma", tags: ["Next.js", "API propia", "OpenAI API"], img: "fluxia", link: "https://fluxiagroup.com" },
      ],
    },
    ai: {
      eyebrow: "Inteligencia Artificial",
      title:   "Menos tiempo\nen lo de siempre.",
      sub:     "Automatizamos lo repetitivo para que te puedas enfocar en lo que importa.",
      items: [
        { num: "01", tag: "Chatbots",        title: "Que atiende, vende y resuelve",  desc: "Lo entrenamos con tu negocio: preguntas frecuentes, catálogo, documentos. Opera en WhatsApp o tu sitio las 24 hs, sin que tengas que intervenir." },
        { num: "02", tag: "Automatización",  title: "Automatizamos lo repetitivo",    desc: "Lo implementamos en tu negocio y se encarga del resto: tareas que antes hacías a mano, ahora pasan solas. Con estadísticas para ver cuánto tiempo ganás." },
        { num: "03", tag: "Integración web", title: "IA visible en tu sitio",         desc: "Sumamos inteligencia directamente en tu web: asistentes de compra, búsqueda inteligente, respuestas automáticas. Algo que tus clientes van a notar." },
      ],
    },
    contact: {
      eyebrow:     "Contacto",
      title:       "¿Empezamos?",
      sub:         "Contanos de tu proyecto y te respondemos en menos de 24 hs.",
      email:       "hola@luma.com",
      chatHeader:  "Asistente _luma",
      online:      "en línea",
      greeting:    "¡Hola! Soy el asistente de _luma. ¿Qué tipo de sitio o solución web estás buscando?",
      placeholder: "Escribí sobre tu proyecto...",
      mockReply:   "¡Gracias por tu mensaje! En breve te contactamos. También podés escribirnos a hola@luma.com.",
    },
    pulseChat: {
      role:        "Asistente BECHA SA",
      online:      "en línea",
      userMsg:     "¿Versión vigente de PR-CAL-007?",
      botMsg:      "Versión vigente: v4.2 · aprobada 03/02/2026",
      cite:        "ISO 9001 · cl. 7.5.3",
      placeholder: "Preguntale a Raul…",
    },
    marquee: ["DISEÑO WEB", "E-COMMERCE", "INTELIGENCIA ARTIFICIAL", "NEXT.JS", "PERFORMANCE", "SHOPIFY", "AUTOMATIZACIÓN", "LANDING PAGES", "IA INTEGRADA", "SEO TÉCNICO"],
    footer: {
      tagline: "Diseño web · Desarrollo · IA",
      copy:    "© 2025 _luma",
    },
  },

  en: {
    nav: {
      services: "Services",
      works:    "Projects",
      ai:       "AI",
      contact:  "Contact",
      cta:      "Let's talk",
    },
    hero: {
      eyebrow:   "Web Design · Development · AI",
      h1a:       "Your business deserves",
      h1b:       "a site that",
      italic:    "impresses.",
      sub:       "We design and develop modern websites\nthat grow your business.",
      scrollCta: "Our services",
    },
    services: {
      eyebrow: "Services",
      title:   "What we do.",
      link:    "See our work",
      items: [
        { num: "01", title: "Web Design & Development", desc: "Landings, portfolios and corporate sites. Built with the best technologies for real performance from day one." },
        { num: "02", title: "E-commerce",               desc: "Stores with Shopify and Next.js. From catalog to checkout, every detail designed to turn visits into sales." },
        { num: "03", title: "Integrated AI",            desc: "Chatbots trained on your business, process automation and smart analytics directly on your site." },
        { num: "04", title: "Performance & SEO",        desc: "Core Web Vitals optimized from the start. Sites that load in under 2 s and rank on Google." },
      ],
    },
    works: {
      eyebrow: "Projects",
      title:   "What we have built.",
      cta:     "See project",
      items: [
        { num: "01", title: "Red X Mayor", category: "E-commerce · Web Design", year: "2025", desc: "Full design and development of an e-commerce platform: 600+ product catalog, per-client accounts and an internal management dashboard.", stat: "600+ products · 250 cities", tags: ["Next.js", "Dashboard", "Catalog"], img: "redxmayor", link: "https://www.redxmayor.com" },
        { num: "02", title: "Chatbot AI", category: "AI · Customer Service", year: "2025", desc: "Raul is BECHA SA's virtual assistant. Handles queries, centralizes internal documentation and lets employees upload reports from the chat. Operates autonomously 24/7.", stat: "95% autonomous resolution", tags: ["Claude API", "Python"], img: "pulse" },
        { num: "03", title: "Fluxy", category: "SaaS · Landing page", year: "2025", desc: "Full design and development of an AI chatbot SaaS platform. Conversion-focused landing page, plus everything behind it: logic, integrations and database.", stat: "94% autonomous resolution", tags: ["Next.js", "Custom API", "OpenAI API"], img: "fluxia", link: "https://fluxiagroup.com" },
      ],
    },
    ai: {
      eyebrow: "Artificial Intelligence",
      title:   "Less time on\nthe same old tasks.",
      sub:     "We automate the repetitive so you can focus on what actually matters.",
      items: [
        { num: "01", tag: "Chatbots",       title: "Answers, sells and resolves",    desc: "Trained on your business: FAQs, catalog, documents. Runs on WhatsApp or your site 24/7, without you having to step in." },
        { num: "02", tag: "Automation",     title: "We automate the repetitive",     desc: "We set it up in your business and it handles the rest: tasks you used to do by hand, now happen automatically. With stats so you can see exactly how much time you save." },
        { num: "03", tag: "Web integration",title: "AI your visitors will notice",   desc: "We add intelligence directly to your site: shopping assistants, smart search, automatic responses. Things your customers will actually feel." },
      ],
    },
    contact: {
      eyebrow:     "Contact",
      title:       "Let's start?",
      sub:         "Tell us about your project and we will respond within 24 hours.",
      email:       "hello@luma.com",
      chatHeader:  "_luma Assistant",
      online:      "online",
      greeting:    "Hi! I'm _luma's assistant. What kind of website or web solution are you looking for?",
      placeholder: "Tell me about your project...",
      mockReply:   "Thanks for your message! We'll be in touch shortly. You can also reach us at hello@luma.com.",
    },
    pulseChat: {
      role:        "BECHA SA Assistant",
      online:      "online",
      userMsg:     "Current version of PR-CAL-007?",
      botMsg:      "Current version: v4.2 · approved 03/02/2026",
      cite:        "ISO 9001 · cl. 7.5.3",
      placeholder: "Ask Raul…",
    },
    marquee: ["WEB DESIGN", "E-COMMERCE", "ARTIFICIAL INTELLIGENCE", "NEXT.JS", "PERFORMANCE", "SHOPIFY", "AUTOMATION", "LANDING PAGES", "INTEGRATED AI", "TECHNICAL SEO"],
    footer: {
      tagline: "Web Design · Development · AI",
      copy:    "© 2025 _luma",
    },
  },
} as const;
