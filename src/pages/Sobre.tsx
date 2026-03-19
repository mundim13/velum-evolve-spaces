import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Sobre() {
  return (
    <div className="min-h-screen bg-velum-bg font-dm text-velum-text">
      <Navbar />
      <main className="pt-16">
        <section className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center px-6">
            <p className="font-dm text-velum-accent text-sm tracking-widest uppercase mb-4">
              Quem somos
            </p>
            <h1 className="font-syne font-extrabold text-4xl md:text-6xl mb-4">
              Sobre a VELUM
            </h1>
            <p className="font-dm text-velum-muted max-w-md mx-auto">
              Engenharia, arquitetura e tecnologia — uma construtora de Goiânia que faz diferente.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
