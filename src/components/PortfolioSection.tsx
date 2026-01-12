import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import portfolioResidencial1a from "@/assets/portfolio-residencial-1a.png";
import portfolioResidencial1b from "@/assets/portfolio-residencial-1b.png";
import portfolioResidencial1c from "@/assets/portfolio-residencial-1c.png";

const PortfolioSection = () => {
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: number]: number }>({});

  const portfolioItems = [
    { 
      id: 1, 
      title: "Projeto Residencial 1", 
      status: "Em execução",
      images: [portfolioResidencial1a, portfolioResidencial1b, portfolioResidencial1c]
    },
    { id: 2, title: "Projeto Residencial 2", status: null, images: [] },
    { id: 3, title: "Projeto Comercial 1", status: null, images: [] },
    { id: 4, title: "Projeto Modular 1", status: null, images: [] },
    { id: 5, title: "Projeto Modular 2", status: null, images: [] },
    { id: 6, title: "Projeto Gourmet 1", status: null, images: [] },
  ];

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
    <section id="portfolio" className="py-20 md:py-28 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-4 tracking-wider">
          NOSSO PORTFÓLIO
        </h2>

        <p className="font-montserrat text-lg text-muted-foreground text-center mb-12">
          Conheça alguns dos projetos e obras que já realizamos.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {portfolioItems.map((item) => {
            const currentIndex = activeImageIndex[item.id] || 0;
            const hasImages = item.images && item.images.length > 0;

            return (
              <div
                key={item.id}
                className="velum-card aspect-video flex items-center justify-center overflow-hidden relative group"
              >
                {hasImages ? (
                  <>
                    <img
                      src={item.images[currentIndex]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status badge */}
                    {item.status && (
                      <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] font-syncopate font-bold px-2 py-1 rounded">
                        {item.status}
                      </div>
                    )}

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                      <span className="font-montserrat text-foreground text-sm font-medium">
                        {item.title}
                      </span>
                    </div>

                    {/* Navigation arrows */}
                    {item.images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(item.id, item.images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Imagem anterior"
                        >
                          <ChevronLeft className="w-4 h-4 text-foreground" />
                        </button>
                        <button
                          onClick={() => nextImage(item.id, item.images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Próxima imagem"
                        >
                          <ChevronRight className="w-4 h-4 text-foreground" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1">
                          {item.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveImageIndex((prev) => ({ ...prev, [item.id]: idx }))}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                idx === currentIndex ? "bg-primary w-3" : "bg-foreground/50"
                              }`}
                              aria-label={`Ir para imagem ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <span className="font-montserrat text-muted-foreground text-sm">
                    {item.title}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/portfolio"
            className="btn-velum-outline inline-block"
          >
            Ver portfólio completo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;