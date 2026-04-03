import { Instagram } from "lucide-react";
import teamImage from "@/assets/team-velum.jpg";

const TeamSection = () => {
  return (
    <section 
      id="equipe" 
      className="scroll-mt-32 py-16 md:py-24 px-4 bg-gradient-to-b from-secondary/30 to-background"
    >
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quem está por trás do <span className="gradient-text">VELUM</span>?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Arquitetura, engenharia e gestão trabalhando juntas para garantir uma construção previsível, moderna e sem dor de cabeça.
          </p>
        </div>

        {/* Team Photo */}
        <div className="relative max-w-2xl mx-auto mb-6 animate-fade-in-up">
          <div className="relative overflow-hidden rounded-2xl shadow-elevated hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
            <img
              src={teamImage}
              alt="Equipe VELUM - Lucas, Catharina e Fernando"
              className="w-full h-auto object-cover"
              loading="lazy"
              decoding="async"
              width={1200}
              height={800}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </div>

        {/* Team Names */}
        <div className="text-center mb-8">
          <p className="text-lg md:text-xl text-foreground/80 font-medium tracking-wide">
            Lucas <span className="text-primary-variant mx-2">•</span> 
            Catharina <span className="text-primary-variant mx-2">•</span> 
            Fernando
          </p>
        </div>

        {/* Instagram Link */}
        <div className="flex justify-center">
          <a 
            href="https://www.instagram.com/velum.fab/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <Instagram className="w-5 h-5" />
            <span>Siga a VELUM no Instagram</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
