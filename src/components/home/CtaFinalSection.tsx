import { Link } from "react-router-dom";

export default function CtaFinalSection() {
  return (
    <section
      style={{
        background: "#0D0D0D",
        padding: "80px 0",
        borderTop: "1px solid rgba(34,211,238,0.08)",
        backgroundImage:
          "linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
          <span className="font-dm uppercase" style={{ fontSize: 9, letterSpacing: 2.5, color: "#22D3EE" }}>
            Comece agora
          </span>
          <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
        </div>

        {/* Headline */}
        <h2 className="font-syncopate font-bold uppercase mb-4" style={{ fontSize: 28, lineHeight: 1.1, color: "#F9FAFB" }}>
          PROJETO, GESTÃO E OBRA{" "}
          <span style={{ color: "#22D3EE" }}>EM UM ÚNICO LUGAR</span>
        </h2>

        {/* Subtitle */}
        <p className="font-dm mb-10" style={{ fontSize: 15, color: "rgba(249,250,251,0.45)", lineHeight: 1.7 }}>
          Prazo garantido e preço fechado de verdade.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/lum"
            className="inline-flex items-center justify-center font-dm font-medium transition-all duration-200 hover:brightness-110"
            style={{
              padding: "14px 28px",
              borderRadius: 6,
              fontSize: 13,
              background: "#22D3EE",
              color: "#050505",
              width: "100%",
              maxWidth: 280,
            }}
          >
            Conhecer os módulos LÛM
          </Link>
          <a
            href="https://wa.me/5562999447553?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Velum%20e%20gostaria%20de%20falar%20com%20um%20especialista."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-dm font-medium transition-all duration-200"
            style={{
              padding: "14px 28px",
              borderRadius: 6,
              fontSize: 13,
              background: "transparent",
              color: "#F9FAFB",
              border: "1px solid rgba(249,250,251,0.2)",
              width: "100%",
              maxWidth: 280,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(249,250,251,0.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            Falar com um especialista →
          </a>
        </div>
      </div>
    </section>
  );
}
