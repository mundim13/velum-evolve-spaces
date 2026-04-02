import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const escopoCards = [
  {
    number: "01",
    title: "VALIDAÇÃO",
    desc: "Análise técnica do projeto, identificação de incompatibilidades e diagnóstico de viabilidade construtiva.",
    items: ["Compatibilização de projetos", "Análise de viabilidade", "Diagnóstico técnico em 48h"],
  },
  {
    number: "02",
    title: "PLANEJAMENTO",
    desc: "Orçamento fechado, cronograma detalhado e plano executivo antes de iniciar a obra.",
    items: ["Orçamento detalhado e fechado", "Cronograma executivo", "Plano de suprimentos"],
  },
  {
    number: "03",
    title: "EXECUÇÃO",
    desc: "Gestão completa da obra com equipe própria, relatórios em tempo real e entrega no prazo contratado.",
    items: ["Equipe técnica própria", "Relatórios semanais em tempo real", "Prazo garantido em contrato"],
  },
];

const processoSteps = [
  { step: "01", label: "Envio do projeto" },
  { step: "02", label: "Análise técnica" },
  { step: "03", label: "Orçamento fechado" },
  { step: "04", label: "Execução da obra" },
  { step: "05", label: "Entrega final" },
];

export default function Gerenciamento() {
  return (
    <div className="min-h-screen font-dm" style={{ background: "#0D0D0D", color: "#F9FAFB" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          paddingTop: 120,
          paddingBottom: 64,
          background: "#0D0D0D",
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left — text */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
                <span className="font-dm uppercase" style={{ fontSize: 9, letterSpacing: 2.5, color: "#22D3EE" }}>
                  Gerenciamento de obra
                </span>
              </div>

              <h1 className="font-syncopate font-bold uppercase mb-6" style={{ fontSize: 36, lineHeight: 0.95, color: "#F9FAFB" }}>
                VOCÊ TEM O PROJETO.{"\n"}A GENTE{" "}
                <span style={{ color: "#22D3EE" }}>EXECUTA.</span>
              </h1>

              <p className="font-dm mb-6 max-w-md" style={{ fontSize: 14, color: "rgba(249,250,251,0.45)", lineHeight: 1.7 }}>
                Compatibilização, planejamento e execução com método. Você acompanha cada etapa com transparência total. E nós entregamos no prazo, com preço fechado.
              </p>

              <div className="flex flex-col gap-2 mb-8">
                {["Preço fechado antes de assinar", "Cronograma real com marcos definidos", "Relatórios semanais em tempo real"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22D3EE", flexShrink: 0 }} />
                    <span className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.7)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — proof cards */}
            <div className="flex flex-col gap-4">
              {[
                { value: "48h", label: "Retorno da análise técnica" },
                { value: "100%", label: "Light Steel Frame" },
                { value: "0", label: "Surpresas no orçamento" },
              ].map((card, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5"
                  style={{
                    padding: "20px 24px",
                    borderRadius: 10,
                    border: "1px solid rgba(34,211,238,0.13)",
                    background: "rgba(34,211,238,0.03)",
                  }}
                >
                  <span className="font-syncopate font-bold" style={{ fontSize: 28, color: "#22D3EE", lineHeight: 1 }}>
                    {card.value}
                  </span>
                  <span className="font-dm" style={{ fontSize: 13, color: "rgba(249,250,251,0.5)" }}>
                    {card.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Escopo */}
      <section style={{ background: "#0A0A0A", padding: "64px 0", borderTop: "1px solid rgba(34,211,238,0.08)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-3">
            <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
            <span className="font-dm uppercase" style={{ fontSize: 9, letterSpacing: 2.5, color: "#22D3EE" }}>Nosso escopo</span>
          </div>
          <h2 className="font-syncopate font-bold uppercase mb-10" style={{ fontSize: 24, color: "#F9FAFB" }}>
            DO PROJETO À ENTREGA
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {escopoCards.map((card) => (
              <div
                key={card.number}
                style={{
                  padding: "28px 24px",
                  borderRadius: 10,
                  border: "1px solid rgba(34,211,238,0.13)",
                  background: "#0D0D0D",
                }}
              >
                <span className="font-syncopate font-bold block mb-2" style={{ fontSize: 10, color: "rgba(34,211,238,0.4)" }}>
                  {card.number}
                </span>
                <h3 className="font-syncopate font-bold uppercase mb-3" style={{ fontSize: 16, color: "#F9FAFB" }}>
                  {card.title}
                </h3>
                <p className="font-dm mb-5" style={{ fontSize: 13, color: "rgba(249,250,251,0.4)", lineHeight: 1.7 }}>
                  {card.desc}
                </p>
                <div className="flex flex-col gap-2">
                  {card.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#22D3EE", flexShrink: 0 }} />
                      <span className="font-dm" style={{ fontSize: 11, color: "rgba(249,250,251,0.6)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processo */}
      <section style={{ background: "#0D0D0D", padding: "64px 0", borderTop: "1px solid rgba(34,211,238,0.08)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-3">
            <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
            <span className="font-dm uppercase" style={{ fontSize: 9, letterSpacing: 2.5, color: "#22D3EE" }}>Processo</span>
          </div>
          <h2 className="font-syncopate font-bold uppercase mb-10" style={{ fontSize: 24, color: "#F9FAFB" }}>
            COMO FUNCIONA
          </h2>

          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-0">
            {processoSteps.map((s, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center text-center" style={{ minWidth: 100 }}>
                  <div
                    className="flex items-center justify-center mb-3"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: "1px solid rgba(34,211,238,0.25)",
                      background: "rgba(34,211,238,0.07)",
                    }}
                  >
                    <span className="font-syncopate font-bold" style={{ fontSize: 12, color: "#22D3EE" }}>{s.step}</span>
                  </div>
                  <span className="font-dm" style={{ fontSize: 11, color: "rgba(249,250,251,0.5)" }}>{s.label}</span>
                </div>
                {i < processoSteps.length - 1 && (
                  <div className="hidden md:block flex-1 mx-2" style={{ height: 1, background: "rgba(34,211,238,0.12)" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0A0A0A", padding: "64px 0", borderTop: "1px solid rgba(34,211,238,0.08)" }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-syncopate font-bold uppercase mb-3" style={{ fontSize: 24, color: "#F9FAFB" }}>
            ANÁLISE INICIAL GRATUITA
          </h2>
          <p className="font-dm mb-8" style={{ fontSize: 14, color: "rgba(249,250,251,0.45)" }}>
            Retorno em 48h. Envie seu projeto e receba um diagnóstico técnico completo.
          </p>
          <a
            href="https://wa.me/5562999447553"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-dm font-medium transition-all duration-200 hover:brightness-110"
            style={{ padding: "14px 28px", borderRadius: 6, fontSize: 13, background: "#22D3EE", color: "#050505" }}
          >
            Falar pelo WhatsApp →
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
