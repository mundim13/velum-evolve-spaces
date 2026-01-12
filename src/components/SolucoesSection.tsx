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
    <section id="solucoes" className="py-20 md:py-28 px-4 bg-background scroll-mt-24">
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

          {/* Three Elements Centered */}
          <div ref={sectionRef} className="flex justify-center">
            <div className="w-full max-w-md">
              {/* Three elements in a row */}
              <div className="flex justify-center items-start gap-8 sm:gap-12">
                {/* Preço */}
                <div 
                  className={`flex flex-col items-center gap-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: '0.2s' }}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-primary" strokeWidth={2} />
                  </div>
                  <span className="font-syncopate text-[9px] sm:text-[10px] text-foreground tracking-wider text-center leading-tight font-bold">
                    PREÇO<br />FECHADO
                  </span>
                </div>

                {/* Prazo */}
                <div 
                  className={`flex flex-col items-center gap-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: '0.4s' }}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                    <CalendarCheck className="w-6 h-6 sm:w-7 sm:h-7 text-primary" strokeWidth={2} />
                  </div>
                  <span className="font-syncopate text-[9px] sm:text-[10px] text-foreground tracking-wider text-center leading-tight font-bold">
                    PRAZO<br />GARANTIDO
                  </span>
                </div>

                {/* Tempo */}
                <div 
                  className={`flex flex-col items-center gap-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: '0.6s' }}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-primary" strokeWidth={2} />
                  </div>
                  <span className="font-syncopate text-[9px] sm:text-[10px] text-foreground tracking-wider text-center leading-tight font-bold">
                    TEMPO<br />OTIMIZADO
                  </span>
                </div>
              </div>

              {/* Bottom tagline */}
              <div 
                className={`text-center mt-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '0.8s' }}
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
