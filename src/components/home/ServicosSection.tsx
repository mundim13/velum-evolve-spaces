import { Link } from "react-router-dom";
import { ArrowRight, Compass, BarChart3, Hammer } from "lucide-react";

const servicos = [
  {
    icon: Compass,
    titulo: "Projeto",
    descricao:
      "Arquitetura autoral com neuroarquitetura, eficiência energética e integração ao terreno.",
    href: "/portfolio",
  },
  {
    icon: BarChart3,
    titulo: "Gestão",
    descricao:
      "Gerenciamento de obra com controle de cronograma, custos e qualidade — do planejamento à entrega.",
    href: "/gerenciamento",
  },
  {
    icon: Hammer,
    titulo: "Execução",
    descricao:
      "Construção com equipe própria, preço fechado e garantia contratual de prazo.",
    href: "/contato",
  },
];

export default function ServicosSection() {
  return (
    <section className="bg-velum-bg py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <p className="font-dm text-velum-accent text-sm tracking-widest uppercase mb-3">
          O que fazemos
        </p>
        <h2 className="font-syne font-extrabold text-3xl md:text-5xl text-velum-text mb-12">
          Projeto. Gestão. Execução.
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {servicos.map((s) => (
            <Link
              key={s.titulo}
              to={s.href}
              className="group velum-glass rounded-2xl p-8 hover:border-velum-accent/30 transition-all"
            >
              <s.icon size={28} className="text-velum-accent mb-5" />
              <h3 className="font-syne font-bold text-xl text-velum-text mb-3">
                {s.titulo}
              </h3>
              <p className="font-dm text-sm text-velum-muted leading-relaxed mb-6">
                {s.descricao}
              </p>
              <span className="inline-flex items-center gap-1 font-dm text-sm text-velum-accent group-hover:gap-2 transition-all">
                Saiba mais <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
