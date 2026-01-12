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

          {/* Circular Economy Graphic with animations */}
          <div ref={sectionRef} className="flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              {/* SVG Circular background */}
              <svg viewBox="0 0 300 300" className="w-full h-full" fill="none">
                {/* Filters and gradients */}
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.12"/>
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.03"/>
                  </linearGradient>
                </defs>

                {/* Main outer circle */}
                <circle 
                  cx="150" cy="150" r="120"
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                  fill="url(#circleGradient)"
                  className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    strokeDasharray: 754,
                    strokeDashoffset: isVisible ? 0 : 754,
                    transition: 'stroke-dashoffset 1.5s ease-out, opacity 0.5s ease-out'
                  }}
                />

                {/* Circular arrows suggesting flow/cycle */}
                <path
                  d="M 150 30 A 120 120 0 0 1 256 100"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className={`transition-opacity duration-700 ${isVisible ? 'opacity-60' : 'opacity-0'}`}
                  style={{ transitionDelay: '1s' }}
                />
                <polygon 
                  points="256,100 248,88 262,92" 
                  fill="hsl(var(--primary))"
                  className={`transition-opacity duration-700 ${isVisible ? 'opacity-60' : 'opacity-0'}`}
                  style={{ transitionDelay: '1s' }}
                />

                <path
                  d="M 256 200 A 120 120 0 0 1 100 256"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className={`transition-opacity duration-700 ${isVisible ? 'opacity-60' : 'opacity-0'}`}
                  style={{ transitionDelay: '1.2s' }}
                />
                <polygon 
                  points="100,256 114,252 108,266" 
                  fill="hsl(var(--primary))"
                  className={`transition-opacity duration-700 ${isVisible ? 'opacity-60' : 'opacity-0'}`}
                  style={{ transitionDelay: '1.2s' }}
                />

                <path
                  d="M 44 200 A 120 120 0 0 1 44 100"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className={`transition-opacity duration-700 ${isVisible ? 'opacity-60' : 'opacity-0'}`}
                  style={{ transitionDelay: '1.4s' }}
                />
                <polygon 
                  points="44,100 52,112 38,108" 
                  fill="hsl(var(--primary))"
                  className={`transition-opacity duration-700 ${isVisible ? 'opacity-60' : 'opacity-0'}`}
                  style={{ transitionDelay: '1.4s' }}
                />
              </svg>

              {/* Top position - Preço Fechado de Verdade (12 o'clock) */}
              <div 
                className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 flex flex-col items-center gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                style={{ transitionDelay: '0.3s' }}
              >
                <div className="relative">
                  <div className={`absolute inset-0 bg-primary/50 rounded-full blur-lg transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '0.8s' }} />
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/25 border-2 border-primary flex items-center justify-center shadow-md">
                    <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-primary" strokeWidth={2.5} />
                  </div>
                </div>
                <span className="font-syncopate text-[9px] sm:text-[11px] text-foreground tracking-wider text-center leading-tight font-medium">
                  PREÇO FECHADO<br />DE VERDADE
                </span>
              </div>

              {/* Bottom left position - Prazo Assumido (7 o'clock) */}
              <div 
                className={`absolute bottom-[5%] left-[5%] flex flex-col items-center gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '0.5s' }}
              >
                <div className="relative">
                  <div className={`absolute inset-0 bg-primary/50 rounded-full blur-lg transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1s' }} />
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/25 border-2 border-primary flex items-center justify-center shadow-md">
                    <CalendarCheck className="w-6 h-6 sm:w-7 sm:h-7 text-primary" strokeWidth={2.5} />
                  </div>
                </div>
                <span className="font-syncopate text-[9px] sm:text-[11px] text-foreground tracking-wider text-center font-medium">
                  PRAZO ASSUMIDO
                </span>
              </div>

              {/* Bottom right position - Tempo Otimizado (5 o'clock) */}
              <div 
                className={`absolute bottom-[5%] right-[5%] flex flex-col items-center gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '0.7s' }}
              >
                <div className="relative">
                  <div className={`absolute inset-0 bg-primary/50 rounded-full blur-lg transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1.2s' }} />
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/25 border-2 border-primary flex items-center justify-center shadow-md">
                    <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-primary" strokeWidth={2.5} />
                  </div>
                </div>
                <span className="font-syncopate text-[9px] sm:text-[11px] text-foreground tracking-wider text-center font-medium">
                  TEMPO OTIMIZADO
                </span>
              </div>

              {/* Center - Responsabilidade Total */}
              <div 
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                style={{ transitionDelay: '1.5s' }}
              >
                <div className="relative">
                  {/* Outer glow ring */}
                  <div className={`absolute -inset-4 bg-primary/30 rounded-full blur-2xl transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1.8s' }} />
                  {/* Inner subtle pulse */}
                  <div className={`absolute -inset-2 bg-primary/40 rounded-full blur-md transition-opacity duration-700 ${isVisible ? 'opacity-100 animate-pulse' : 'opacity-0'}`} style={{ transitionDelay: '2s' }} />
                  {/* Main circle */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/30 p-3">
                    <span className="font-syncopate text-[10px] sm:text-xs text-primary-foreground tracking-wider text-center leading-tight font-bold">
                      RESPONSABILIDADE<br />TOTAL
                    </span>
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
