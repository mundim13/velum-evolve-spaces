import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import ProductsSection from "@/components/ProductsSection";
import ColecaoLum from "@/components/ColecaoLum";
import Timeline from "@/components/Timeline";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 md:pt-28 lg:pt-32">
        <Hero />
        <Manifesto />
        <ProductsSection />
        <ColecaoLum />
        <Timeline />
        <TeamSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
