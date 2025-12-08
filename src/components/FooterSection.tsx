import logoVelum from "@/assets/logo-velum-white.svg";
import { Shield } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-16 px-4 bg-background border-t border-border">
      <div className="container mx-auto max-w-4xl">
        {/* Credibility Badge */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="p-2 rounded-full bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <p className="font-montserrat text-sm text-muted-foreground">
            Empresa registrada e normatizada por neuroarquitetura
          </p>
        </div>

        {/* Logo and Copyright */}
        <div className="text-center">
          <img
            src={logoVelum}
            alt="VELUM — Projetar, Montar, Entregar"
            className="h-12 w-auto mx-auto mb-6 opacity-90"
          />
          <p className="font-montserrat text-muted-foreground text-sm mb-2">
            &copy; {new Date().getFullYear()} VELUM. Todos os direitos reservados.
          </p>
          <p className="font-montserrat text-muted-foreground/70 text-sm">
            Espaços que evoluem com você.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;