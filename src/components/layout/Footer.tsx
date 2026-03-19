import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Coletânea LÛM", href: "/lum" },
  { label: "Gerenciamento", href: "/gerenciamento" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

export default function Footer() {
  return (
    <footer className="bg-velum-bg3 border-t border-velum-border">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <span className="font-syne font-extrabold text-2xl text-velum-text">
            VELUM
          </span>
          <p className="mt-4 font-dm text-sm text-velum-muted leading-relaxed max-w-xs">
            Criamos espaços com precisão, design e previsibilidade — unindo
            engenharia, arquitetura e tecnologia.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-syne font-bold text-sm text-velum-text mb-4 uppercase tracking-wider">
            Navegação
          </h4>
          <ul className="space-y-3">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="font-dm text-sm text-velum-muted hover:text-velum-accent transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Location */}
        <div>
          <h4 className="font-syne font-bold text-sm text-velum-text mb-4 uppercase tracking-wider">
            Contato
          </h4>
          <ul className="space-y-3 font-dm text-sm text-velum-muted">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-velum-accent mt-0.5 shrink-0" />
              <span>Goiânia, GO — Brasil</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-velum-accent shrink-0" />
              <a
                href="https://wa.me/5562999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-velum-accent transition-colors"
              >
                (62) 99999-9999
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-velum-accent shrink-0" />
              <a
                href="mailto:contato@velum.com.br"
                className="hover:text-velum-accent transition-colors"
              >
                contato@velum.com.br
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram size={16} className="text-velum-accent shrink-0" />
              <a
                href="https://instagram.com/velum"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-velum-accent transition-colors"
              >
                @velum
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-velum-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-dm text-xs text-velum-muted">
            &copy; {new Date().getFullYear()} VELUM. Todos os direitos reservados.
          </p>
          <p className="font-dm text-xs text-velum-muted">
            Feito com engenharia e design em Goiânia.
          </p>
        </div>
      </div>
    </footer>
  );
}
