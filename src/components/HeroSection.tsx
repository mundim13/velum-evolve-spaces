import logoVelum from "@/assets/logo-velum-white.svg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-background diagonal-texture overflow-hidden">
      {/* Decorative architectural wireframe */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-20 pointer-events-none hidden lg:block">
        <svg viewBox="0 0 400 400" className="w-full h-full animate-float" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5">
          {/* Architectural wireframe lines */}
          <line x1="50" y1="100" x2="350" y2="100" />
          <line x1="50" y1="150" x2="350" y2="150" />
          <line x1="50" y1="200" x2="350" y2="200" />
          <line x1="100" y1="50" x2="100" y2="350" />
          <line x1="200" y1="50" x2="200" y2="350" />
          <line x1="300" y1="50" x2="300" y2="350" />
          <polygon points="200,80 280,140 280,260 200,320 120,260 120,140" strokeWidth="1" />
          <circle cx="200" cy="200" r="80" strokeWidth="1" />
          <rect x="140" y="140" width="120" height="120" strokeWidth="1" />
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          {/* Title */}
          <h1 className="font-syncopate text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 tracking-wider">
            OBRA INTELIGENTE PARA UMA VIDA MAIS LEVE
          </h1>

          {/* Subtitle */}
          <p className="font-montserrat text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mb-10 leading-relaxed">
            Criamos espaços com precisão e design, unindo engenharia, arquitetura e tecnologia para transformar sua forma de viver, com leveza e previsibilidade.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#coletanea-lum"
              className="btn-velum-primary text-center"
            >
              Conhecer a Coletânea LÛM
            </a>
            <button
              data-whatsapp="true"
              data-msg="Olá! Vim pelo site da Velum e gostaria de falar com um especialista."
              className="btn-velum-outline text-center"
            >
              Falar com um especialista
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;