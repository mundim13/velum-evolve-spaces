import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Building2 } from "lucide-react";

const Portfolio = () => {
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

          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Building2 className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Em breve
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              Estamos preparando uma seleção especial dos nossos melhores projetos e obras realizadas. Fique atento!
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Portfolio;
