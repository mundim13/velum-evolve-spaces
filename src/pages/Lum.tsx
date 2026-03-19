import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type FilterType = "todos" | "disponivel" | "em_breve";

interface Modulo {
  number: string;
  name: string;
  tagline: string;
  features: string[];
  status: "disponivel" | "em_breve";
}

const modulos: Modulo[] = [
  {
    number: "01",
    name: "ULTRAPOCKET GOURMET",
    tagline: "Espaço gourmet compacto e funcional",
    features: [
      "Área gourmet completa",
      "Churrasqueira integrada",
      "Light Steel Frame",
      "Entrega rápida",
    ],
    status: "disponivel",
  },
  {
    number: "02",
    name: "LÛM ESSENCIAL",
    tagline: "O módulo base do ecossistema LÛM",
    features: [
      "20 m² otimizados",
      "Sala + quarto + banheiro",
      "100% Light Steel Frame",
      "Plug and play",
    ],
    status: "disponivel",
  },
  {
    number: "03",
    name: "LÛM CONFORT",
    tagline: "Conforto expandido para o dia a dia",
    features: [
      "35 m² de área útil",
      "Sala ampla + suíte",
      "Cozinha integrada",
      "Acabamento premium",
    ],
    status: "disponivel",
  },
  {
    number: "04",
    name: "LÛM FAMILY",
    tagline: "Projetado para famílias que crescem",
    features: [
      "50 m² modulares",
      "2 quartos + sala + cozinha",
      "Expansível com outros módulos",
      "Projeto bioclimático",
    ],
    status: "disponivel",
  },
  {
    number: "05",
    name: "LÛM ZEN",
    tagline: "Refúgio de bem-estar e tranquilidade",
    features: [
      "Espaço wellness integrado",
      "Ventilação natural cruzada",
      "Iluminação zenital",
      "Design contemplativo",
    ],
    status: "disponivel",
  },
  {
    number: "06",
    name: "LÛM KIDS",
    tagline: "Espaço lúdico e seguro para crianças",
    features: [
      "Brinquedoteca modular",
      "Materiais atóxicos",
      "Segurança reforçada",
      "Adaptável por faixa etária",
    ],
    status: "em_breve",
  },
  {
    number: "07",
    name: "LÛM PAYBACK",
    tagline: "Módulo para renda e retorno financeiro",
    features: [
      "Projetado para locação",
      "Alta eficiência por m²",
      "ROI otimizado",
      "Gestão simplificada",
    ],
    status: "em_breve",
  },
];

export default function Lum() {
  const [filter, setFilter] = useState<FilterType>("todos");

  const filtered = modulos.filter((m) => {
    if (filter === "todos") return true;
    return m.status === filter;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "disponivel", label: "Disponíveis" },
    { key: "em_breve", label: "Em breve" },
  ];

  return (
    <div className="min-h-screen font-dm" style={{ background: "#0D0D0D", color: "#F9FAFB" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          paddingTop: 120,
          paddingBottom: 48,
          background: "#0D0D0D",
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
            <span className="font-syncopate font-bold uppercase" style={{ fontSize: 10, letterSpacing: 2, color: "#22D3EE" }}>
              COLETÂNEA
            </span>
          </div>
          <h1 className="font-syncopate font-bold uppercase mb-4" style={{ fontSize: 80, lineHeight: 0.9, color: "#F9FAFB" }}>
            LÛM
          </h1>
          <p className="font-dm max-w-xl" style={{ fontSize: 14, color: "rgba(249,250,251,0.45)", lineHeight: 1.7 }}>
            Um ecossistema modular que cresce conforme sua vida evolui. Módulos industrializados em Light Steel Frame — design inteligente, entrega rápida, preço fechado.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section style={{ background: "#0D0D0D", paddingBottom: 32 }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="font-dm font-medium transition-all duration-200"
                style={{
                  padding: "8px 18px",
                  borderRadius: 20,
                  fontSize: 12,
                  background: filter === f.key ? "#22D3EE" : "rgba(34,211,238,0.08)",
                  color: filter === f.key ? "#050505" : "rgba(249,250,251,0.5)",
                  border: `1px solid ${filter === f.key ? "#22D3EE" : "rgba(34,211,238,0.15)"}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ background: "#0D0D0D", padding: "0 0 64px" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((m) => (
              <div
                key={m.number}
                style={{
                  borderRadius: 10,
                  border: "1px solid rgba(34,211,238,0.13)",
                  background: "#0A0A0A",
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Number + badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-syncopate font-bold" style={{ fontSize: 11, color: "rgba(34,211,238,0.3)" }}>
                    {m.number}
                  </span>
                  <span
                    className="font-dm font-medium uppercase"
                    style={{
                      fontSize: 9,
                      letterSpacing: 1,
                      padding: "4px 10px",
                      borderRadius: 4,
                      background: m.status === "disponivel" ? "rgba(34,211,238,0.15)" : "rgba(249,250,251,0.06)",
                      color: m.status === "disponivel" ? "#22D3EE" : "rgba(249,250,251,0.35)",
                      border: `1px solid ${m.status === "disponivel" ? "rgba(34,211,238,0.25)" : "rgba(249,250,251,0.1)"}`,
                    }}
                  >
                    {m.status === "disponivel" ? "Disponível" : "Em breve"}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-syncopate font-bold uppercase mb-1" style={{ fontSize: 16, color: "#F9FAFB" }}>
                  {m.name}
                </h3>

                {/* Tagline */}
                <p className="font-dm italic mb-5" style={{ fontSize: 12, color: "rgba(249,250,251,0.4)" }}>
                  {m.tagline}
                </p>

                {/* Features */}
                <div className="flex flex-col gap-2 mb-6 flex-1">
                  {m.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#22D3EE", flexShrink: 0 }} />
                      <span className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.6)" }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {m.status === "disponivel" ? (
                  <a
                    href="https://wa.me/5562999447553"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center font-dm font-medium transition-all duration-200 hover:brightness-110"
                    style={{
                      padding: "10px 20px",
                      borderRadius: 6,
                      fontSize: 12,
                      background: "#22D3EE",
                      color: "#050505",
                      width: "100%",
                    }}
                  >
                    Solicitar orçamento →
                  </a>
                ) : (
                  <a
                    href="https://wa.me/5562999447553"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center font-dm font-medium transition-all duration-200"
                    style={{
                      padding: "10px 20px",
                      borderRadius: 6,
                      fontSize: 12,
                      background: "transparent",
                      color: "rgba(249,250,251,0.5)",
                      border: "1px solid rgba(249,250,251,0.15)",
                      width: "100%",
                    }}
                  >
                    Quero ser avisado →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
