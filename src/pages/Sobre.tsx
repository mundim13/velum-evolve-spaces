import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";

const fundadores = [
  {
    name: "Fernando Mundim",
    initials: "FM",
    role: "Gestão e Estratégia",
    desc: "Responsável pela gestão de projetos, planejamento estratégico e relacionamento com clientes. Garante que cada obra entregue o que foi prometido, no prazo e no custo.",
  },
  {
    name: "Lucas Veloso",
    initials: "LV",
    role: "Engenharia e Execução",
    desc: "Engenheiro civil especialista em Light Steel Frame e construção industrializada. Lidera a equipe técnica e a execução das obras com rigor e inovação.",
  },
  {
    name: "Catharina Macedo",
    initials: "CM",
    role: "Arquitetura",
    desc: "Arquiteta responsável pelo projeto autoral de cada espaço Velum. Garante que cada obra seja funcional, estética e pensada para o bem-estar de quem vai viver nela.",
  },
];

export default function Sobre() {
  return (
    <div className="min-h-screen font-dm" style={{ background: "#0D0D0D", color: "#F9FAFB" }}>
      <SeoHead
        title="Quem Somos"
        description="Conheça a Velum: arquitetura, engenharia e gestão integradas em Goiânia e DF. Construção industrializada com método e tecnologia."
        path="/sobre"
        ogImage="https://www.grupovelum.com/og-sobre.jpg"
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Sobre a VELUM",
          url: "https://www.grupovelum.com/sobre",
          mainEntity: {
            "@type": "Organization",
            name: "VELUM",
            foundingLocation: { "@type": "Place", name: "Goiânia, GO" },
          },
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
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-5">
            <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
            <span className="font-dm uppercase" style={{ fontSize: 9, letterSpacing: 2.5, color: "#22D3EE" }}>
              Quem somos
            </span>
          </div>
          <Breadcrumbs current="Quem Somos" path="/sobre" />

          <h1 className="font-syncopate font-bold uppercase mb-6" style={{ fontSize: 36, lineHeight: 0.95, color: "#F9FAFB" }}>
            QUEM ESTÁ POR TRÁS{"\n"}DA <span style={{ color: "#22D3EE" }}>VELUM</span>
          </h1>

          <p className="font-dm max-w-2xl mb-4" style={{ fontSize: 14, color: "rgba(249,250,251,0.45)", lineHeight: 1.8 }}>
            A Velum é uma construtora de Goiânia que integra arquitetura, engenharia e gestão num modelo único. Atuamos em Goiânia, região metropolitana e Distrito Federal com foco em construção industrializada, principalmente Light Steel Frame.
          </p>
          <p className="font-dm max-w-2xl" style={{ fontSize: 14, color: "rgba(249,250,251,0.45)", lineHeight: 1.8 }}>
            Nosso modelo elimina a fragmentação tradicional da construção civil. Em vez de dezenas de fornecedores desalinhados, oferecemos um time integrado que cuida de tudo, do projeto à entrega das chaves. O resultado: obra mais rápida, custo previsível e qualidade superior.
          </p>
        </div>
      </section>

      {/* Valores */}
      <section style={{ background: "#0A0A0A", padding: "64px 0", borderTop: "1px solid rgba(34,211,238,0.08)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-3">
            <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
            <span className="font-dm uppercase" style={{ fontSize: 9, letterSpacing: 2.5, color: "#22D3EE" }}>Princípios</span>
          </div>
          <h2 className="font-syncopate font-bold uppercase mb-10" style={{ fontSize: 24, color: "#F9FAFB" }}>
            COMO PENSAMOS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "MÉTODO", desc: "Cada obra segue um processo claro com marcos, cronograma e orçamento definidos antes de iniciar." },
              { title: "TRANSPARÊNCIA", desc: "Relatórios em tempo real, orçamento aberto e comunicação direta. Sem surpresas." },
              { title: "TECNOLOGIA", desc: "Light Steel Frame, BIM e ferramentas digitais para construir mais rápido e com mais precisão." },
            ].map((v, i) => (
              <div
                key={i}
                style={{
                  padding: "28px 24px",
                  borderRadius: 10,
                  border: "1px solid rgba(34,211,238,0.13)",
                  background: "#0D0D0D",
                }}
              >
                <h3 className="font-syncopate font-bold uppercase mb-3" style={{ fontSize: 14, color: "#22D3EE" }}>
                  {v.title}
                </h3>
                <p className="font-dm" style={{ fontSize: 13, color: "rgba(249,250,251,0.45)", lineHeight: 1.7 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fundadores */}
      <section style={{ background: "#0D0D0D", padding: "64px 0", borderTop: "1px solid rgba(34,211,238,0.08)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-3">
            <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
            <span className="font-dm uppercase" style={{ fontSize: 9, letterSpacing: 2.5, color: "#22D3EE" }}>Fundadores</span>
          </div>
          <h2 className="font-syncopate font-bold uppercase mb-10" style={{ fontSize: 24, color: "#F9FAFB" }}>
            QUEM FAZ ACONTECER
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fundadores.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: "32px 28px",
                  borderRadius: 10,
                  border: "1px solid rgba(34,211,238,0.13)",
                  background: "rgba(34,211,238,0.03)",
                }}
              >
                {/* Avatar placeholder */}
                <div
                  className="flex items-center justify-center mb-5"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "rgba(34,211,238,0.1)",
                    border: "1px solid rgba(34,211,238,0.2)",
                  }}
                >
                  <span className="font-syncopate font-bold" style={{ fontSize: 16, color: "#22D3EE" }}>
                    {f.initials}
                  </span>
                </div>

                <h3 className="font-syncopate font-bold uppercase mb-1" style={{ fontSize: 16, color: "#F9FAFB" }}>
                  {f.name}
                </h3>
                <p className="font-dm uppercase mb-4" style={{ fontSize: 10, letterSpacing: 1.5, color: "#22D3EE" }}>
                  {f.role}
                </p>
                <p className="font-dm" style={{ fontSize: 13, color: "rgba(249,250,251,0.45)", lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0A0A0A", padding: "64px 0", borderTop: "1px solid rgba(34,211,238,0.08)" }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="font-syncopate font-bold uppercase mb-3" style={{ fontSize: 24, color: "#F9FAFB" }}>
            VAMOS CONVERSAR?
          </h2>
          <p className="font-dm mb-8" style={{ fontSize: 14, color: "rgba(249,250,251,0.45)" }}>
            Fale com a equipe Velum pelo WhatsApp. Retorno rápido e sem compromisso.
          </p>
          <a
            href="https://wa.me/5562999447553?text=Ol%C3%A1!%20Quero%20conhecer%20mais%20sobre%20a%20Velum."
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
