import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import portfolioResidencial1c from "@/assets/portfolio-residencial-1c.png";
import portfolioTerrasAlpha1 from "@/assets/portfolio-terras-alpha-1.jpg";
import portfolioJardinsPorto1 from "@/assets/portfolio-jardins-porto-1.jpg";

const destaques = [
  {
    name: "Residência Alto Padrão",
    location: "Portal do Sol Green, Goiânia - GO",
    area: "650 m²",
    methodology: "Concreto + Steel + Alvenaria",
    status: "Em execução",
    image: portfolioResidencial1c,
  },
  {
    name: "Residência Terras Alpha",
    location: "Terras Alpha 2, Senador Canedo - GO",
    area: "220 m²",
    methodology: "100% Light Steel Frame",
    status: "Entregue",
    image: portfolioTerrasAlpha1,
  },
  {
    name: "Residência Jardins Porto",
    location: "Jardins Porto, Senador Canedo - GO",
    area: "245 m²",
    methodology: "100% Light Steel Frame",
    status: "Entregue",
    image: portfolioJardinsPorto1,
  },
];

export default function PortfolioHomeSection() {
  return (
    <section style={{ background: "#0A0A0A", padding: "80px 0", borderTop: "1px solid rgba(34,211,238,0.08)" }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
              <span className="font-dm uppercase" style={{ fontSize: 9, letterSpacing: 2.5, color: "#22D3EE" }}>
                Portfólio
              </span>
            </div>
            <h2 className="font-syncopate font-bold uppercase mb-3" style={{ fontSize: 28, lineHeight: 1, color: "#F9FAFB" }}>
              NOSSAS OBRAS
            </h2>
            <p className="font-dm max-w-md" style={{ fontSize: 14, color: "rgba(249,250,251,0.4)", lineHeight: 1.7 }}>
              Projetos entregues e em execução com método, qualidade e compromisso com o prazo.
            </p>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 font-dm font-medium mt-6 md:mt-0 transition-all duration-200 hover:gap-3"
            style={{ fontSize: 13, color: "#22D3EE" }}
          >
            Ver portfólio completo <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destaques.map((item) => (
            <Link
              key={item.name}
              to="/portfolio"
              className="group overflow-hidden flex flex-col transition-all duration-300"
              style={{
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
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute top-3 left-3 font-syncopate font-bold uppercase"
                  style={{
                    fontSize: 9,
                    padding: "5px 10px",
                    borderRadius: 4,
                    background: item.status === "Entregue" ? "#22D3EE" : "rgba(34,211,238,0.85)",
                    color: "#050505",
                  }}
                >
                  {item.status}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "16px 18px" }}>
                <h3 className="font-syncopate font-bold uppercase mb-3" style={{ fontSize: 14, color: "#F9FAFB" }}>
                  {item.name}
                </h3>
                <div className="flex flex-col gap-1.5">
                  {[item.location, item.area, item.methodology].map((info, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#22D3EE", flexShrink: 0 }} />
                      <span className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.45)" }}>{info}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
