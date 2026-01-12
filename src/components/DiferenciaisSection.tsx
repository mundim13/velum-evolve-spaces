import { Check } from "lucide-react";

const DiferenciaisSection = () => {
  const servicos = [
    "Projeto de Arquitetura",
    "Projetos Complementares",
    "Compatibilização",
    "Orçamentos",
    "Cronograma Físico e Financeiro",
    "Viabilidades",
    "Execução e Acompanhamento",
    "Coletânea Lûm",
    "Criação de Produtos Personalizados",
    "Consultorias",
  ];

  return (
    <section id="diferenciais" className="py-20 md:py-28 px-4 bg-background">
      <div className="container mx-auto max-w-5xl">
        <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-8 tracking-wider">
          POR QUE A VELUM É DIFERENTE?
        </h2>

        <p className="font-montserrat text-base md:text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-16 leading-relaxed">
          A Velum atua de forma integrada em toda a jornada de construção. Você pode iniciar conosco no ponto em que estiver: com ou sem projeto, com estudos iniciais ou apenas com a ideia. A partir daí, assumimos a responsabilidade total, organizando decisões, prazos e execução até a entrega final.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {servicos.map((item) => (
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

        <p className="font-syncopate text-xl md:text-2xl font-bold text-primary text-center tracking-wider">
          VOCÊ ENTRA EM QUALQUER ETAPA
        </p>
      </div>
    </section>
  );
};

export default DiferenciaisSection;