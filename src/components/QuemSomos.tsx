import { Compass, Cog, Heart } from "lucide-react";

const QuemSomos = () => {
  const icons = [
    { Icon: Compass, label: "Arquitetura" },
    { Icon: Cog, label: "Engenharia" },
    { Icon: Heart, label: "Bem-estar" },
  ];

  return (
    <section id="quem-somos" className="py-20 md:py-28 px-4 bg-background-alt">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 tracking-wider">
          QUEM SOMOS
        </h2>

        <p className="font-montserrat text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
          A Velum nasceu para assumir a responsabilidade e entregar o seu projeto.
          <br /><br />
          Unimos arquitetura autoral, engenharia de precisão e gestão inteligente para coordenar e executar construções com método, previsibilidade e controle.
          <br /><br />
          Nossa missão é transformar a experiência de construir em algo leve e sem traumas, garantindo decisões claras, prazos definidos e tranquilidade em cada etapa.
        </p>

        {/* Icons */}
        <div className="flex justify-center gap-12 md:gap-20">
          {icons.map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <span className="font-montserrat text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuemSomos;