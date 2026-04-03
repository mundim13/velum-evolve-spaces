import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import ModeloIntegradoSection from "@/components/home/ModeloIntegradoSection";
import NumerosSection from "@/components/home/NumerosSection";
import LumHomeSection from "@/components/home/LumHomeSection";
import PortfolioHomeSection from "@/components/home/PortfolioHomeSection";
import FaqSection from "@/components/home/FaqSection";
import CtaFinalSection from "@/components/home/CtaFinalSection";
import Footer from "@/components/layout/Footer";
import SeoHead, { organizationSchema, localBusinessSchema } from "@/components/SeoHead";

export default function Index() {
  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      <SeoHead
        title="Arquitetura e Construção Industrializada"
        description="Construa com prazo garantido e preço fechado. Projeto, gestão e obra integrados em Light Steel Frame. Goiânia, GO e DF."
        path="/"
        schema={[organizationSchema, localBusinessSchema]}
      />
      <Navbar />
      <main id="main">
      <HeroSection />
      <ModeloIntegradoSection />
      <NumerosSection />
      <LumHomeSection />
      <PortfolioHomeSection />
      <FaqSection />
      <CtaFinalSection />
      </main>
      <Footer />
    </div>
  );
}
