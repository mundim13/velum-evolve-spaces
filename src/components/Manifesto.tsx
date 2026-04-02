import { useState } from "react";
import { Brain, Clock, Shield, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Manifesto = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const pillars = [{
    icon: Brain,
    title: "Inteligência Multiconstrutiva",
    subtitle: "Escolhemos a melhor metodologia para cada projeto, combinando diferentes sistemas construtivos com nosso hibridismo inteligente."
  }, {
    icon: Clock,
    title: "Tempo e Eficiência",
    subtitle: "Entregamos em semanas, não meses. Menos atraso, mais previsibilidade e sem dor de cabeça."
  }, {
    icon: Shield,
    title: "Durabilidade e Facilidade",
    subtitle: "Materiais de alto desempenho e montagem precisa, com mínima manutenção e máxima longevidade."
  }, {
    icon: Heart,
    title: "Bem-estar Contínuo",
    subtitle: "Ambientes que cuidam de você: neuroarquitetura, conforto térmico e equilíbrio natural todos os dias."
  }];
  const nextSlide = () => {
    setActiveIndex(prev => (prev + 1) % pillars.length);
  };
  const prevSlide = () => {
    setActiveIndex(prev => (prev - 1 + pillars.length) % pillars.length);
  };
  return <>
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="velumIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#02FFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#5CC6D0" stopOpacity="0.95" />
        </linearGradient>
      </defs>
    </svg>
    
    <section id="manifesto" className="section-unified scroll-mt-32 py-16 md:py-24 px-4 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="unified-title text-3xl md:text-4xl font-bold text-foreground">
            Uma experiência sem trauma, sem obra e com resultado previsível.
          </h2>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden mb-12">
          <Card className="unified-card">
            <CardContent className="p-0">
              <div className="unified-icon">
                {(() => {
                  const IconComponent = pillars[activeIndex].icon;
                  return <IconComponent strokeWidth={2} />;
                })()}
              </div>
              <h3 className="text-xl font-bold mb-3">
                {pillars[activeIndex].title}
              </h3>
              <p className="unified-subtitle mb-3">
                {pillars[activeIndex].subtitle}
              </p>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="unified-dots">
              {pillars.map((_, index) => <button key={index} onClick={() => setActiveIndex(index)} aria-current={index === activeIndex ? "true" : "false"} aria-label={`Go to slide ${index + 1}`} />)}
            </div>

            <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Desktop Grid - 4 columns */}
        <div className="hidden md:grid md:grid-cols-4 gap-7 mb-16">
          {pillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            return <Card key={index} className="unified-card group hover:shadow-elevated transition-all duration-300">
                <CardContent className="p-0">
                  <div className="unified-icon">
                    <IconComponent strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{pillar.title}</h3>
                  <p className="unified-subtitle">{pillar.subtitle}</p>
                </CardContent>
              </Card>;
          })}
        </div>

        {/* Rodapé da seção */}
        <div className="mt-12 text-center">
          <p className="text-base text-muted-foreground max-w-4xl mx-auto">
            Cada projeto Velum nasce da união entre engenharia inteligente, design emocional e ciência do bem-estar.
          </p>
        </div>
      </div>
    </section>
  </>;
};
export default Manifesto;