import { Search, PenTool, Calculator, HardHat, CheckCircle } from "lucide-react";

const JornadaCliente = () => {
  const steps = [
    {
      Icon: Search,
      number: "1",
      title: "Entendimento e Diagnóstico",
      description: "Compreensão completa das suas necessidades e objetivos.",
    },
    {
      Icon: PenTool,
      number: "2",
      title: "Projetos e Compatibilização",
      description: "Desenvolvimento e integração de todos os projetos.",
    },
    {
      Icon: Calculator,
      number: "3",
      title: "Planejamento e Orçamento",
      description: "Cronograma físico-financeiro detalhado.",
    },
    {
      Icon: HardHat,
      number: "4",
      title: "Obra",
      description: "Execução com gestão inteligente e qualidade.",
    },
    {
      Icon: CheckCircle,
      number: "5",
      title: "Acompanhamento e Entrega",
      description: "Finalização técnica e suporte pós-obra.",
    },
  ];

  return (
    <section id="jornada" className="py-20 md:py-28 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-16 tracking-wider">
          JORNADA DO CLIENTE VELUM
        </h2>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden md:block relative">
          <div className="grid grid-cols-5 gap-4 relative">
            {steps.map(({ Icon, number, title, description }, index) => (
              <div key={number} className="text-center relative">
                {/* Connecting line segment - only between icons */}
                {index < steps.length - 1 && (
                  <div className="absolute top-12 left-[calc(50%+48px)] right-[calc(-50%+48px)] h-0.5 bg-gradient-to-r from-primary to-primary/50" />
                )}
                
                {/* Icon circle */}
                <div className="relative w-24 h-24 mx-auto mb-6 z-10">
                  <div className="absolute inset-0 rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-lg">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-syncopate text-sm font-bold">
                    {number}
                  </div>
                </div>

                <h3 className="font-syncopate text-[10px] font-bold text-foreground mb-2 leading-tight">
                  {title.toUpperCase()}
                </h3>
                <p className="font-montserrat text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="md:hidden space-y-6">
          {steps.map(({ Icon, number, title, description }, index) => (
            <div key={number} className="relative">
              {/* Vertical line segment - only between icons */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-[72px] h-6 w-0.5 bg-gradient-to-b from-primary to-primary/50" />
              )}
              
              <div className="flex gap-4">
                <div className="relative flex-shrink-0 z-10">
                  <div className="w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-lg">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-syncopate text-xs font-bold">
                    {number}
                  </div>
                </div>

                <div className="flex-1 pt-2">
                  <h3 className="font-syncopate text-[10px] font-bold text-foreground mb-1 leading-tight">
                    {title.toUpperCase()}
                  </h3>
                  <p className="font-montserrat text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JornadaCliente;