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
              Através da nossa inteligência multiconstrutiva, encontramos sempre a solução mais eficiente entre tecnologia, custo-benefício e qualidade.
              <br /><br />
              O resultado: obras previsíveis, rápidas e com preço fechado de verdade.
            </p>
          </div>

          {/* Triangle Graphic with animations */}
          <div ref={sectionRef} className="flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              {/* SVG Triangle background */}
              <svg viewBox="0 0 300 280" className="w-full h-full" fill="none">
                {/* Glow filter */}
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05"/>
                  </linearGradient>
                </defs>

                {/* Triangle with animation */}
                <polygon 
                  points="150,50 260,230 40,230" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                  fill="url(#triangleGradient)"
                  className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    strokeDasharray: 600,
                    strokeDashoffset: isVisible ? 0 : 600,
                    transition: 'stroke-dashoffset 1.5s ease-out, opacity 0.5s ease-out'
                  }}
                />
                
                {/* Connecting lines to center */}
                <line 
                  x1="150" y1="50" x2="150" y2="140" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="1" 
                  strokeDasharray="4"
                  className={`transition-opacity duration-500 ${isVisible ? 'opacity-40' : 'opacity-0'}`}
                  style={{ transitionDelay: '1s' }}
                />
                <line 
                  x1="40" y1="230" x2="120" y2="170" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="1" 
                  strokeDasharray="4"
                  className={`transition-opacity duration-500 ${isVisible ? 'opacity-40' : 'opacity-0'}`}
                  style={{ transitionDelay: '1.2s' }}
                />
                <line 
                  x1="260" y1="230" x2="180" y2="170" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="1" 
                  strokeDasharray="4"
                  className={`transition-opacity duration-500 ${isVisible ? 'opacity-40' : 'opacity-0'}`}
                  style={{ transitionDelay: '1.4s' }}
                />
              </svg>

              {/* Top vertex - Preço Fechado */}
              <div 
                className={`absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                style={{ transitionDelay: '0.3s' }}
              >
                <span className="font-syncopate text-[10px] sm:text-xs text-foreground tracking-wider text-center">
                  PREÇO FECHADO
                </span>
                <div className="relative">
                  <div className={`absolute inset-0 bg-primary/40 rounded-full blur-md transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '0.8s' }} />
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                </div>
              </div>

              {/* Bottom left vertex - Obra no Prazo */}
              <div 
                className={`absolute bottom-[8%] left-[5%] flex flex-col items-center gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '0.5s' }}
              >
                <div className="relative">
                  <div className={`absolute inset-0 bg-primary/40 rounded-full blur-md transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1s' }} />
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                </div>
                <span className="font-syncopate text-[10px] sm:text-xs text-foreground tracking-wider text-center">
                  OBRA NO PRAZO
                </span>
              </div>

              {/* Bottom right vertex - Tempo Reduzido */}
              <div 
                className={`absolute bottom-[8%] right-[5%] flex flex-col items-center gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '0.7s' }}
              >
                <div className="relative">
                  <div className={`absolute inset-0 bg-primary/40 rounded-full blur-md transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1.2s' }} />
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                </div>
                <span className="font-syncopate text-[10px] sm:text-xs text-foreground tracking-wider text-center">
                  TEMPO REDUZIDO
                </span>
              </div>

              {/* Center checkmark - Solution */}
              <div 
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                style={{ transitionDelay: '1.5s' }}
              >
                <div className="relative">
                  <div className={`absolute inset-0 bg-primary/50 rounded-full blur-xl transition-opacity duration-700 ${isVisible ? 'opacity-100 animate-pulse' : 'opacity-0'}`} style={{ transitionDelay: '1.8s' }} />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary border-2 border-primary flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolucoesSection;
