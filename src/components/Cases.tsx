import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Cases = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const cases = [
    {
      type: "Residencial",
      title: "Família Silva",
      quote:
        "Cada expansão foi previsível, sem desperdício e sem trauma. A vida evoluiu com a VELUM.",
      client: "Marina Silva",
      role: "Designer de Interiores",
      image: "residencial",
    },
    {
      type: "Comercial",
      title: "Café Horizonte",
      quote:
        "O espaço cresceu junto com nosso negócio. Foi natural, rápido e sem interromper o atendimento.",
      client: "Carlos Mendes",
      role: "Proprietário",
      image: "comercial",
    },
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % cases.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + cases.length) % cases.length);
  };

  return (
    <section id="casos" className="scroll-mt-28 py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Casos de <span className="gradient-text">Sucesso</span>
        </h2>

        <div className="relative">
          <Card className="shadow-elevated overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="h-64 md:h-auto bg-gradient-to-br from-primary/20 to-primary-variant/20 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">Imagem {cases[activeIndex].type}</p>
                  <p className="text-xs mt-2">{cases[activeIndex].image}</p>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="text-sm font-semibold text-primary-variant uppercase tracking-wide">
                    {cases[activeIndex].type}
                  </span>
                </div>

                <Quote className="h-10 w-10 text-accent/20 mb-4" />

                <blockquote className="text-lg md:text-xl text-foreground mb-6 leading-relaxed">
                  "{cases[activeIndex].quote}"
                </blockquote>

                <div>
                  <p className="font-semibold text-foreground">
                    {cases[activeIndex].client}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {cases[activeIndex].role}
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {cases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-8 bg-primary-variant"
                      : "w-2 bg-muted"
                  }`}
                  aria-label={`Go to case ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cases;
