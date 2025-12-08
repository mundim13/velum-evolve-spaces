import { Search, FileCheck, Factory, CheckCircle } from "lucide-react";

const JornadaCliente = () => {
  const steps = [
    {
      Icon: Search,
      number: "1",
      title: "Entendimento",
      description: "Diagnóstico completo das suas necessidades.",
    },
    {
      Icon: FileCheck,
      number: "2",
      title: "Projeto & Planejamento",
      description: "Pré-obra completa com orçamento, cronograma e compatibilizações.",
    },
    {
      Icon: Factory,
      number: "3",
      title: "Produção & Obra",
      description: "Montagem industrializada + gestão inteligente.",
    },
    {
      Icon: CheckCircle,
      number: "4",
      title: "Entrega & Acompanhamento",
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
          {/* Connecting line */}
          <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/30" />

          <div className="grid grid-cols-4 gap-6 relative">
            {steps.map(({ Icon, number, title, description }) => (
              <div key={number} className="text-center">
                {/* Icon circle */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-syncopate text-sm font-bold">
                    {number}
                  </div>
                </div>

                <h3 className="font-syncopate text-xs font-bold text-foreground mb-2">
                  {title}
                </h3>
                <p className="font-montserrat text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="md:hidden space-y-8">
          {steps.map(({ Icon, number, title, description }) => (
            <div key={number} className="flex gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-syncopate text-xs font-bold">
                  {number}
                </div>
              </div>

              <div className="flex-1 pt-2">
                <h3 className="font-syncopate text-xs font-bold text-foreground mb-1">
                  {title}
                </h3>
                <p className="font-montserrat text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JornadaCliente;