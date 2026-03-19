import { useState } from "react";
import { Link } from "react-router-dom";

/* ── Option data ── */
interface Option {
  number: string;
  tooltip: string;
  accent: string;
  eyebrow: string;
  headline: JSX.Element;
  desc: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  isLink?: boolean;
}

const options: Option[] = [
  {
    number: "01",
    tooltip: "01 — Tenho projeto, quero orçamento",
    accent: "#22D3EE",
    eyebrow: "Gerenciamento de obra",
    headline: (
      <>
        TENHO PROJETO,{"\n"}QUERO SABER{"\n"}QUANTO <span style={{ color: "#22D3EE" }}>CUSTA</span>
      </>
    ),
    desc: "Você tem o projeto de arquitetura. A Velum compatibiliza, planeja e executa com método, tecnologia e responsabilidade total.",
    bullets: [
      "Análise técnica gratuita em até 48h",
      "Orçamento fechado antes de assinar",
      "Gestão com relatórios em tempo real",
    ],
    ctaLabel: "Enviar projeto para análise →",
    ctaHref: "https://wa.me/5562999447553",
  },
  {
    number: "02",
    tooltip: "02 — Não tenho projeto",
    accent: "#22D3EE",
    eyebrow: "Projeto do zero",
    headline: (
      <>
        NÃO TENHO{"\n"}PROJETO,{"\n"}QUERO <span style={{ color: "#22D3EE" }}>ENTENDER</span>
      </>
    ),
    desc: "Você tem um terreno ou uma ideia. A Velum faz o projeto completo, do briefing à entrega das chaves.",
    bullets: [
      "Briefing e diagnóstico inicial",
      "Projeto arquitetônico autoral",
      "Execução com gestão integrada",
    ],
    ctaLabel: "Falar com um especialista →",
    ctaHref: "https://wa.me/5562999447553",
  },
  {
    number: "03",
    tooltip: "03 — Viabilidade do negócio",
    accent: "#7eb8ff",
    eyebrow: "Viabilidade econômica",
    headline: (
      <>
        QUERO A{"\n"}VIABILIDADE{"\n"}DO MEU <span style={{ color: "#7eb8ff" }}>NEGÓCIO</span>
      </>
    ),
    desc: "Análise econômica de ativos imobiliários. Entenda o potencial de retorno antes de investir.",
    bullets: [
      "Estudo de viabilidade completo",
      "Análise de retorno sobre investimento",
      "Relatório técnico detalhado",
    ],
    ctaLabel: "Solicitar análise →",
    ctaHref: "https://wa.me/5562999447553",
  },
  {
    number: "04",
    tooltip: "04 — Coletânea LÛM",
    accent: "#a78bfa",
    eyebrow: "Coletânea LÛM",
    headline: (
      <>
        QUERO{"\n"}CONHECER{"\n"}A <span style={{ color: "#a78bfa" }}>COLETÂNEA</span>
      </>
    ),
    desc: "Módulos industrializados plug and play. Entrega rápida, design inteligente, preço fechado.",
    bullets: [
      "5 módulos disponíveis agora",
      "100% Light Steel Frame",
      "Ecossistema modular expansível",
    ],
    ctaLabel: "Explorar os módulos →",
    ctaHref: "/lum",
    isLink: true,
  },
];

/* ── CTA button — always cyan ── */
function CtaButton({ opt }: { opt: Option }) {
  const style = {
    padding: "12px 22px",
    borderRadius: 6,
    fontSize: 12,
    background: "#22D3EE",
    color: "#050505",
  };
  if (opt.isLink) {
    return (
      <Link to={opt.ctaHref} className="inline-flex font-dm font-medium transition-all duration-200 hover:brightness-110" style={style}>
        {opt.ctaLabel}
      </Link>
    );
  }
  return (
    <a href={opt.ctaHref} target="_blank" rel="noopener noreferrer" className="inline-flex font-dm font-medium transition-all duration-200 hover:brightness-110" style={style}>
      {opt.ctaLabel}
    </a>
  );
}

function MobileCtaButton({ opt }: { opt: Option }) {
  const style = {
    padding: "8px 16px",
    borderRadius: 6,
    fontSize: 11,
    background: "#22D3EE",
    color: "#050505",
  };
  if (opt.isLink) {
    return (
      <Link to={opt.ctaHref} className="inline-flex font-dm font-medium" style={style}>
        {opt.ctaLabel}
      </Link>
    );
  }
  return (
    <a href={opt.ctaHref} target="_blank" rel="noopener noreferrer" className="inline-flex font-dm font-medium" style={style}>
      {opt.ctaLabel}
    </a>
  );
}

/* ── Component ── */
export default function HeroSection() {
  const [activeOption, setActiveOption] = useState(0);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState<number>(0);
  const active = options[activeOption];

  return (
    <section className="relative">
      {/* ── DESKTOP ── */}
      <div className="hidden md:flex" style={{ height: "100vh" }}>
        {/* Sidebar */}
        <div
          className="flex flex-col items-center py-6 relative"
          style={{
            width: 64,
            flexShrink: 0,
            background: "#080808",
            borderRight: "1px solid rgba(34,211,238,0.12)",
          }}
        >
          {/* Logo vertical */}
          <span
            className="font-syncopate font-bold mb-5"
            style={{
              fontSize: 9,
              letterSpacing: 3,
              color: "#F9FAFB",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            VELUM
          </span>

          {/* SELECIONE label */}
          <span
            className="font-dm uppercase mb-2"
            style={{
              fontSize: 7,
              letterSpacing: 1.5,
              color: "rgba(34,211,238,0.4)",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            SELECIONE
          </span>

          {/* Gradient line */}
          <div
            className="mb-2"
            style={{
              width: 1,
              height: 14,
              background: "linear-gradient(to bottom, #22D3EE, transparent)",
            }}
          />

          {/* Options */}
          <div className="flex flex-col items-center">
            {options.map((opt, i) => {
              const isActive = activeOption === i;
              const isHovered = hoveredOption === i;
              return (
                <div
                  key={i}
                  className="relative flex flex-col items-center cursor-pointer transition-all duration-200"
                  style={{
                    padding: "11px 0",
                    borderLeft: `2px solid ${isActive ? "#22D3EE" : "transparent"}`,
                    background: isActive ? "rgba(34,211,238,0.07)" : "transparent",
                    width: "100%",
                  }}
                  onClick={() => setActiveOption(i)}
                  onMouseEnter={() => setHoveredOption(i)}
                  onMouseLeave={() => setHoveredOption(null)}
                >
                  <span
                    className="font-syncopate font-bold mb-1"
                    style={{ fontSize: 10, color: isActive ? "#22D3EE" : "rgba(249,250,251,0.15)" }}
                  >
                    {opt.number}
                  </span>
                  <div
                    style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: isActive ? "#22D3EE" : "rgba(249,250,251,0.08)",
                      boxShadow: isActive ? "0 0 8px rgba(34,211,238,0.5)" : "none",
                    }}
                  />
                  {isHovered && (
                    <div
                      className="font-dm"
                      style={{
                        position: "absolute", left: 70, top: "50%", transform: "translateY(-50%)",
                        background: "#0D0D0D", border: "1px solid rgba(34,211,238,0.2)",
                        borderRadius: 6, padding: "5px 10px", fontSize: 11,
                        color: "#F9FAFB", whiteSpace: "nowrap", zIndex: 30,
                      }}
                    >
                      {opt.tooltip}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom: gradient line + SCROLL */}
          <div className="mt-auto flex flex-col items-center">
            <div style={{ width: 1, height: 22, background: "linear-gradient(to bottom, #22D3EE, transparent)" }} />
            <span
              className="font-dm mt-2"
              style={{
                fontSize: 7, letterSpacing: 1.5, color: "rgba(249,250,251,0.25)",
                writingMode: "vertical-rl", transform: "rotate(180deg)",
              }}
            >
              SCROLL
            </span>
          </div>
        </div>

        {/* Main area */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 80px 80px 80px",
            background: "#0D0D0D",
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        >
          {/* Geometric circles */}
          <div
            className="pointer-events-none"
            style={{
              position: "absolute",
              right: -80,
              top: "50%",
              transform: "translateY(-50%)",
              width: 400,
              height: 400,
              borderRadius: "50%",
              border: "1px solid rgba(34,211,238,0.08)",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: 260, height: 260, borderRadius: "50%",
                border: "1px solid rgba(34,211,238,0.05)",
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              }}
            />
            <div
              style={{
                width: 120, height: 120, borderRadius: "50%",
                border: "1px solid rgba(34,211,238,0.12)",
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              }}
            />
          </div>

          {/* Fixed phrase — absolute top-left */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 80,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span className="font-syncopate font-bold uppercase" style={{ fontSize: 10, letterSpacing: 1, color: "rgba(249,250,251,0.18)", whiteSpace: "nowrap" }}>
              Você decide por onde começa —
            </span>
            <span className="font-syncopate font-bold uppercase" style={{ fontSize: 10, letterSpacing: 1, color: "rgba(34,211,238,0.4)", whiteSpace: "nowrap" }}>
              a Velum assume o restante
            </span>
          </div>

          {/* Dynamic content */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <div key={activeOption} style={{ animation: "heroSlideIn 300ms ease" }}>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: 16, height: 1, background: active.accent }} />
                <span className="font-dm uppercase" style={{ fontSize: 9, letterSpacing: 2.5, color: active.accent }}>
                  {active.eyebrow}
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-syncopate font-bold uppercase mb-5"
                style={{ fontSize: 32, lineHeight: 0.95, letterSpacing: "-0.5px", color: "#F9FAFB", whiteSpace: "pre-line" }}
              >
                {active.headline}
              </h1>

              {/* Description */}
              <p className="font-dm mb-6 max-w-lg" style={{ fontSize: 13, color: "rgba(249,250,251,0.45)", lineHeight: 1.7 }}>
                {active.desc}
              </p>

              {/* Bullets */}
              <div className="flex flex-col gap-2.5 mb-8">
                {active.bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: active.accent, flexShrink: 0 }} />
                    <span className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.7)" }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <CtaButton opt={active} />
            </div>
          </div>

          {/* Trust bar inline — bottom */}
          <div
            className="flex items-center justify-center gap-6 flex-wrap"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "14px 24px",
              background: "rgba(5,5,5,0.85)",
              borderTop: "1px solid rgba(34,211,238,0.1)",
              zIndex: 2,
            }}
          >
            {["Prazo garantido em contrato", "100% Light Steel Frame", "Goiânia, GO e DF", "Empresa registrada"].map(
              (item, i, arr) => (
                <div key={i} className="flex items-center gap-2">
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#22D3EE" }} />
                  <span className="font-dm" style={{ fontSize: 9, color: "rgba(249,250,251,0.45)" }}>{item}</span>
                  {i < arr.length - 1 && (
                    <div className="ml-4" style={{ width: 1, height: 12, background: "rgba(34,211,238,0.12)" }} />
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="md:hidden" style={{ background: "#050505", paddingTop: 80 }}>
        <div
          className="px-5 pb-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        >
          {/* Fixed phrase */}
          <p className="font-dm uppercase mb-4" style={{ fontSize: 10, letterSpacing: 1, color: "rgba(249,250,251,0.2)" }}>
            Você decide por onde começa — <span style={{ color: "rgba(34,211,238,0.4)" }}>a Velum assume o restante</span>
          </p>

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <div style={{ width: 16, height: 1, background: options[mobileOpen].accent }} />
            <span className="font-dm uppercase" style={{ fontSize: 9, letterSpacing: 2.5, color: options[mobileOpen].accent }}>
              {options[mobileOpen].eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-syncopate font-bold uppercase mb-5"
            style={{ fontSize: 20, lineHeight: 1, letterSpacing: "-0.5px", color: "#F9FAFB", whiteSpace: "pre-line" }}
          >
            {options[mobileOpen].headline}
          </h1>

          {/* Desc */}
          <p className="font-dm mb-6" style={{ fontSize: 12, color: "rgba(249,250,251,0.45)", lineHeight: 1.7 }}>
            {options[mobileOpen].desc}
          </p>

          {/* Accordion label */}
          <p className="font-dm uppercase mb-3" style={{ fontSize: 8, letterSpacing: 1.5, color: "rgba(249,250,251,0.3)" }}>
            O QUE VOCÊ BUSCA?
          </p>

          {/* Accordion items */}
          <div className="flex flex-col gap-2">
            {options.map((opt, i) => {
              const isOpen = mobileOpen === i;
              return (
                <div
                  key={i}
                  style={{
                    borderRadius: 8,
                    border: `1px solid ${isOpen ? "rgba(34,211,238,0.25)" : "rgba(34,211,238,0.1)"}`,
                    overflow: "hidden",
                    background: isOpen ? "rgba(34,211,238,0.05)" : "transparent",
                  }}
                >
                  <button
                    onClick={() => setMobileOpen(i)}
                    className="flex items-center gap-2.5 w-full text-left"
                    style={{ padding: "12px 14px" }}
                  >
                    <span
                      className="font-syncopate font-bold shrink-0"
                      style={{ fontSize: 10, color: isOpen ? opt.accent : "rgba(249,250,251,0.25)" }}
                    >
                      {opt.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-dm font-medium" style={{ fontSize: 12, color: "#F9FAFB" }}>
                        {opt.eyebrow}
                      </p>
                      <p className="font-dm" style={{ fontSize: 10, color: "rgba(249,250,251,0.35)" }}>
                        {opt.tooltip.replace(/^\d+ — /, "")}
                      </p>
                    </div>
                    <span
                      className="shrink-0 transition-transform duration-200"
                      style={{ fontSize: 14, color: "rgba(249,250,251,0.3)", transform: isOpen ? "rotate(90deg)" : "none" }}
                    >
                      ›
                    </span>
                  </button>

                  <div
                    className="transition-all duration-300 overflow-hidden"
                    style={{ maxHeight: isOpen ? 160 : 0, opacity: isOpen ? 1 : 0 }}
                  >
                    <div style={{ padding: "0 14px 14px" }}>
                      <p className="font-dm mb-3" style={{ fontSize: 11, color: "rgba(249,250,251,0.4)", lineHeight: 1.6 }}>
                        {opt.desc}
                      </p>
                      <MobileCtaButton opt={opt} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile trust bar */}
          <div className="flex flex-wrap items-center gap-3 mt-8 pt-4" style={{ borderTop: "1px solid rgba(34,211,238,0.1)" }}>
            {["Prazo garantido em contrato", "100% Light Steel Frame", "Goiânia, GO e DF", "Empresa registrada"].map(
              (item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#22D3EE" }} />
                  <span className="font-dm" style={{ fontSize: 8, color: "rgba(249,250,251,0.35)" }}>{item}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
