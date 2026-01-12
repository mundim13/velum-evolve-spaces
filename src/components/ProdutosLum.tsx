import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import lumEssential1 from "@/assets/lum-essential-new-1.png";
import lumEssential2 from "@/assets/lum-essential-new-2.png";
import lumConfortCover from "@/assets/lum-confort-cover.png";
import lumConfort1 from "@/assets/lum-confort-1.png";
import lumFamilyTerreoCover from "@/assets/lum-family-terreo-cover.png";
import lumFamilyTerreo1 from "@/assets/lum-family-terreo-1.png";
import ultrapocket1 from "@/assets/ultrapocket-new-1.png";
import ultrapocket2 from "@/assets/ultrapocket-new-2.png";
import lumZenCover from "@/assets/lum-zen-cover.png";
import lumZen1 from "@/assets/lum-zen-1.png";
import lumZen2 from "@/assets/lum-zen-2.png";
import lumZen3 from "@/assets/lum-zen-3.png";

interface Product {
  id: string;
  name: string;
  tagline: string;
  features: string[];
  images: string[];
  ctaText: string;
  ctaMsg: string;
}

const ProdutosLum = () => {
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: string]: number }>({});

  const products: Product[] = [
    {
      id: "lum-essencial",
      name: "LÛM ESSENCIAL",
      tagline: "O essencial para viver com propósito.",
      features: ["Design minimalista", "Montagem rápida"],
      images: [lumEssential1, lumEssential2],
      ctaText: "Quero conhecer",
      ctaMsg: "Olá! Quero conhecer o LÛM Essencial.",
    },
    {
      id: "lum-confort",
      name: "LÛM CONFORT",
      tagline: "Começar com espaço para crescer.",
      features: ["Espaços integrados", "Acabamentos premium"],
      images: [lumConfortCover, lumConfort1],
      ctaText: "Ver detalhes",
      ctaMsg: "Olá! Quero saber mais sobre o LÛM Confort.",
    },
    {
      id: "lum-family",
      name: "LÛM FAMILY",
      tagline: "Construir um lar onde a vida cresce junto.",
      features: ["Área ampla", "Modularidade expansível"],
      images: [lumFamilyTerreoCover, lumFamilyTerreo1],
      ctaText: "Explorar módulo",
      ctaMsg: "Olá! Quero explorar o LÛM Family.",
    },
    {
      id: "lum-zen",
      name: "LÛM ZEN",
      tagline: "Bem-estar e reconexão com o que importa.",
      features: ["Sauna e academia", "Integração com a natureza"],
      images: [lumZenCover, lumZen1, lumZen2, lumZen3],
      ctaText: "Conhecer o Zen",
      ctaMsg: "Olá! Quero conhecer o LÛM Zen.",
    },
    {
      id: "ultrapocket",
      name: "ULTRAPOCKET GOURMET",
      tagline: "Seu jardim em um refúgio de encontros.",
      features: ["Espaço gourmet completo", "Plug and play"],
      images: [ultrapocket1, ultrapocket2],
      ctaText: "Conhecer o Ultrapocket",
      ctaMsg: "Olá! Quero conhecer o Ultrapocket Gourmet.",
    },
  ];

  const nextImage = (productId: string, totalImages: number) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages,
    }));
  };

  const prevImage = (productId: string, totalImages: number) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) === 0 ? totalImages - 1 : (prev[productId] || 0) - 1,
    }));
  };

  return (
    <section id="produtos-lum" className="py-16 md:py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {products.map((product) => {
            const currentIndex = activeImageIndex[product.id] || 0;

            return (
              <div key={product.id} className="velum-card overflow-hidden p-0">
                {/* Image Slider */}
                <div className="relative aspect-[4/3] bg-background group">
                  <img
                    src={product.images[currentIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => prevImage(product.id, product.images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Imagem anterior"
                      >
                        <ChevronLeft className="w-5 h-5 text-foreground" />
                      </button>
                      <button
                        onClick={() => nextImage(product.id, product.images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Próxima imagem"
                      >
                        <ChevronRight className="w-5 h-5 text-foreground" />
                      </button>

                      {/* Dots */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {product.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex((prev) => ({ ...prev, [product.id]: idx }))}
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

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-syncopate text-xs sm:text-sm font-bold text-foreground mb-1">
                    {product.name}
                  </h3>
                  <p className="font-montserrat text-xs text-muted-foreground italic mb-3 line-clamp-2">
                    "{product.tagline}"
                  </p>

                  <ul className="space-y-0.5 mb-4 hidden sm:block">
                    {product.features.map((feature) => (
                      <li key={feature} className="font-montserrat text-xs text-muted-foreground flex items-center gap-1">
                        <span className="text-primary">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    data-whatsapp="true"
                    data-msg={product.ctaMsg}
                    className="btn-velum-primary w-full text-center text-xs py-2"
                  >
                    {product.ctaText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProdutosLum;