import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BookImage, BarChart3, Package, FileText } from "lucide-react";
import diarioObra1 from "@/assets/diario-obra-1.jpeg";
import diarioObra2 from "@/assets/diario-obra-2.jpeg";

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
      <SeoHead
        title="Gerenciamento de Obra"
        description="Preço fechado e cronograma real. Gerenciamento de obra com relatórios em tempo real, da compatibilização à entrega das chaves."
        path="/gerenciamento"
        ogImage="https://www.grupovelum.com/og-gerenciamento.jpg"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Gerenciamento de Obra",
          provider: { "@type": "Organization", name: "VELUM" },
          description: "Compatibilização, planejamento e execução com método. Preço fechado e prazo garantido.",
          areaServed: { "@type": "Place", name: "Goiânia, GO e DF" },
        }}
      />
      <Navbar />

      {/* Hero */}
      <section
        id="main"
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
              <Breadcrumbs current="Gerenciamento" path="/gerenciamento" />

              <h1 className="font-syncopate font-bold uppercase mb-6" style={{ fontSize: 36, lineHeight: 0.95, color: "#F9FAFB" }}>
                VOCÊ TEM O PROJETO.{"\n"}A GENTE{" "}
                <span style={{ color: "#22D3EE" }}>EXECUTA.</span>
              </h1>

              <p className="font-dm mb-6 max-w-md" style={{ fontSize: 14, color: "rgba(249,250,251,0.45)", lineHeight: 1.7 }}>
                Compatibilização, planejamento e execução com método. Você acompanha cada etapa com transparência total — e nós entregamos no prazo, com preço fechado.
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

      {/* Portal do Cliente */}
      <section style={{ background: "#0D0D0D", padding: "80px 0", borderTop: "1px solid rgba(34,211,238,0.08)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left content */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
                <span className="font-dm uppercase" style={{ fontSize: 9, letterSpacing: 2.5, color: "#22D3EE" }}>
                  Tecnologia
                </span>
              </div>
              <h2 className="font-syncopate font-bold uppercase mb-4" style={{ fontSize: 28, lineHeight: 1, color: "#F9FAFB" }}>
                GESTÃO DE OBRAS
              </h2>
              <h3 className="font-syncopate font-bold uppercase mb-6" style={{ fontSize: 20, lineHeight: 1, color: "rgba(249,250,251,0.5)" }}>
                PORTAL DO CLIENTE
              </h3>
              <p className="font-dm mb-10 max-w-md" style={{ fontSize: 14, color: "rgba(249,250,251,0.45)", lineHeight: 1.7 }}>
                Utilizamos software de gestão de obras com inteligência artificial integrada, emitindo relatório em tempo real de tudo que acontece instantaneamente na obra.
              </p>

              {/* Feature cards */}
              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: BookImage,
                    title: "DIÁRIO DE OBRAS",
                    desc: "Relatório fotográfico e técnico em tempo real",
                  },
                  {
                    icon: BarChart3,
                    title: "DASHBOARD PREVISTO VS REALIZADO",
                    desc: "Clareza em forma de números",
                  },
                  {
                    icon: Package,
                    title: "GESTÃO DE SUPRIMENTOS",
                    desc: "Controle de compras e entrega",
                  },
                  {
                    icon: FileText,
                    title: "GESTÃO FINANCEIRA E CONTRATOS",
                    desc: "Toda a burocracia de forma sucinta e prática",
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4"
                    style={{
                      padding: "18px 22px",
                      borderRadius: 10,
                      border: "1px solid rgba(34,211,238,0.15)",
                      background: "rgba(34,211,238,0.03)",
                    }}
                  >
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        background: "rgba(34,211,238,0.1)",
                        border: "1px solid rgba(34,211,238,0.2)",
                      }}
                    >
                      <feature.icon size={18} style={{ color: "#22D3EE" }} />
                    </div>
                    <div>
                      <h4 className="font-syncopate font-bold uppercase mb-1" style={{ fontSize: 12, color: "#22D3EE" }}>
                        {feature.title}
                      </h4>
                      <p className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.45)" }}>
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right visual — two real screenshots */}
            <div className="flex gap-4 justify-center">
              {/* Print 1 — Relatório */}
              <div
                style={{
                  flex: 1,
                  maxWidth: 220,
                  borderRadius: 24,
                  border: "2px solid rgba(34,211,238,0.2)",
                  background: "#000",
                  boxShadow: "0 20px 60px rgba(34,211,238,0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  className="mx-auto"
                  style={{ width: 50, height: 3, borderRadius: 3, background: "rgba(249,250,251,0.15)", marginTop: 10, marginBottom: 8 }}
                />
                <img
                  src={diarioObra1}
                  alt="Relatório de Diário de Obra"
                  width={320}
                  height={640}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", display: "block" }}
                />
              </div>

              {/* Print 2 — Fotos da obra */}
              <div
                style={{
                  flex: 1,
                  maxWidth: 220,
                  borderRadius: 24,
                  border: "2px solid rgba(34,211,238,0.15)",
                  background: "#000",
                  boxShadow: "0 20px 60px rgba(34,211,238,0.08)",
                  marginTop: 40,
                  overflow: "hidden",
                }}
              >
                <div
                  className="mx-auto"
                  style={{ width: 50, height: 3, borderRadius: 3, background: "rgba(249,250,251,0.15)", marginTop: 10, marginBottom: 8 }}
                />
                <img
                  src={diarioObra2}
                  alt="Fotos da obra em tempo real"
                  width={320}
                  height={480}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Processo */}
      <section style={{ background: "#0A0A0A", padding: "64px 0", borderTop: "1px solid rgba(34,211,238,0.08)" }}>
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
            href="https://wa.me/5562999447553?text=Ol%C3%A1!%20Tenho%20um%20projeto%20e%20quero%20saber%20quanto%20custa%20a%20execu%C3%A7%C3%A3o."
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
