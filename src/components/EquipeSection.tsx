import teamImage from "@/assets/team-velum.jpg";
import { Instagram } from "lucide-react";

const EquipeSection = () => {
  return (
    <section id="equipe" className="py-20 md:py-28 px-4 bg-foreground text-background">
      <div className="container mx-auto max-w-4xl">
        <h2 className="font-syncopate text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 tracking-wider">
          QUEM ESTÁ POR TRÁS DA VELUM
        </h2>

        <p className="font-montserrat text-lg text-center text-background/80 mb-10">
          Arquitetura, engenharia e gestão trabalhando juntas para entregar espaços com precisão, modernidade e tranquilidade.
        </p>

        {/* Team Photo */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="rounded-xl overflow-hidden shadow-velum">
            <img
              src={teamImage}
              alt="Equipe VELUM - Lucas, Catharina e Fernando"
              className="w-full h-auto object-cover"
              loading="lazy"
              decoding="async"
              width={1200}
              height={800}
            />
          </div>
        </div>

        {/* Names */}
        <p className="font-montserrat text-lg text-center text-background/90 mb-8">
          Lucas • Catharina • Fernando
        </p>

        {/* Instagram */}
        <div className="text-center">
          <a
            href="https://www.instagram.com/velum.fab/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium transition-all duration-300 hover:scale-105"
          >
            <Instagram className="w-5 h-5" />
            Siga a VELUM no Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default EquipeSection;