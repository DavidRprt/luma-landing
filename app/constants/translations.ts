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
        { num: "01", title: "Bloom", category: "E-commerce · Diseño",      year: "2025", desc: "Tienda online para marca de moda independiente. Experiencia de compra fluida y checkout en un paso.",                             stat: "+340% conversiones",      tags: ["Next.js", "Shopify", "Tailwind"],   img: "bloom" },
        { num: "02", title: "Chatbot IA", category: "IA · Atención al cliente", year: "2025", desc: "Raul es el asistente virtual de BECHA SA. Responde consultas, centraliza documentación interna y permite que los empleados suban reportes desde el chat. Opera de forma autónoma las 24 hs.", stat: "95% resolución autónoma", tags: ["Claude API", "Python"], img: "pulse" },
        { num: "03", title: "Axis",  category: "IA · Empresa",             year: "2025", desc: "Asistente interno de IA para empresa logística con 200+ empleados. Centraliza info y automatiza reportes.", stat: "200+ usuarios internos",  tags: ["RAG", "Next.js", "PostgreSQL"], img: "axis"  },
      ],
    },
    ai: {
      eyebrow: "Inteligencia Artificial",
      title:   "IA que trabaja\npor tu negocio.",
      sub:     "No solo automatizamos — entendemos tu negocio y construimos soluciones que lo transforman.",
      items: [
        { num: "01", tag: "Chatbots",       title: "Atención inteligente 24/7", desc: "Agentes conversacionales entrenados con tu empresa. Atienden, venden y resuelven sin intervención humana." },
        { num: "02", tag: "Automatización", title: "Procesos sin fricción",      desc: "Conectamos tus herramientas y eliminamos el trabajo manual con flujos inteligentes. Nuevo lead, venta, formulario: todo automatizado." },
        { num: "03", tag: "Analytics",      title: "Decisiones con datos",       desc: "Dashboards que se actualizan solos y resúmenes generados por IA para entender tu negocio en tiempo real." },
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
        { num: "01", title: "Bloom", category: "E-commerce · Design",   year: "2025", desc: "Online store for an independent fashion brand. Smooth shopping experience and one-step checkout.",                             stat: "+340% conversions",         tags: ["Next.js", "Shopify", "Tailwind"],   img: "bloom" },
        { num: "02", title: "Chatbot AI", category: "AI · Customer Service", year: "2025", desc: "Raul is BECHA SA's virtual assistant. Handles queries, centralizes internal documentation and lets employees upload reports from the chat. Operates autonomously 24/7.", stat: "95% autonomous resolution", tags: ["Claude API", "Python"], img: "pulse" },
        { num: "03", title: "Axis",  category: "AI · Enterprise",       year: "2025", desc: "Internal AI assistant for a logistics company with 200+ employees. Centralizes info and automates reports.", stat: "200+ internal users",        tags: ["RAG", "Next.js", "PostgreSQL"], img: "axis"  },
      ],
    },
    ai: {
      eyebrow: "Artificial Intelligence",
      title:   "AI that works\nfor your business.",
      sub:     "We don't just automate — we understand your business and build solutions that transform it.",
      items: [
        { num: "01", tag: "Chatbots",   title: "Intelligent 24/7 support",  desc: "Conversational agents trained on your company data. They sell, support and resolve without human intervention." },
        { num: "02", tag: "Automation", title: "Frictionless processes",     desc: "We connect your tools and eliminate manual work with intelligent workflows. New lead, sale, form: all automated." },
        { num: "03", tag: "Analytics",  title: "Data-driven decisions",      desc: "Self-updating dashboards and AI-generated summaries to understand your business in real time." },
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
