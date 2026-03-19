const testimonials = [
  {
    nome: "Mariana R.",
    cargo: "Proprietária — Residência Alphaville",
    texto:
      "A Velum entregou no prazo, dentro do orçamento e com um nível de acabamento que superou nossas expectativas.",
  },
  {
    nome: "Dr. Lucas P.",
    cargo: "Clínica Setor Bueno",
    texto:
      "O gerenciamento de obra nos deu total visibilidade. Sabíamos exatamente onde cada real foi investido.",
  },
  {
    nome: "Fernanda S.",
    cargo: "LÛM Studio — Home Office",
    texto:
      "Em 3 semanas eu tinha meu escritório pronto. Sem dor de cabeça, sem surpresas. É outro nível.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-velum-bg2 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <p className="font-dm text-velum-accent text-sm tracking-widest uppercase mb-3">
          Depoimentos
        </p>
        <h2 className="font-syne font-extrabold text-3xl md:text-5xl text-velum-text mb-12">
          Quem viveu, recomenda
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.nome}
              className="velum-glass rounded-2xl p-8 flex flex-col"
            >
              <p className="font-dm text-velum-text/90 leading-relaxed mb-6 flex-1">
                "{t.texto}"
              </p>
              <div>
                <p className="font-syne font-bold text-sm text-velum-text">
                  {t.nome}
                </p>
                <p className="font-dm text-xs text-velum-muted">{t.cargo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
