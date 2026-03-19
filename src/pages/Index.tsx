import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import Footer from "@/components/layout/Footer";

export default function Index() {
  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Placeholder — Modelo integrado */}
      <section className="bg-[#0A0A0A] py-20 text-center border-t border-[rgba(34,211,238,0.08)]">
        <h2 className="font-syncopate font-bold text-[#22D3EE] text-2xl uppercase tracking-widest mb-3">
          NOSSO MODELO INTEGRADO
        </h2>
        <p className="font-dm text-[rgba(249,250,251,0.3)] text-sm">Em construção — sprint 2</p>
      </section>

      {/* Placeholder — LÛM */}
      <section className="bg-[#0D0D0D] py-20 text-center border-t border-[rgba(34,211,238,0.08)]">
        <h2 className="font-syncopate font-bold text-[#22D3EE] text-2xl uppercase tracking-widest mb-3">
          COLETÂNEA LÛM
        </h2>
        <p className="font-dm text-[rgba(249,250,251,0.3)] text-sm">Em construção — sprint 2</p>
      </section>

      {/* Placeholder — Portfólio */}
      <section className="bg-[#0A0A0A] py-20 text-center border-t border-[rgba(34,211,238,0.08)]">
        <h2 className="font-syncopate font-bold text-[#22D3EE] text-2xl uppercase tracking-widest mb-3">
          PORTFÓLIO
        </h2>
        <p className="font-dm text-[rgba(249,250,251,0.3)] text-sm">Em construção — sprint 2</p>
      </section>

      <Footer />
    </div>
  );
}
