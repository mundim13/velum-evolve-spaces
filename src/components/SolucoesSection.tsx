const SolucoesSection = () => {
  return (
    <section id="solucoes" className="py-20 md:py-28 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-wider">
              O QUE SOLUCIONAMOS PARA SUA VIDA
            </h2>

            <p className="font-montserrat text-lg text-muted-foreground leading-relaxed">
              Através da nossa inteligência multiconstrutiva, encontramos sempre a solução mais eficiente entre tecnologia, custo-benefício e qualidade.
              <br /><br />
              O resultado: obras previsíveis, rápidas e com preço fechado de verdade.
            </p>
          </div>

          {/* Triangle Graphic */}
          <div className="flex justify-center">
            <svg viewBox="0 0 300 280" className="w-full max-w-md" fill="none">
              {/* Triangle */}
              <polygon 
                points="150,50 260,230 40,230" 
                stroke="hsl(var(--primary))" 
                strokeWidth="2" 
                fill="hsl(var(--primary) / 0.1)"
              />
              
              {/* Top point - Preço Fechado */}
              <circle cx="150" cy="50" r="8" fill="hsl(var(--primary))" />
              <text x="150" y="30" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontFamily="Syncopate, sans-serif" fontWeight="400">
                PREÇO FECHADO
              </text>

              {/* Bottom left - Obra no Prazo */}
              <circle cx="40" cy="230" r="8" fill="hsl(var(--primary))" />
              <text x="40" y="260" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontFamily="Syncopate, sans-serif" fontWeight="400">
                OBRA NO PRAZO
              </text>

              {/* Bottom right - Tempo Reduzido */}
              <circle cx="260" cy="230" r="8" fill="hsl(var(--primary))" />
              <text x="260" y="260" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontFamily="Syncopate, sans-serif" fontWeight="400">
                TEMPO REDUZIDO
              </text>

              {/* Center connection lines */}
              <line x1="150" y1="90" x2="150" y2="160" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" strokeDasharray="4" />
              <line x1="90" y1="180" x2="210" y2="180" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" strokeDasharray="4" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolucoesSection;