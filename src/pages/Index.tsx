import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import ServicosSection from "@/components/home/ServicosSection";
import PortfolioPreview from "@/components/home/PortfolioPreview";
import LumPreview from "@/components/home/LumPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-velum-bg font-dm text-velum-text">
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <ServicosSection />
        <PortfolioPreview />
        <LumPreview />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
