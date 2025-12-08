import { BarChart3, FileText, Smartphone, Brain, TrendingUp } from "lucide-react";

const GestaoInteligente = () => {
  const features = [
    { Icon: FileText, label: "Relatório diário" },
    { Icon: BarChart3, label: "Dashboard previsto vs. realizado" },
    { Icon: TrendingUp, label: "Indicadores de obra" },
    { Icon: Brain, label: "IA auxiliando decisões" },
    { Icon: Smartphone, label: "Acesso pelo celular" },
  ];

  return (
    <section id="gestao" className="py-20 md:py-28 px-4 bg-background-alt">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mockups */}
          <div className="relative flex justify-center items-center">
            {/* Desktop mockup */}
            <div className="relative w-full max-w-md">
              <div className="bg-card rounded-xl border border-border p-4 shadow-velum">
                <div className="bg-background rounded-lg p-4 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-primary mx-auto mb-2" />
                    <span className="font-montserrat text-sm text-muted-foreground">Dashboard de Gestão</span>
                  </div>
                </div>
              </div>

              {/* Phone mockup */}
              <div className="absolute -bottom-4 -right-4 w-24 h-44 bg-card rounded-2xl border border-border p-2 shadow-velum-glow">
                <div className="bg-background rounded-xl h-full flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-wider">
              GESTÃO DE OBRAS INTELIGENTE
            </h2>

            <p className="font-montserrat text-lg text-muted-foreground leading-relaxed mb-8">
              Utilizamos um software de gestão com IA integrada, emitindo relatórios em tempo real de tudo o que acontece na obra.
              <br /><br />
              Você acompanha cada etapa com clareza e total transparência.
            </p>

            <ul className="space-y-4">
              {features.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-montserrat text-foreground">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GestaoInteligente;