import { Link } from "react-router-dom";
import { Compass, BarChart3, Hammer, ArrowRight } from "lucide-react";

const pilares = [
  {
    icon: Compass,
    number: "01",
    title: "PROJETO",
    desc: "Arquitetura autoral com neuroarquitetura, eficiência energética e integração ao terreno. Do briefing ao executivo.",
    href: "/contato",
    bullets: ["Projeto arquitetônico completo", "Compatibilização de disciplinas", "Design bioclimático"],
  },
  {
    icon: BarChart3,
    number: "02",
    title: "GESTÃO",
    desc: "Gerenciamento de obra com controle de cronograma, custos e qualidade — do planejamento à entrega.",
    href: "/gerenciamento",
    bullets: ["Orçamento fechado", "Relatórios em tempo real", "Cronograma com marcos definidos"],
  },
  {
    icon: Hammer,
    number: "03",
    title: "EXECUÇÃO",
    desc: "Construção com equipe própria, preço fechado e garantia contratual de prazo. Sem surpresas.",
    href: "/contato",
    bullets: ["Equipe técnica própria", "Prazo garantido em contrato", "Entrega com laudo técnico"],
  },
];

export default function ModeloIntegradoSection() {
  return (
    <section style={{ background: "#0A0A0A", padding: "80px 0", borderTop: "1px solid rgba(34,211,238,0.08)" }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
          <span className="font-dm uppercase" style={{ fontSize: 9, letterSpacing: 2.5, color: "#22D3EE" }}>
            Modelo integrado
          </span>
        </div>
        <h2 className="font-syncopate font-bold uppercase mb-4" style={{ fontSize: 28, lineHeight: 1, color: "#F9FAFB" }}>
          PROJETO, GESTÃO E OBRA
        </h2>
        <p className="font-dm mb-12 max-w-xl" style={{ fontSize: 14, color: "rgba(249,250,251,0.4)", lineHeight: 1.7 }}>
          Na Velum, arquitetura, engenharia e gestão caminham juntas. Você entra em qualquer etapa — a responsabilidade é sempre total.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {pilares.map((p) => (
            <Link
              key={p.number}
              to={p.href}
              className="group flex flex-col transition-all duration-300"
              style={{
                padding: "32px 28px",
                borderRadius: 10,
                border: "1px solid rgba(34,211,238,0.13)",
                background: "#0D0D0D",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,211,238,0.35)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(34,211,238,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,211,238,0.13)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Icon + Number */}
              <div className="flex items-center justify-between mb-5">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    background: "rgba(34,211,238,0.08)",
                    border: "1px solid rgba(34,211,238,0.15)",
                  }}
                >
                  <p.icon size={20} style={{ color: "#22D3EE" }} />
                </div>
                <span className="font-syncopate font-bold" style={{ fontSize: 10, color: "rgba(34,211,238,0.3)" }}>
                  {p.number}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-syncopate font-bold uppercase mb-3" style={{ fontSize: 18, color: "#F9FAFB" }}>
                {p.title}
              </h3>

              {/* Description */}
              <p className="font-dm mb-5" style={{ fontSize: 13, color: "rgba(249,250,251,0.4)", lineHeight: 1.7 }}>
                {p.desc}
              </p>

              {/* Bullets */}
              <div className="flex flex-col gap-2 mb-6 flex-1">
                {p.bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#22D3EE", flexShrink: 0 }} />
                    <span className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.6)" }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* Link */}
              <span className="inline-flex items-center gap-1.5 font-dm font-medium group-hover:gap-2.5 transition-all" style={{ fontSize: 12, color: "#22D3EE" }}>
                Saiba mais <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="text-center">
          <p className="font-syncopate font-bold uppercase" style={{ fontSize: 11, letterSpacing: 2, color: "rgba(249,250,251,0.2)" }}>
            Inseparáveis. Responsabilidade total.
          </p>
        </div>
      </div>
    </section>
  );
}
