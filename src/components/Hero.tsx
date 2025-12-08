import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
const Hero = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Fixed at 4/7 products launched
  const launched = 4;
  const progressPercent = 57.14;
  useEffect(() => {
    // Next launch: December 3, 2025 at 19:45
    const nextLaunch = new Date('2025-12-03T19:45:00-03:00');

    // Countdown timer
    const timer = setInterval(() => {
      const now = new Date();
      const diff = nextLaunch.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
        minutes: Math.floor(diff % (1000 * 60 * 60) / (1000 * 60)),
        seconds: Math.floor(diff % (1000 * 60) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return <section id="hero" className="hero relative min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-24 px-4">
      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center space-y-8 w-full">
        <h1 className="hero-title text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight px-4">
          Seu projeto pronto em{" "}
          <span className="accent text-gradient">
            poucas semanas e com preço garantido!
          </span>
        </h1>

        <p className="subtitle text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
                        Desenvolvemos projetos inteligentes e personalizados, além de administrar e gerir obras híbridas, modulares e industrializadas com prazo e preço garantidos.
        </p>

        {/* CTAs */}
        <div className="ctas mt-8">
          <div className="flex flex-col gap-4 justify-center items-stretch max-w-5xl mx-auto">
            {/* Primary CTA - Destaque */}
            <button data-whatsapp="true" data-msg="Olá! Quero um produto LÛM." className="btn-hero-primary w-full h-14 px-8 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-elevated">
              Quero um produto LÛM
            </button>
            
            {/* Secondary CTAs - Grid responsivo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button data-whatsapp="true" data-msg="Olá! Tenho projeto e quero executar." className="btn-hero-secondary w-full h-14 px-8 text-base font-semibold transition-all duration-300 hover:scale-[1.02]">
                Tenho projeto e quero executar
              </button>
              <button data-whatsapp="true" data-msg="Olá! Não tenho projeto e quero fazer um personalizado." className="btn-hero-secondary w-full h-14 px-8 text-base font-semibold transition-all duration-300 hover:scale-[1.02]">
                Não tenho projeto e quero personalizar
              </button>
            </div>
          </div>
        </div>

        {/* Coletânea LÛM Card */}
        <div className="lum-card mt-24 max-w-md mx-auto">
          <h3 className="font-semibold text-xl mb-4 text-center" style={{
          letterSpacing: '1.5px'
        }}>Coletânea LÛM</h3>
          <div className="space-y-3">
            <div className="lum-meta flex justify-between text-sm">
              <span>{launched}/7 Produtos lançados</span>
              <span className="lum-label">Próximo produto em:</span>
            </div>
            
            {/* Progress bar */}
            <div className="progress-bar">
              <span style={{
              width: `${progressPercent}%`
            }}>
                <span className="absolute inset-0 w-full h-full" style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: 'shimmer 6s infinite linear'
              }} />
              </span>
            </div>
            
            <div className="countdown flex justify-center gap-4 text-center pt-2">
              <div>
                <div className="num cd-days">{String(countdown.days).padStart(2, '0')}</div>
                <div className="unit">dias</div>
              </div>
              <div className="num">:</div>
              <div>
                <div className="num cd-hours">{String(countdown.hours).padStart(2, '0')}</div>
                <div className="unit">hrs</div>
              </div>
              <div className="num">:</div>
              <div>
                <div className="num cd-min">{String(countdown.minutes).padStart(2, '0')}</div>
                <div className="unit">min</div>
              </div>
              <div className="num">:</div>
              <div>
                <div className="num cd-sec">{String(countdown.seconds).padStart(2, '0')}</div>
                <div className="unit">seg</div>
              </div>
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    </section>;
};
export default Hero;