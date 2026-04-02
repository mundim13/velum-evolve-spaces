import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import ModeloIntegradoSection from "@/components/home/ModeloIntegradoSection";
import LumHomeSection from "@/components/home/LumHomeSection";
import PortfolioHomeSection from "@/components/home/PortfolioHomeSection";
import CtaFinalSection from "@/components/home/CtaFinalSection";
import Footer from "@/components/layout/Footer";

export default function Index() {
  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      <Navbar />
      <HeroSection />
      <ModeloIntegradoSection />
      <LumHomeSection />
      <PortfolioHomeSection />
      <CtaFinalSection />
      <Footer />
    </div>
  );
}
