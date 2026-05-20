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
        { num: "02", title: "Pulse", category: "IA · Atención al cliente", year: "2025", desc: "Plataforma con IA conversacional que resuelve el 85% de consultas de forma autónoma. Opera 24/7.",                               stat: "85% resolución autónoma", tags: ["OpenAI", "React", "Supabase"],     img: "pulse" },
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
        { num: "02", title: "Pulse", category: "AI · Customer Service", year: "2025", desc: "AI conversational platform that resolves 85% of queries autonomously. Operates 24/7.",                                          stat: "85% autonomous resolution", tags: ["OpenAI", "React", "Supabase"],     img: "pulse" },
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
    footer: {
      tagline: "Web Design · Development · AI",
      copy:    "© 2025 _luma",
    },
  },
} as const;
