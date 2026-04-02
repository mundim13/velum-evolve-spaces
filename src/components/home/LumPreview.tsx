import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function LumPreview() {
  return (
    <section className="bg-velum-bg py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="velum-glass rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center gap-10">
          {/* Left content */}
          <div className="flex-1">
            <p className="font-dm text-velum-lime text-sm tracking-widest uppercase mb-3">
              Coletânea LÛM
            </p>
            <h2 className="font-syne font-extrabold text-3xl md:text-4xl text-velum-text mb-4">
              Espaços modulares que evoluem com você
            </h2>
            <p className="font-dm text-velum-muted leading-relaxed mb-8 max-w-md">
              Módulos de 20 a 50 m² com engenharia de precisão. Monte, combine e
              expanda, sem obra convencional.
            </p>
            <Link
              to="/lum"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-velum-lime text-velum-bg font-dm font-medium hover:bg-velum-accent transition-colors group"
            >
              Explorar módulos
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {/* Right visual placeholder */}
          <div className="flex-1 aspect-square max-w-sm w-full rounded-2xl bg-velum-bg3 flex items-center justify-center">
            <span className="font-syne text-velum-accent/30 text-6xl font-extrabold">
              LÛM
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
