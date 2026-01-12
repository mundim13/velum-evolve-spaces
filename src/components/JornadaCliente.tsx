import { Search, PenTool, Calculator, HardHat, CheckCircle } from "lucide-react";

const JornadaCliente = () => {
  const steps = [
    {
      Icon: Search,
      number: "1",
      title: "Entendimento e Diagnóstico",
      description: "Compreensão completa das suas necessidades e objetivos.",
      note: null,
    },
    {
      Icon: PenTool,
      number: "2",
      title: "Projetos e Compatibilização",
      description: "Desenvolvimento e integração de todos os projetos.",
      note: "Se o cliente já possui projeto, a Velum valida, compatibiliza e segue com segurança.",
    },
    {
      Icon: Calculator,
      number: "3",
      title: "Planejamento e Orçamento",
      description: "Cronograma físico-financeiro detalhado.",
      note: null,
    },
    {
      Icon: HardHat,
      number: "4",
      title: "Obra",
      description: "Execução com gestão inteligente e qualidade.",
      note: null,
    },
    {
      Icon: CheckCircle,
      number: "5",
      title: "Acompanhamento e Entrega",
      description: "Finalização técnica e suporte pós-obra.",
      note: null,
    },
  ];

  return (
    <section id="jornada" className="py-20 md:py-28 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-16 tracking-wider">
          JORNADA DO CLIENTE VELUM
        </h2>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden lg:block relative">
          <div className="grid grid-cols-5 gap-6 relative">
            {steps.map(({ Icon, number, title, description, note }, index) => (
              <div key={number} className="text-center relative flex flex-col items-center">
                {/* Connecting line segment - only between icons */}
                {index < steps.length - 1 && (
                  <div className="absolute top-10 left-[calc(50%+40px)] right-[calc(-50%+40px)] h-0.5 bg-gradient-to-r from-primary to-primary/50" />
                )}
                
                {/* Icon circle */}
                <div className="relative w-20 h-20 mb-5 z-10">
                  <div className="absolute inset-0 rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-lg">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-syncopate text-xs font-bold">
                    {number}
                  </div>
                </div>

                {/* Text box */}
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 w-full">
                  <h3 className="font-syncopate text-[10px] font-bold text-foreground mb-2 leading-tight tracking-wide">
                    {title.toUpperCase()}
                  </h3>
                  <p className="font-montserrat text-xs text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Note box - only for step 2 */}
                {note && (
                  <div className="mt-3 bg-primary/10 border border-primary/30 rounded-lg p-3 w-full">
                    <p className="font-montserrat text-[10px] text-primary leading-relaxed">
                      {note}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tablet: 3 + 2 grid */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {steps.slice(0, 3).map(({ Icon, number, title, description, note }) => (
              <div key={number} className="text-center flex flex-col items-center">
                <div className="relative w-16 h-16 mb-4 z-10">
                  <div className="rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-lg w-full h-full">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-syncopate text-xs font-bold">
                    {number}
                  </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-3 w-full">
                  <h3 className="font-syncopate text-[9px] font-bold text-foreground mb-1 leading-tight tracking-wide">
                    {title.toUpperCase()}
                  </h3>
                  <p className="font-montserrat text-[11px] text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
                {note && (
                  <div className="mt-2 bg-primary/10 border border-primary/30 rounded-lg p-2 w-full">
                    <p className="font-montserrat text-[9px] text-primary leading-relaxed">
                      {note}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {steps.slice(3, 5).map(({ Icon, number, title, description }) => (
              <div key={number} className="text-center flex flex-col items-center">
                <div className="relative w-16 h-16 mb-4 z-10">
                  <div className="rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-lg w-full h-full">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-syncopate text-xs font-bold">
                    {number}
                  </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-3 w-full">
                  <h3 className="font-syncopate text-[9px] font-bold text-foreground mb-1 leading-tight tracking-wide">
                    {title.toUpperCase()}
                  </h3>
                  <p className="font-montserrat text-[11px] text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="md:hidden space-y-5">
          {steps.map(({ Icon, number, title, description, note }, index) => (
            <div key={number} className="relative">
              {/* Vertical line segment - only between icons */}
              {index < steps.length - 1 && (
                <div className="absolute left-7 top-[60px] h-5 w-0.5 bg-gradient-to-b from-primary to-primary/50" />
              )}
              
              <div className="flex gap-4 items-start">
                <div className="relative flex-shrink-0 z-10">
                  <div className="w-14 h-14 rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-syncopate text-[10px] font-bold">
                    {number}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-3">
                    <h3 className="font-syncopate text-[10px] font-bold text-foreground mb-1 leading-tight tracking-wide">
                      {title.toUpperCase()}
                    </h3>
                    <p className="font-montserrat text-xs text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>
                  {note && (
                    <div className="mt-2 bg-primary/10 border border-primary/30 rounded-lg p-2">
                      <p className="font-montserrat text-[10px] text-primary leading-relaxed">
                        {note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final statement */}
        <div className="mt-12 md:mt-16 text-center">
          <p className="font-syncopate text-[10px] sm:text-xs md:text-sm font-bold text-primary tracking-wider whitespace-nowrap">
            VOCÊ ENTRA EM QUALQUER ETAPA. A RESPONSABILIDADE É SEMPRE TOTAL.
          </p>
        </div>
      </div>
    </section>
  );
};

export default JornadaCliente;