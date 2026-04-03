import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoVelum from "@/assets/logo-velum-white.svg";

const Footer = () => {
  return (
    <footer id="contato" className="scroll-mt-28 relative py-20 px-4 overflow-hidden" style={{ background: '#0D1522' }}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-velum-apure/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        {/* CTAs */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white animate-fade-in-up" style={{ 
            textShadow: '0 2px 20px rgba(92, 198, 208, 0.1)' 
          }}>
            Projeto, gestão e obra em um único lugar.
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 font-light animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Prazo garantido e com preço fechado de verdade
          </p>
          <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Button
              size="lg"
              data-whatsapp="true"
              data-msg="Olá! Gostaria de solicitar um orçamento."
              className="btn-hero-primary w-full sm:w-auto h-16 px-10 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Solicitar orçamento
            </Button>
          </div>
        </div>

        {/* Credibility Badge */}
        <div className="flex items-center justify-center gap-3 mb-12 text-white/80 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="p-2 rounded-full bg-velum-apure/10">
            <Shield className="h-5 w-5 text-velum-apure" />
          </div>
          <p className="text-sm font-medium">
            Empresa registrada e normatizada por neuroarquitetura
          </p>
        </div>

        {/* Logo and Copyright */}
        <div className="text-center pt-12 border-t border-white/10">
          <img
            src={logoVelum}
            alt="VELUM · Projetar, Montar, Entregar"
            className="h-12 w-auto mx-auto mb-6 opacity-90 hover:opacity-100 transition-opacity"
            loading="lazy"
            decoding="async"
            width={120}
            height={48}
          />
          <p className="text-white/60 text-sm mb-2">
            &copy; {new Date().getFullYear()} VELUM. Todos os direitos reservados.
          </p>
          <p className="text-white/50 text-sm">Espaços que evoluem com você.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
