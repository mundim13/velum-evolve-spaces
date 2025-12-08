const SolucoesSection = () => {
  return (
    <section id="solucoes" className="py-20 md:py-28 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
              O QUE SOLUCIONAMOS PARA SUA VIDA
            </h2>

            <p className="font-montserrat text-lg text-muted-foreground leading-relaxed">
              Através da nossa inteligência multiconstrutiva, não ficamos presos a um único sistema construtivo. Buscamos sempre a solução ideal entre tecnologia, custo-benefício e eficiência.
              <br /><br />
              O resultado? Obras previsíveis, rápidas e com preço garantido.
            </p>
          </div>

          {/* Triangle Graphic */}
          <div className="flex justify-center">
            <svg viewBox="0 0 300 280" className="w-full max-w-md" fill="none">
              {/* Triangle */}
              <polygon 
                points="150,30 280,250 20,250" 
                stroke="hsl(var(--primary))" 
                strokeWidth="2" 
                fill="hsl(var(--primary) / 0.1)"
              />
              
              {/* Top point - Preço Fechado */}
              <circle cx="150" cy="30" r="8" fill="hsl(var(--primary))" />
              <text x="150" y="10" textAnchor="middle" fill="hsl(var(--foreground))" className="font-syncopate text-xs">
                PREÇO FECHADO
              </text>

              {/* Bottom left - Obra no Prazo */}
              <circle cx="20" cy="250" r="8" fill="hsl(var(--primary))" />
              <text x="50" y="275" textAnchor="start" fill="hsl(var(--foreground))" className="font-syncopate text-xs">
                OBRA NO PRAZO
              </text>

              {/* Bottom right - Tempo Reduzido */}
              <circle cx="280" cy="250" r="8" fill="hsl(var(--primary))" />
              <text x="250" y="275" textAnchor="end" fill="hsl(var(--foreground))" className="font-syncopate text-xs">
                TEMPO REDUZIDO
              </text>

              {/* Center connection lines */}
              <line x1="150" y1="100" x2="150" y2="180" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" strokeDasharray="4" />
              <line x1="80" y1="200" x2="220" y2="200" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" strokeDasharray="4" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolucoesSection;