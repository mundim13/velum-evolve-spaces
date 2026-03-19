import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import portfolioResidencial1a from "@/assets/portfolio-residencial-1a.png";
import portfolioResidencial1b from "@/assets/portfolio-residencial-1b.png";
import portfolioResidencial1c from "@/assets/portfolio-residencial-1c.png";
import portfolioResidencial2a from "@/assets/portfolio-residencial-2a.png";
import portfolioComercial1a from "@/assets/portfolio-comercial-1a.jpeg";
import portfolioTerrasAlpha1 from "@/assets/portfolio-terras-alpha-1.jpg";
import portfolioTerrasAlpha2 from "@/assets/portfolio-terras-alpha-2.jpg";
import portfolioTerrasAlpha3 from "@/assets/portfolio-terras-alpha-3.jpg";
import portfolioTerrasAlpha4 from "@/assets/portfolio-terras-alpha-4.jpg";
import portfolioTerrasAlpha5 from "@/assets/portfolio-terras-alpha-5.jpg";
import portfolioJardinsPorto1 from "@/assets/portfolio-jardins-porto-1.jpg";
import portfolioJardinsPorto2 from "@/assets/portfolio-jardins-porto-2.jpg";
import portfolioJardinsPorto3 from "@/assets/portfolio-jardins-porto-3.jpg";
import portfolioJardinsFgr1 from "@/assets/portfolio-jardins-fgr-1.jpg";

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
    location: "Condomínio Jardins Porto, Senador Canedo - GO",
    area: "235 m²",
    methodology: "100% Light Steel Frame",
    status: "Em execução",
    images: [portfolioResidencial2a],
  },
  {
    id: 3,
    name: "Residência Moderna",
    location: "Condomínio Aldeia do Parque, Aparecida de Goiânia - GO",
    area: "232 m²",
    methodology: "100% Light Steel Frame",
    status: "Em execução",
    images: [portfolioComercial1a],
    imagePosition: "object-[center_35%]",
  },
  {
    id: 4,
    name: "Residência Terras Alpha",
    location: "Condomínio Terras Alpha 2, Senador Canedo - GO",
    area: "220 m²",
    methodology: "100% Light Steel Frame",
    status: "Entregue",
    images: [portfolioTerrasAlpha1, portfolioTerrasAlpha2, portfolioTerrasAlpha3, portfolioTerrasAlpha4, portfolioTerrasAlpha5],
  },
  {
    id: 5,
    name: "Residência Jardins Porto",
    location: "Condomínio Jardins Porto, Senador Canedo - GO",
    area: "245 m²",
    methodology: "100% Light Steel Frame",
    status: "Entregue",
    images: [portfolioJardinsPorto1, portfolioJardinsPorto2, portfolioJardinsPorto3],
  },
  {
    id: 6,
    name: "Viabilidade FGR",
    location: "Condomínio Jardins FGR, Goiânia - GO",
    area: "-",
    methodology: "Bloco de Concreto + Light Steel Frame",
    status: "Entregue",
    images: [portfolioJardinsFgr1],
  },
];

export default function Portfolio() {
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
    <div className="min-h-screen font-dm" style={{ background: "#0D0D0D", color: "#F9FAFB" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 48, background: "#0D0D0D" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
            <span className="font-syncopate font-bold uppercase" style={{ fontSize: 10, letterSpacing: 2, color: "#22D3EE" }}>
              PORTFÓLIO
            </span>
          </div>
          <h1 className="font-syncopate font-bold uppercase mb-4" style={{ fontSize: 48, lineHeight: 0.95, color: "#F9FAFB" }}>
            NOSSAS OBRAS
          </h1>
          <p className="font-dm max-w-xl" style={{ fontSize: 14, color: "rgba(249,250,251,0.45)", lineHeight: 1.7 }}>
            Conheça os projetos e obras que já realizamos. Cada projeto é único e reflete nosso compromisso com qualidade, inovação e entrega no prazo.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ background: "#0D0D0D", padding: "0 0 64px" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => {
              const currentIndex = activeImageIndex[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="group overflow-hidden"
                  style={{ borderRadius: 10, border: "1px solid rgba(34,211,238,0.13)", background: "#0A0A0A" }}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.images[currentIndex]}
                      alt={item.name}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${item.imagePosition || ""}`}
                    />

                    {/* Badge */}
                    <div
                      className="absolute top-3 left-3 font-syncopate font-bold uppercase"
                      style={{
                        fontSize: 9,
                        padding: "5px 10px",
                        borderRadius: 4,
                        background: "#22D3EE",
                        color: "#050505",
                      }}
                    >
                      {item.status}
                    </div>

                    {/* Nav arrows */}
                    {item.images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(item.id, item.images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: "rgba(13,13,13,0.8)" }}
                          aria-label="Imagem anterior"
                        >
                          <ChevronLeft size={16} style={{ color: "#F9FAFB" }} />
                        </button>
                        <button
                          onClick={() => nextImage(item.id, item.images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: "rgba(13,13,13,0.8)" }}
                          aria-label="Próxima imagem"
                        >
                          <ChevronRight size={16} style={{ color: "#F9FAFB" }} />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {item.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveImageIndex((prev) => ({ ...prev, [item.id]: idx }))}
                              style={{
                                width: idx === currentIndex ? 16 : 6,
                                height: 6,
                                borderRadius: 3,
                                background: idx === currentIndex ? "#22D3EE" : "rgba(249,250,251,0.4)",
                                transition: "all 200ms",
                              }}
                              aria-label={`Ir para imagem ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "16px 18px" }}>
                    <h3 className="font-syncopate font-bold uppercase mb-3" style={{ fontSize: 14, color: "#F9FAFB" }}>
                      {item.name}
                    </h3>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#22D3EE", flexShrink: 0 }} />
                        <span className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.45)" }}>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#22D3EE", flexShrink: 0 }} />
                        <span className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.45)" }}>{item.area}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#22D3EE", flexShrink: 0 }} />
                        <span className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.45)" }}>{item.methodology}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
