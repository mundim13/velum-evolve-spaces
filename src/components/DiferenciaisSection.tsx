import { Check } from "lucide-react";

const DiferenciaisSection = () => {
  const diferenciais = [
    "Preço fechado de verdade",
    "Prazo garantido",
    "Qualidade de fábrica",
    "Modularidade evolutiva",
    "Neuroarquitetura aplicada",
    "Transparência total",
    "Engenharia + Arquitetura + IA",
    "Gestão inteligente da obra",
  ];

  return (
    <section id="diferenciais" className="py-20 md:py-28 px-4 bg-background">
      <div className="container mx-auto max-w-5xl">
        <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
          POR QUE A VELUM É DIFERENTE
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {diferenciais.map((item) => (
            <div
              key={item}
              className="velum-card flex items-center gap-3 p-4"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="font-montserrat text-sm text-foreground font-medium">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiferenciaisSection;