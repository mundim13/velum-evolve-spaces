import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ultrapocketImg from "@/assets/ultrapocket-new-1.png";
import lumEssentialImg from "@/assets/lum-essential-new-1.png";
import lumConfortImg from "@/assets/lum-confort-cover.png";
import lumFamilyImg from "@/assets/lum-family-terreo-cover.png";

const destaques = [
  {
    number: "01",
    name: "ULTRAPOCKET GOURMET",
    tagline: "Espaço gourmet compacto e funcional",
    image: ultrapocketImg,
  },
  {
    number: "02",
    name: "LÛM ESSENCIAL",
    tagline: "O módulo base do ecossistema LÛM",
    image: lumEssentialImg,
  },
  {
    number: "03",
    name: "LÛM CONFORT",
    tagline: "Conforto expandido para o dia a dia",
    image: lumConfortImg,
  },
  {
    number: "04",
    name: "LÛM FAMILY",
    tagline: "Projetado para famílias que crescem",
    image: lumFamilyImg,
  },
];

export default function LumHomeSection() {
  return (
    <section style={{ background: "#0D0D0D", padding: "80px 0", borderTop: "1px solid rgba(34,211,238,0.08)" }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div style={{ width: 16, height: 1, background: "#f97316" }} />
              <span className="font-dm uppercase" style={{ fontSize: 9, letterSpacing: 2.5, color: "#f97316" }}>
                Coletânea
              </span>
            </div>
            <h2 className="font-syncopate font-bold uppercase mb-3" style={{ fontSize: 48, lineHeight: 0.9, color: "#F9FAFB" }}>
              LÛM
            </h2>
            <p className="font-dm max-w-md" style={{ fontSize: 14, color: "rgba(249,250,251,0.4)", lineHeight: 1.7 }}>
              Módulos industrializados em Light Steel Frame. Design inteligente, entrega rápida, preço fechado.
            </p>
          </div>
          <Link
            to="/lum"
            className="inline-flex items-center gap-2 font-dm font-medium mt-6 md:mt-0 transition-all duration-200 hover:gap-3"
            style={{ fontSize: 13, color: "#f97316" }}
          >
            Ver todos os módulos <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destaques.map((m) => (
            <Link
              key={m.number}
              to="/lum"
              className="group flex flex-col overflow-hidden transition-all duration-300"
              style={{
                borderRadius: 10,
                border: "1px solid rgba(34,211,238,0.13)",
                background: "#0A0A0A",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.35)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(249,115,22,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,211,238,0.13)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Image */}
              <div style={{ overflow: "hidden" }}>
                <img
                  src={m.image}
                  alt={m.name}
                  className="transition-transform duration-500 group-hover:scale-105"
                  style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                />
              </div>

              {/* Info */}
              <div style={{ padding: "16px 18px" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-syncopate font-bold" style={{ fontSize: 10, color: "rgba(249,115,22,0.4)" }}>
                    {m.number}
                  </span>
                  <span
                    className="font-dm font-medium uppercase"
                    style={{
                      fontSize: 8,
                      letterSpacing: 1,
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: "rgba(249,115,22,0.12)",
                      color: "#f97316",
                      border: "1px solid rgba(249,115,22,0.2)",
                    }}
                  >
                    Disponível
                  </span>
                </div>
                <h3 className="font-syncopate font-bold uppercase mb-1" style={{ fontSize: 13, color: "#F9FAFB" }}>
                  {m.name}
                </h3>
                <p className="font-dm" style={{ fontSize: 11, color: "rgba(249,250,251,0.35)" }}>
                  {m.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom stats */}
        <div
          className="flex items-center justify-center gap-8 flex-wrap mt-10 pt-6"
          style={{ borderTop: "1px solid rgba(34,211,238,0.08)" }}
        >
          {[
            { value: "5", label: "Módulos disponíveis" },
            { value: "7", label: "No ecossistema total" },
            { value: "100%", label: "Light Steel Frame" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="font-syncopate font-bold" style={{ fontSize: 22, color: "#f97316" }}>
                {stat.value}
              </span>
              <span className="font-dm" style={{ fontSize: 11, color: "rgba(249,250,251,0.35)" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
