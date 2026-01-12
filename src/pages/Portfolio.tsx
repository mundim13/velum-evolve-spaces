import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Ruler, Wrench } from "lucide-react";

import portfolioResidencial1a from "@/assets/portfolio-residencial-1a.png";
import portfolioResidencial1b from "@/assets/portfolio-residencial-1b.png";
import portfolioResidencial1c from "@/assets/portfolio-residencial-1c.png";
import portfolioResidencial2a from "@/assets/portfolio-residencial-2a.png";
import portfolioComercial1a from "@/assets/portfolio-comercial-1a.jpeg";

const portfolioItems = [
  {
    id: 1,
    name: "Residência Alto Padrão",
    location: "Condomínio Portal do Sol Green, Goiânia - GO",
    area: "650 m²",
    methodology: "Concreto + Steel + Alvenaria",
    status: "Em execução",
    images: [portfolioResidencial1c, portfolioResidencial1a, portfolioResidencial1b],
  },
  {
    id: 2,
    name: "Casa Contemporânea",
    location: "Alphaville Flamboyant, Goiânia - GO",
    area: "220 m²",
    methodology: "Steel Frame",
    status: "Em execução",
    images: [portfolioResidencial2a],
  },
  {
    id: 3,
    name: "Residência Moderna",
    location: "Jardins Valência, Goiânia - GO",
    area: "250 m²",
    methodology: "Steel Frame + Fachada Ventilada",
    status: "Em execução",
    images: [portfolioComercial1a],
    imagePosition: "object-[center_35%]",
  },
];

const Portfolio = () => {
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: number]: number }>({});

  const nextImage = (itemId: number, totalImages: number) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % totalImages,
    }));
  };

  const prevImage = (itemId: number, totalImages: number) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) === 0 ? totalImages - 1 : (prev[itemId] || 0) - 1,
    }));
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 break-words">
            Nosso <span className="gradient-text">Portfólio</span>
          </h1>

          <p className="text-lg md:text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed px-4">
            Conheça os projetos e obras que já realizamos. Cada projeto é único e reflete nosso compromisso com qualidade, inovação e entrega no prazo.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item) => {
              const currentIndex = activeImageIndex[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className="velum-card overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.images[currentIndex]}
                      alt={item.name}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${item.imagePosition || ''}`}
                    />

                    {/* Status badge */}
                    {item.status && (
                      <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-syncopate font-bold px-3 py-1.5 rounded">
                        {item.status}
                      </div>
                    )}

                    {/* Navigation arrows */}
                    {item.images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(item.id, item.images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Imagem anterior"
                        >
                          <ChevronLeft className="w-5 h-5 text-foreground" />
                        </button>
                        <button
                          onClick={() => nextImage(item.id, item.images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Próxima imagem"
                        >
                          <ChevronRight className="w-5 h-5 text-foreground" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {item.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveImageIndex((prev) => ({ ...prev, [item.id]: idx }))}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentIndex ? "bg-primary w-4" : "bg-foreground/50"
                              }`}
                              aria-label={`Ir para imagem ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-syncopate text-lg font-bold text-foreground">
                      {item.name}
                    </h3>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{item.area}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{item.methodology}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Portfolio;
