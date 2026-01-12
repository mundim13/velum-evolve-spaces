import { Search, FileCheck, Factory, CheckCircle } from "lucide-react";

const JornadaVelum = () => {
  const steps = [
    {
      Icon: Search,
      number: "1",
      title: "Entendimento & Diagnóstico",
      description: "Diagnóstico completo das necessidades, análise do que já existe (terreno, projetos, estudos) e definição do melhor caminho técnico e financeiro.",
      note: null,
    },
    {
      Icon: FileCheck,
      number: "2",
      title: "Projeto & Planejamento",
      description: "Arquitetura e interiores (se não existentes), projetos complementares, compatibilização técnica, orçamento fechado, cronograma e planejamento financeiro.",
      note: "Se o cliente já possui projeto, a Velum valida, compatibiliza e segue com segurança.",
    },
    {
      Icon: Factory,
      number: "3",
      title: "Produção & Obra",
      description: "Execução técnica coordenada, montagem industrializada, gestão integrada da obra, acompanhamento em tempo real e controle de qualidade.",
      note: null,
    },
    {
      Icon: CheckCircle,
      number: "4",
      title: "Entrega & Acompanhamento",
      description: "Entrega técnica garantida, acompanhamento pós-obra e suporte final.",
      note: null,
    },
  ];

  return (
    <section id="jornada" className="py-20 md:py-28 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-8 tracking-wider">
          COMO FUNCIONA A JORNADA VELUM
        </h2>

        {/* Intro text */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="font-montserrat text-muted-foreground text-base md:text-lg leading-relaxed">
            A Velum atua de forma integrada em toda a jornada da construção.
            <br className="hidden md:block" />
            <span className="font-medium text-foreground"> Você pode iniciar conosco no ponto em que estiver</span> — com ou sem projeto, com estudos iniciais ou apenas com a ideia.
          </p>
          <p className="font-montserrat text-muted-foreground text-base md:text-lg leading-relaxed mt-4">
            A partir daí, assumimos a <span className="font-medium text-foreground">responsabilidade total</span>, organizando decisões, prazos e execução até a entrega final.
          </p>
        </div>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden lg:block relative">
          {/* Connecting line */}
          <div className="absolute top-14 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary via-primary to-primary/30" />

          <div className="grid grid-cols-4 gap-6 relative">
            {steps.map(({ Icon, number, title, description, note }) => (
              <div key={number} className="text-center">
                {/* Icon circle */}
                <div className="relative w-28 h-28 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                    <Icon className="w-12 h-12 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-syncopate text-sm font-bold">
                    {number}
                  </div>
                </div>

                <h3 className="font-syncopate text-xs font-bold text-foreground mb-3 leading-tight">
                  {title}
                </h3>
                <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
                {note && (
                  <p className="font-montserrat text-xs text-primary/80 italic mt-3 bg-primary/5 rounded-lg p-2">
                    {note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tablet: 2x2 grid */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-8">
          {steps.map(({ Icon, number, title, description, note }) => (
            <div key={number} className="velum-card">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-syncopate text-xs font-bold">
                    {number}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-syncopate text-xs font-bold text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                  {note && (
                    <p className="font-montserrat text-xs text-primary/80 italic mt-3 bg-primary/5 rounded-lg p-2">
                      {note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="md:hidden space-y-6">
          {steps.map(({ Icon, number, title, description, note }, index) => (
            <div key={number} className="relative">
              {/* Connecting line for mobile */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-primary/20 -mb-6" style={{ height: 'calc(100% + 1.5rem)' }} />
              )}
              
              <div className="flex gap-4">
                <div className="relative flex-shrink-0 z-10">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary bg-background">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-syncopate text-xs font-bold">
                    {number}
                  </div>
                </div>

                <div className="flex-1 pt-2">
                  <h3 className="font-syncopate text-xs font-bold text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="font-montserrat text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                  {note && (
                    <p className="font-montserrat text-xs text-primary/80 italic mt-3 bg-primary/5 rounded-lg p-2">
                      {note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing phrase */}
        <div className="mt-16 text-center">
          <p className="font-syncopate text-sm md:text-base font-bold text-primary tracking-wide">
            Você entra em qualquer etapa. A responsabilidade é sempre total.
          </p>
        </div>
      </div>
    </section>
  );
};

export default JornadaVelum;
