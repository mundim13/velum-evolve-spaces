import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Box, HardHat, HelpCircle } from "lucide-react";

/* ── Journey data ── */
interface Jornada {
  icon: typeof Box;
  iconBg: string;
  titulo: string;
  subtitulo: string;
  href: string;
  accentColor: string;
  painelTitulo: string;
  painelDescricao: string;
  passos: string[];
  cta: string;
}

const jornadas: Jornada[] = [
  {
    icon: Box,
    iconBg: "rgba(0,212,180,0.12)",
    titulo: "Quero conhecer a Coletânea LÛM",
    subtitulo: "Módulos prontos, entrega rápida, design inteligente",
    href: "/lum",
    accentColor: "#00D4B4",
    painelTitulo: "Coletânea LÛM",
    painelDescricao:
      "Módulos de 20 a 50 m² projetados com Steel Frame, neuroarquitetura e acabamento premium. Escolha, personalize e receba — sem obra convencional.",
    passos: [
      "Escolha o módulo ideal para o seu terreno",
      "Personalize acabamentos e layout interno",
      "Receba montado em semanas, com garantia contratual",
    ],
    cta: "Explorar módulos",
  },
  {
    icon: HardHat,
    iconBg: "rgba(200,255,110,0.12)",
    titulo: "Tenho projeto, quero orçamento de obra",
    subtitulo: "Compatibilização, gestão e execução com método",
    href: "/gerenciamento",
    accentColor: "#C8FF6E",
    painelTitulo: "Obra com método",
    painelDescricao:
      "Você já tem o projeto — nós fazemos a compatibilização, planejamento executivo e gestão da obra com preço fechado e cronograma real.",
    passos: [
      "Envie seu projeto para análise de viabilidade",
      "Receba orçamento detalhado e cronograma",
      "Acompanhe cada etapa com transparência total",
    ],
    cta: "Solicitar orçamento",
  },
  {
    icon: HelpCircle,
    iconBg: "rgba(255,255,255,0.07)",
    titulo: "Não tenho projeto, quero entender mais",
    subtitulo: "Do zero: briefing, projeto arquitetônico e obra",
    href: "/sobre",
    accentColor: "#00D4B4",
    painelTitulo: "Do zero ao pronto",
    painelDescricao:
      "Começamos pelo briefing, passamos pelo projeto arquitetônico e executamos a obra completa. Tudo integrado, sem terceiros desalinhados.",
    passos: [
      "Reunião de briefing e análise do terreno",
      "Projeto arquitetônico + compatibilização",
      "Obra executada com equipe própria e prazo garantido",
    ],
    cta: "Começar conversa",
  },
];

/* ── Component ── */
export default function HeroSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const active = selected !== null ? jornadas[selected] : null;

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "#0E2420",
        backgroundImage:
          "linear-gradient(rgba(0,212,180,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,180,0.05) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: "-10%",
          right: "-8%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,180,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-[100px] pb-20 lg:pt-[120px]">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-5 h-px" style={{ background: "#00D4B4" }} />
          <span
            className="font-dm uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "3px",
              color: "#00D4B4",
            }}
          >
            Goiânia, GO · Steel Frame · Arquitetura integrada
          </span>
        </div>

        {/* ── Desktop 2-col / Mobile 1-col ── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* LEFT column */}
          <div>
            {/* Headline */}
            <h1
              className="font-syne font-extrabold uppercase"
              style={{
                fontSize: "clamp(36px, 5vw, 54px)",
                lineHeight: 0.92,
                letterSpacing: "-1px",
                color: "#EDF5F3",
              }}
            >
              PROJETO E OBRA
              <br />
              PARA UMA VIDA
              <br />
              MAIS{" "}
              <span style={{ color: "#00D4B4" }}>LEVE</span>
            </h1>

            {/* Subtitle */}
            <p
              className="font-dm mt-6 mb-10 max-w-md"
              style={{ fontSize: 15, color: "rgba(237,245,243,0.45)" }}
            >
              Você decide por onde começa — a Velum assume o restante.
            </p>

            {/* Journey buttons */}
            <div className="flex flex-col gap-3">
              {jornadas.map((j, i) => {
                const isSelected = selected === i;
                const borderColor =
                  isSelected
                    ? i === 1
                      ? "#C8FF6E"
                      : "#00D4B4"
                    : "rgba(0,212,180,0.13)";
                const bgColor = isSelected
                  ? "rgba(0,212,180,0.08)"
                  : "rgba(0,212,180,0.03)";

                return (
                  <button
                    key={i}
                    onClick={() => setSelected(isSelected ? null : i)}
                    className="flex items-center gap-4 text-left transition-all duration-200"
                    style={{
                      padding: "16px 18px",
                      borderRadius: 10,
                      border: `1px solid ${borderColor}`,
                      background: bgColor,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="shrink-0 flex items-center justify-center"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: j.iconBg,
                      }}
                    >
                      <j.icon
                        size={20}
                        style={{ color: j.accentColor }}
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-dm font-medium"
                        style={{ fontSize: 14, color: "#EDF5F3" }}
                      >
                        {j.titulo}
                      </p>
                      <p
                        className="font-dm mt-0.5"
                        style={{ fontSize: 12, color: "rgba(237,245,243,0.4)" }}
                      >
                        {j.subtitulo}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ArrowRight
                      size={16}
                      className="shrink-0 transition-transform duration-200"
                      style={{
                        color: isSelected ? j.accentColor : "rgba(237,245,243,0.25)",
                        transform: isSelected ? "translateX(2px)" : "none",
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT column — dynamic panel */}
          <div
            className="transition-all duration-300 ease-out"
            style={{
              borderRadius: 12,
              border: "1px solid rgba(0,212,180,0.13)",
              background: "rgba(0,212,180,0.05)",
              padding: 22,
              minHeight: 320,
            }}
          >
            {active === null ? (
              /* Empty state */
              <div className="flex items-center justify-center h-full min-h-[280px]">
                <p
                  className="font-dm text-center"
                  style={{ fontSize: 14, color: "rgba(237,245,243,0.3)" }}
                >
                  Selecione uma opção ao lado para ver os detalhes.
                </p>
              </div>
            ) : (
              /* Active journey panel */
              <div
                className="flex flex-col h-full"
                style={{
                  animation: "heroFadeIn 0.3s ease-out",
                }}
              >
                {/* Icon + title */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: active.iconBg,
                    }}
                  >
                    <active.icon size={20} style={{ color: active.accentColor }} />
                  </div>
                  <h3
                    className="font-syne font-extrabold uppercase"
                    style={{ fontSize: 18, color: "#EDF5F3", letterSpacing: "-0.5px" }}
                  >
                    {active.painelTitulo}
                  </h3>
                </div>

                {/* Description */}
                <p
                  className="font-dm mb-7"
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "rgba(237,245,243,0.55)",
                  }}
                >
                  {active.painelDescricao}
                </p>

                {/* Steps */}
                <div className="flex flex-col gap-4 mb-8">
                  {active.passos.map((passo, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span
                        className="shrink-0 flex items-center justify-center font-dm font-medium"
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          fontSize: 12,
                          background:
                            selected === 1
                              ? "rgba(200,255,110,0.15)"
                              : "rgba(0,212,180,0.12)",
                          color: active.accentColor,
                        }}
                      >
                        {i + 1}
                      </span>
                      <p
                        className="font-dm pt-0.5"
                        style={{
                          fontSize: 13,
                          lineHeight: 1.5,
                          color: "rgba(237,245,243,0.7)",
                        }}
                      >
                        {passo}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  <Link
                    to={active.href}
                    className="inline-flex items-center gap-2 font-dm font-medium transition-all duration-200 group"
                    style={{
                      padding: "12px 28px",
                      borderRadius: 999,
                      fontSize: 14,
                      background: active.accentColor,
                      color: "#081512",
                    }}
                  >
                    {active.cta}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyframe for panel fade-in */}
      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
