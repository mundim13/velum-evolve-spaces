import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { obras } from "@/data/obras";

export default function PortfolioPreview() {
  const destaques = obras.filter((o) => o.destaque);

  return (
    <section className="bg-velum-bg2 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <p className="font-dm text-velum-accent text-sm tracking-widest uppercase mb-3">
          Portfólio
        </p>
        <h2 className="font-syne font-extrabold text-3xl md:text-5xl text-velum-text mb-12">
          Obras que falam por nós
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {destaques.map((obra) => (
            <div
              key={obra.id}
              className="velum-glass rounded-2xl overflow-hidden group"
            >
              {/* Placeholder image area */}
              <div className="aspect-video bg-velum-bg3 flex items-center justify-center">
                <span className="font-dm text-sm text-velum-muted">
                  {obra.area}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-syne font-bold text-lg text-velum-text mb-1">
                  {obra.titulo}
                </h3>
                <p className="font-dm text-sm text-velum-muted mb-2">
                  {obra.localizacao}
                </p>
                <p className="font-dm text-sm text-velum-muted/70">
                  {obra.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 font-dm text-velum-accent hover:gap-3 transition-all"
        >
          Ver todos os projetos <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
