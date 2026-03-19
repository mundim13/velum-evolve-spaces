import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";

/* ── Placeholder section ── */
function PlaceholderSection({ title }: { title: string }) {
  return (
    <section style={{ background: "#0B1E1B", padding: "80px 24px" }}>
      <div className="max-w-7xl mx-auto text-center">
        <h2
          className="font-syne font-extrabold uppercase mb-4"
          style={{ fontSize: "clamp(22px, 3vw, 32px)", color: "#00D4B4", letterSpacing: "-0.5px" }}
        >
          {title}
        </h2>
        <p className="font-dm" style={{ fontSize: 14, color: "rgba(237,245,243,0.35)" }}>
          Em construção — sprint 2
        </p>
      </div>
    </section>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen font-dm" style={{ background: "#0E2420", color: "#EDF5F3" }}>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <PlaceholderSection title="PROJETO · GESTÃO · EXECUÇÃO" />
        <PlaceholderSection title="COLETÂNEA LÛM" />
        <PlaceholderSection title="PORTFÓLIO" />
      </main>
      <Footer />
    </div>
  );
}
