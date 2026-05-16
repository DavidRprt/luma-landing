const features = [
  { title: "Diseño moderno", desc: "Sitios que destacan desde el primer scroll." },
  { title: "Rápidos y optimizados", desc: "Performance real, no solo en el papel." },
  { title: "IA integrada", desc: "Chatbots, automatizaciones y más desde el día uno." },
  { title: "Mobile first", desc: "Perfecto en cualquier dispositivo." },
];

const Features = () => {
  return (
    <section id="servicios" className="min-h-screen bg-black px-5 md:px-20 py-32 flex flex-col justify-center">
      <h2 className="text-3xl md:text-5xl font-semibold text-white mb-16">Lo que hacemos.</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f) => (
          <div key={f.title} className="border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors duration-300">
            <h3 className="text-white text-xl font-medium mb-3">{f.title}</h3>
            <p className="text-white/40">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
