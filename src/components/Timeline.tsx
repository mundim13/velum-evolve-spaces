import { Utensils, Home, Sofa, Users, DollarSign, Building2 } from "lucide-react";

const Timeline = () => {
  const stages = [
    { icon: Utensils, name: "Ultrapocket Gourmet" },
    { icon: Home, name: "Esencial" },
    { icon: Sofa, name: "Confort" },
    { icon: Users, name: "Family" },
    { icon: DollarSign, name: "Payback" },
    { icon: Building2, name: "Outhomes" },
  ];

  return (
    <section id="timeline" className="scroll-mt-32 py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Linha <span className="gradient-text">Evolutiva</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Cada etapa representa uma evolução natural do seu espaço, sem desperdício ou trauma.
        </p>

        {/* Mobile: Vertical */}
        <div className="md:hidden space-y-6">
          {stages.map((stage, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary-variant/10 flex items-center justify-center">
                <stage.icon className="h-8 w-8 text-primary-variant" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{stage.name}</p>
                <p className="text-sm text-muted-foreground">Etapa {index + 1}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Horizontal */}
        <div className="hidden md:block relative">
          {/* Line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary-variant to-accent" />

          <div className="relative flex justify-between">
            {stages.map((stage, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-background border-4 border-primary-variant/20 flex items-center justify-center mb-4 shadow-card">
                  <stage.icon className="h-7 w-7 text-primary-variant" />
                </div>
                <p className="font-semibold text-sm text-center">{stage.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
