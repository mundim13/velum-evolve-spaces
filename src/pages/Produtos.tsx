import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Produtos = () => {
  const products = [
    {
      id: 1,
      name: "UltraPocket Gourmet",
      subtitle: "Transforme seu jardim em uma área de eternas memórias em poucos dias.",
      description:
        "Crie um refúgio para encontros, descanso e celebrações. O Ultrapocket Gourmet combina engenharia modular e neuroarquitetura para oferecer conforto, estética e tecnologia em um espaço pronto em poucas semanas.",
      available: true,
    },
    {
      id: 2,
      name: "Lûm Esencial",
      subtitle: "O essencial para uma vida com propósito.",
      description:
        "Mais do que um módulo, o Lûm Esencial é o ponto de partida para quem busca viver com o necessário — e nada além do necessário. Conforto, tecnologia e design em harmonia: tempo, equilíbrio e propósito.",
      available: true,
    },
    {
      id: 3,
      name: "Lûm Confort",
      subtitle: "Começos com espaço para crescer.",
      description:
        "Feito para quem está começando uma nova fase — mas já entende o valor de viver bem. Mais espaço para memórias, receber amigos e viver com acolhimento. Perfeito para quem quer começar pequeno, mas sonha grande.",
      available: true,
    },
    {
      id: 4,
      name: "Lûm Family",
      subtitle: "Espaço para crescer em família.",
      description:
        "Criado para abrigar histórias em crescimento. Mais espaço, conforto e integração — com eficiência e design inteligente. Ambientes que acolhem, conectam e evoluem com quem você ama.",
      available: true,
    },
    {
      id: 5,
      name: "Lûm Zen",
      subtitle: "Bem-estar e reconexão.",
      description: "Espaços pensados para desacelerar, respirar e se reconectar com o que realmente importa. Sauna, academia e ambientes de relaxamento integrados à natureza.",
      available: true,
    },
    {
      id: 6,
      name: "Lûm Kids",
      subtitle: "Ambientes educativos e seguros.",
      description: "Desenvolvidos para estimular criatividade, aprendizado e segurança em cada detalhe.",
      available: false,
    },
    {
      id: 7,
      name: "Lûm Payback",
      subtitle: "Módulos que se pagam.",
      description: "Soluções comerciais inteligentes com foco em ROI e sustentabilidade financeira.",
      available: false,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 break-words">
            Coletânea <span className="gradient-text">LÛM</span>
          </h1>

          <p className="text-lg md:text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            A cada 15 dias, um novo módulo se une à nossa coleção híbrida. Juntos, eles formam a LÛM — um ecossistema vivo de arquitetura modular, onde cada lançamento se conecta ao anterior para dar forma a uma solução única, inteligente e nunca antes vista.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`relative shadow-card hover:shadow-elevated transition-all duration-300 ${
                  product.available 
                    ? "border-2 border-accent shadow-[0_0_20px_rgba(255,140,66,0.15)] hover:shadow-[0_0_30px_rgba(255,140,66,0.25)]" 
                    : "border"
                }`}
              >
                {product.available && (
                  <Badge 
                    className="absolute top-4 right-4 bg-accent/10 text-accent border-accent/20"
                    aria-label="Disponível"
                  >
                    Disponível
                  </Badge>
                )}
                <CardContent className="p-6 pt-8">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {product.name}
                  </h3>

                  {product.subtitle && (
                    <p className="text-sm text-muted-foreground font-medium mb-3">
                      {product.subtitle}
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground/90 leading-relaxed mb-4">
                    {product.description}
                  </p>

                  {product.available && (
                    <a
                      href="https://wa.me/5562999447553"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                    >
                      Solicitar orçamento
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Produtos;
