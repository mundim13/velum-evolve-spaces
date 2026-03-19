import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Jornada {
  id: string;
  perfil: string;
  titulo: string;
  descricao: string;
  cta: string;
  href: string;
}

const jornadas: Jornada[] = [
  {
    id: "construir",
    perfil: "Quero construir",
    titulo: "Construa com previsibilidade e design",
    descricao:
      "Projetos residenciais e comerciais do zero, com engenharia de precisão e prazo garantido.",
    cta: "Ver portfólio",
    href: "/portfolio",
  },
  {
    id: "modular",
    perfil: "Quero um espaço modular",
    titulo: "Conheça a Coletânea LÛM",
    descricao:
      "Módulos prontos de 20 a 50 m² — monte, combine e evolua seu espaço sem obra convencional.",
    cta: "Explorar módulos",
    href: "/lum",
  },
  {
    id: "gerenciar",
    perfil: "Preciso de gerenciamento",
    titulo: "Gerenciamento inteligente de obra",
    descricao:
      "Acompanhamento técnico completo: cronograma, custos e qualidade sob controle.",
    cta: "Saiba mais",
    href: "/gerenciamento",
  },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const j = jornadas[active];

  return (
    <section className="relative min-h-screen flex items-center bg-velum-bg overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-velum-bg via-velum-bg2 to-velum-bg3" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-velum-accent/5 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        {/* Tagline */}
        <p className="font-dm text-velum-accent text-sm tracking-widest uppercase mb-6">
          Engenharia &middot; Arquitetura &middot; Tecnologia
        </p>

        {/* Journey selector pills */}
        <div className="flex flex-wrap gap-3 mb-10">
          {jornadas.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActive(i)}
              className={`px-5 py-2 rounded-full font-dm text-sm transition-all ${
                active === i
                  ? "bg-velum-accent text-velum-bg font-medium"
                  : "border border-velum-border text-velum-muted hover:border-velum-accent/40 hover:text-velum-text"
              }`}
            >
              {item.perfil}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-2xl">
          <h1 className="font-syne font-extrabold text-4xl md:text-6xl lg:text-7xl text-velum-text leading-[1.05] mb-6">
            {j.titulo}
          </h1>
          <p className="font-dm text-lg md:text-xl text-velum-muted leading-relaxed mb-10 max-w-lg">
            {j.descricao}
          </p>
          <Link
            to={j.href}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-velum-accent text-velum-bg font-dm font-medium text-base hover:bg-velum-lime transition-colors group"
          >
            {j.cta}
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
