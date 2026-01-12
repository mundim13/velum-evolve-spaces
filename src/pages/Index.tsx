import { useEffect } from "react";
import HeaderNew from "@/components/HeaderNew";
import HeroSection from "@/components/HeroSection";
import QuemSomos from "@/components/QuemSomos";
import SolucoesSection from "@/components/SolucoesSection";
import DiferenciaisSection from "@/components/DiferenciaisSection";
import GestaoInteligente from "@/components/GestaoInteligente";
import JornadaVelum from "@/components/JornadaVelum";
import ColetaneaLumIntro from "@/components/ColetaneaLumIntro";
import ProdutosLum from "@/components/ProdutosLum";
import ProjetosPersonalizados from "@/components/ProjetosPersonalizados";
import PortfolioSection from "@/components/PortfolioSection";
import EquipeSection from "@/components/EquipeSection";
import CalculadoraTeaser from "@/components/CalculadoraTeaser";
import CTAFinal from "@/components/CTAFinal";
import FooterSection from "@/components/FooterSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import "@/lib/whatsapp";

const Index = () => {
  useEffect(() => {
    const handleWhatsAppClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target?.closest?.("[data-whatsapp='true']") as HTMLElement | null;
      if (!el) return;
      e.preventDefault();

      const msg =
        el.getAttribute("data-msg") ||
        "Olá! Vim pelo site da Velum e gostaria de um orçamento.";

      (window as any).openWhatsApp?.(msg);
    };

    document.addEventListener("click", handleWhatsAppClick);
    return () => document.removeEventListener("click", handleWhatsAppClick);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeaderNew />
      <main>
        <HeroSection />
        <QuemSomos />
        <SolucoesSection />
        <DiferenciaisSection />
        <GestaoInteligente />
        <JornadaVelum />
        <ColetaneaLumIntro />
        <ProdutosLum />
        <ProjetosPersonalizados />
        <PortfolioSection />
        <EquipeSection />
        <CalculadoraTeaser />
        <CTAFinal />
      </main>
      <FooterSection />
      <WhatsAppButton />
    </div>
  );
};

export default Index;