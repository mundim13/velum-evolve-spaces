import { useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ultrapocket1 from "@/assets/ultrapocket-new-1.png";
import ultrapocket2 from "@/assets/ultrapocket-new-2.png";
import ultrapocket3 from "@/assets/ultrapocket-new-3.png";
import lumEssential1 from "@/assets/lum-essential-new-1.png";
import lumEssential2 from "@/assets/lum-essential-new-2.png";
import lumEssential3 from "@/assets/lum-essential-new-3.png";
import lumEssential4 from "@/assets/lum-essential-new-4.png";
import lumEssential5 from "@/assets/lum-essential-new-5.png";
import lumConfortCover from "@/assets/lum-confort-cover.png";
import lumConfort1 from "@/assets/lum-confort-1.png";
import lumConfort2 from "@/assets/lum-confort-2.png";
import lumConfort3 from "@/assets/lum-confort-3.png";
import lumConfort4 from "@/assets/lum-confort-4.png";
import lumConfort5 from "@/assets/lum-confort-5.png";
import lumFamilyTerreoCover from "@/assets/lum-family-terreo-cover.png";
import lumFamilyTerreo1 from "@/assets/lum-family-terreo-1.png";
import lumFamilyTerreo2 from "@/assets/lum-family-terreo-2.png";
import lumFamilyTerreo3 from "@/assets/lum-family-terreo-3.png";
import lumFamilyTerreo4 from "@/assets/lum-family-terreo-4.png";

interface Product {
  id: string;
  name: string;
  subtitle: string;
  emotionalHeadline: string;
  description: string;
  specs: string[];
  images: string[];
}

const ProductsSection = () => {
  const [activeImageIndex, setActiveImageIndex] = useState<{ [key: string]: number }>({
    ultrapocket: 0,
    lumEssential: 0,
    lumConfort: 0,
    lumFamilyTerreo: 0,
  });

  const products: Product[] = [
    {
      id: "ultrapocket",
      name: "Ultrapocket Gourmet",
      subtitle: "Pré-venda exclusiva",
      emotionalHeadline: "Transforme seu jardim em um refúgio de encontros, sabores e memórias em poucos dias",
      description:
        "Crie um refúgio para encontros, descanso e celebrações. O Ultrapocket Gourmet combina engenharia modular e neuroarquitetura para oferecer conforto, estética e tecnologia em um espaço pronto em poucas semanas.",
      specs: [
        "Toda mobília já inclusa, entregamos no formato 'plug and play'. A instalação é em poucas horas e já fica pronta para uso.",
        "Design guiado por neuroarquitetura para gerar conforto ao extremo.",
        "Não existe obra, nem poeira e nem dor de cabeça.",
        "Materiais de alta durabilidade e acabamento premium.",
      ],
      images: [ultrapocket3, ultrapocket1, ultrapocket2],
    },
    {
      id: "lumEssential",
      name: "Lûm Esencial",
      subtitle: "Pré-venda exclusiva",
      emotionalHeadline: "O essencial para viver com propósito.",
      description:
        "O Lûm Esencial é o ponto de partida da sua jornada Velum. Um espaço compacto, inteligente e automatizado, desenhado para oferecer o máximo de conforto, funcionalidade e design em cada metro quadrado.",
      specs: [
        "Área total de 37,45 m²",
        "Automação residencial integrada",
        "Design minimalista com aproveitamento total de espaço",
        "Estrutura leve e de alta durabilidade",
        "Montagem rápida e limpa, sem obras tradicionais.",
      ],
      images: [lumEssential1, lumEssential2, lumEssential3, lumEssential4, lumEssential5],
    },
    {
      id: "lumConfort",
      name: "Lûm Confort",
      subtitle: "Pré-venda exclusiva",
      emotionalHeadline: "Começos com espaço para crescer.",
      description:
        "Feito para quem está começando uma nova fase, mas já entende o valor de viver bem. Mais espaço para memórias, receber amigos e viver com acolhimento. Perfeito para quem quer começar pequeno, mas sonha grande.",
      specs: [
        "Área total de 74,91 m²",
        "Área total otimizada para conforto e funcionalidade",
        "Espaços integrados que acolhem e conectam",
        "Design inteligente com aproveitamento máximo",
        "Estrutura modular de alta durabilidade",
        "Montagem rápida sem obras tradicionais",
      ],
      images: [lumConfortCover, lumConfort1, lumConfort2, lumConfort3, lumConfort4, lumConfort5],
    },
    {
      id: "lumFamilyTerreo",
      name: "Lûm Family Térreo",
      subtitle: "Pré-venda exclusiva",
      emotionalHeadline: "Construir um lar onde a vida cresce junto.",
      description:
        "Projetado para famílias que estão construindo sua história. O Lûm Family Térreo oferece espaços amplos e integrados, perfeitos para acolher o presente e crescer com o futuro. Um lar que respira junto com sua família.",
      specs: [
        "Área total de 149,82 m²",
        "Área ampla projetada para famílias",
        "Ambientes integrados que conectam todos",
        "Design funcional com foco em convivência",
        "Estrutura modular de alta durabilidade",
        "Montagem rápida sem obras tradicionais",
      ],
      images: [lumFamilyTerreoCover, lumFamilyTerreo1, lumFamilyTerreo2, lumFamilyTerreo3, lumFamilyTerreo4],
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const nextImage = (productId: string, totalImages: number) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [productId]: (prev[productId] + 1) % totalImages,
    }));
  };

  const prevImage = (productId: string, totalImages: number) => {
    setActiveImageIndex((prev) => ({
      ...prev,
      [productId]: prev[productId] === 0 ? totalImages - 1 : prev[productId] - 1,
    }));
  };

  return (
    <section id="produtos-lum" className="scroll-mt-32 py-16 md:py-24 px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Coletânea LÛM: <span className="gradient-text">módulos que evoluem com você</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Ultrapocket Gourmet, Lûm Esencial, Lûm Confort e Lûm Family Térreo já disponíveis!
          </p>
        </div>

        {/* Products */}
        <div className="space-y-24">
          {products.map((product) => (
            <div key={product.id} className="animate-fade-in">
              {/* Badge */}
              <div className="text-center mb-6">
                <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-2">
                  {product.subtitle}
                </Badge>
              </div>

              {/* Product Name */}
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-4">
                {product.name}
              </h3>

              {/* Emotional Headline */}
              <p className="text-xl md:text-2xl text-center italic text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
                "{product.emotionalHeadline}"
              </p>

              {/* Image Slider */}
              <div className="relative mb-8 group">
                <div className="aspect-video bg-secondary/50 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={product.images[activeImageIndex[product.id]]}
                    alt={`${product.name} - Imagem ${activeImageIndex[product.id] + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-500"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                  />
                </div>
                
                {/* Slider Controls */}
                <button
                  onClick={() => prevImage(product.id, product.images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => nextImage(product.id, product.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Slider Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setActiveImageIndex((prev) => ({ ...prev, [product.id]: index }))
                      }
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === activeImageIndex[product.id]
                          ? "bg-white w-8"
                          : "bg-white/50"
                      }`}
                      aria-label={`Ir para imagem ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                {product.description}
              </p>

              {/* Technical Specifications */}
              <Card className="shadow-elevated mb-8 max-w-4xl mx-auto border-velum-apure/20">
                <CardContent className="p-8">
                  <h4 className="text-2xl font-bold mb-6">Especificações Técnicas</h4>
                  <div className="space-y-4">
                    {product.specs.map((spec, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" style={{ color: "#5CC6D0" }} />
                        <p className="text-foreground leading-relaxed">{spec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  data-whatsapp="true"
                  data-msg={`Olá! Quero personalização do ${product.name}.`}
                  className="btn-hero-primary w-full sm:w-auto h-12 px-8"
                >
                  Quero personalização
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("colecao-lum")}
                  className="w-full sm:w-auto h-12 px-8 border-velum-apure/30 hover:bg-velum-apure/10"
                  style={{ color: "#5CC6D0" }}
                >
                  Ver próximos lançamentos
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
