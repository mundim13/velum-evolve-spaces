import { useEffect, useRef, useState } from 'react';
import { DollarSign, Clock, CalendarCheck, CheckCircle2 } from 'lucide-react';

const SolucoesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
              Utilizamos nossa inteligência multiconstrutiva para assumir decisões técnicas e executar obras com método, previsibilidade e controle.
              <br /><br />
              O resultado: prazo cumprido, tempo reduzido e preço fechado de verdade.
            </p>
          </div>

          {/* Circular Economy Graphic - matching sketch */}
          <div ref={sectionRef} className="flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square">
              {/* SVG Circle with arrows */}
              <svg viewBox="0 0 300 300" className="w-full h-full" fill="none">
                {/* Main circle connecting all elements */}
                <circle
                  cx="150"
                  cy="150"
                  r="100"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  className={`transition-all duration-1500 ${isVisible ? 'opacity-70' : 'opacity-0'}`}
                  style={{
                    strokeDasharray: 628,
                    strokeDashoffset: isVisible ? 0 : 628,
                    transition: 'stroke-dashoffset 1.5s ease-out 0.2s, opacity 0.5s ease-out'
                  }}
                />

                {/* Arrow indicators on the circle */}
                <defs>
                  <marker 
                    id="arrowhead" 
                    markerWidth="8" 
                    markerHeight="6" 
                    refX="4" 
                    refY="3" 
                    orient="auto"
                  >
                    <polygon 
                      points="0 0, 8 3, 0 6" 
                      fill="hsl(var(--primary))"
                    />
                  </marker>
                </defs>

                {/* Arrow: Preço → Prazo (top to left, going counter-clockwise) */}
                <path
                  d="M 70 95 L 58 105"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className={`transition-opacity duration-500 ${isVisible ? 'opacity-80' : 'opacity-0'}`}
                  style={{ transitionDelay: '1s' }}
                />

                {/* Arrow: Prazo → Tempo (left to bottom, continuing flow) */}
                <path
                  d="M 95 235 L 110 245"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className={`transition-opacity duration-500 ${isVisible ? 'opacity-80' : 'opacity-0'}`}
                  style={{ transitionDelay: '1.2s' }}
                />

                {/* Arrow: Tempo → Preço (bottom-right to top, completing cycle) */}
                <path
                  d="M 225 80 L 210 65"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className={`transition-opacity duration-500 ${isVisible ? 'opacity-80' : 'opacity-0'}`}
                  style={{ transitionDelay: '1.4s' }}
                />
              </svg>

              {/* Top position - Preço Fechado de Verdade */}
              <div 
                className={`absolute top-[5%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                style={{ transitionDelay: '0.2s' }}
              >
                <span className="font-syncopate text-[9px] sm:text-[10px] text-foreground tracking-wider text-center leading-tight font-medium order-first mb-1">
                  PREÇO FECHADO<br />DE VERDADE
                </span>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={2} />
                </div>
              </div>

              {/* Left position - Prazo Garantido */}
              <div 
                className={`absolute top-1/2 left-[2%] -translate-y-1/2 flex flex-col items-center gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: '0.4s' }}
              >
                <span className="font-syncopate text-[9px] sm:text-[10px] text-foreground tracking-wider text-center font-medium mb-1">
                  PRAZO<br />GARANTIDO
                </span>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={2} />
                </div>
              </div>

              {/* Bottom position - Tempo Otimizado */}
              <div 
                className={`absolute bottom-[5%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '0.6s' }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={2} />
                </div>
                <span className="font-syncopate text-[9px] sm:text-[10px] text-foreground tracking-wider text-center font-medium mt-1">
                  TEMPO<br />OTIMIZADO
                </span>
              </div>

              {/* Center - Responsabilidade Total (text only) */}
              <div 
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                style={{ transitionDelay: '1s' }}
              >
                <span className="font-syncopate text-sm sm:text-base md:text-lg text-foreground tracking-wider text-center leading-tight font-bold block">
                  RESPONSABILIDADE<br />TOTAL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolucoesSection;
