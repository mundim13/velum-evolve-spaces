import { FileText, Settings, Hammer } from "lucide-react";

const ModeloIntegrado = () => {
  const pillars = [
    {
      Icon: FileText,
      title: "PROJETO (PRÉ-OBRA)",
      description: "",
      items: [
        "Arquitetura e interiores",
        "Complementares estruturais, elétricos e hidráulicos",
        "Compatibilização técnica",
        "Cronograma",
        "Orçamento fechado",
        "Fluxo de desembolso",
      ],
      footer: "Tudo pensado para garantir previsibilidade.",
    },
    {
      Icon: Settings,
      title: "GESTÃO",
      description: "",
      items: [
        "Software próprio",
        "IA auxiliando decisões",
        "Relatórios em tempo real",
        "Diário de obra digital",
        "Indicadores previstos vs. realizados",
        "Um único ponto de contato",
      ],
      footer: null,
    },
    {
      Icon: Hammer,
      title: "OBRA / EXECUÇÃO",
      description: "",
      items: [
        "Montagem rápida, limpa e industrializada",
        "Precisão milimétrica",
        "Menos interferências",
        "Mais qualidade",
        "Entrega técnica garantida",
      ],
      footer: null,
    },
  ];

  return (
    <section id="modelo" className="py-20 md:py-28 px-4 bg-background-alt">
      <div className="container mx-auto max-w-6xl">
        <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-16 tracking-wider">
          NOSSO MODELO INTEGRADO
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map(({ Icon, title, description, items, footer }) => (
            <div key={title} className="velum-card">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Icon className="w-7 h-7 text-primary" />
              </div>

              <h3 className="font-syncopate text-sm font-bold text-foreground mb-4">
                {title}
              </h3>

              {description && (
                <p className="font-montserrat text-muted-foreground mb-4">
                  {description}
                </p>
              )}

              <ul className="space-y-2 mb-4">
                {items.map((item) => (
                  <li key={item} className="font-montserrat text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>

              {footer && (
                <p className="font-montserrat text-sm text-primary font-medium italic">
                  {footer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModeloIntegrado;