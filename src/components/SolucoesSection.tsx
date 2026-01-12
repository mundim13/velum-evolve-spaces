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

          {/* Chain Links Graphic */}
          <div ref={sectionRef} className="flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Three interlocking chain links */}
              <svg viewBox="0 0 400 200" className="w-full h-auto" fill="none">
                <defs>
                  <linearGradient id="linkGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="linkGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Link 1 - Left (Preço) - Rounded rectangle shape */}
                <rect
                  x="30"
                  y="60"
                  width="120"
                  height="80"
                  rx="40"
                  stroke="url(#linkGradient1)"
                  strokeWidth="8"
                  fill="none"
                  className={`transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: '0.2s' }}
                />

                {/* Link 2 - Center (Prazo) - Overlapping with both */}
                <rect
                  x="140"
                  y="60"
                  width="120"
                  height="80"
                  rx="40"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  fill="none"
                  className={`transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: '0.5s' }}
                />

                {/* Link 3 - Right (Tempo) */}
                <rect
                  x="250"
                  y="60"
                  width="120"
                  height="80"
                  rx="40"
                  stroke="url(#linkGradient2)"
                  strokeWidth="8"
                  fill="none"
                  className={`transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: '0.8s' }}
                />

                {/* Overlap covers - to create interlocking effect */}
                {/* Cover left link top where center goes over */}
                <rect
                  x="140"
                  y="52"
                  width="18"
                  height="24"
                  fill="hsl(var(--background))"
                  className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: '0.6s' }}
                />
                <path
                  d="M 140 60 L 140 76"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: '0.6s' }}
                />

                {/* Cover center link bottom where right goes under */}
                <rect
                  x="242"
                  y="124"
                  width="18"
                  height="24"
                  fill="hsl(var(--background))"
                  className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: '0.9s' }}
                />
                <path
                  d="M 260 124 L 260 140"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transitionDelay: '0.9s' }}
                />
              </svg>

              {/* Labels below each link */}
              <div className="flex justify-between px-4 mt-4">
                {/* Preço */}
                <div 
                  className={`flex flex-col items-center gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: '0.3s', width: '30%' }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={2} />
                  </div>
                  <span className="font-syncopate text-[8px] sm:text-[9px] text-foreground tracking-wider text-center leading-tight font-bold">
                    PREÇO<br />FECHADO
                  </span>
                </div>

                {/* Prazo */}
                <div 
                  className={`flex flex-col items-center gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: '0.6s', width: '30%' }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={2} />
                  </div>
                  <span className="font-syncopate text-[8px] sm:text-[9px] text-foreground tracking-wider text-center leading-tight font-bold">
                    PRAZO<br />GARANTIDO
                  </span>
                </div>

                {/* Tempo */}
                <div 
                  className={`flex flex-col items-center gap-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: '0.9s', width: '30%' }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={2} />
                  </div>
                  <span className="font-syncopate text-[8px] sm:text-[9px] text-foreground tracking-wider text-center leading-tight font-bold">
                    TEMPO<br />OTIMIZADO
                  </span>
                </div>
              </div>

              {/* Bottom tagline */}
              <div 
                className={`text-center mt-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '1.2s' }}
              >
                <span className="font-syncopate text-[10px] sm:text-xs text-primary tracking-wider font-bold">
                  INSEPARÁVEIS. RESPONSABILIDADE TOTAL.
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
