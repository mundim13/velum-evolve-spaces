import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Coletânea LÛM", href: "/lum" },
  { label: "Gerenciamento", href: "/gerenciamento" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-velum-bg/80 backdrop-blur-md border-b border-velum-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-syne font-extrabold text-xl tracking-tight text-velum-text">
            VELUM
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-dm text-sm transition-colors ${
                location.pathname === link.href
                  ? "text-velum-accent"
                  : "text-velum-text/70 hover:text-velum-text"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Desktop */}
        <Link
          to="/contato"
          className="hidden md:inline-flex items-center px-5 py-2 rounded-full bg-velum-accent text-velum-bg font-dm font-medium text-sm hover:bg-velum-lime transition-colors"
        >
          Fale conosco
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden text-velum-text"
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-velum-bg flex flex-col">
          <div className="flex items-center justify-between px-6 h-16">
            <span className="font-syne font-extrabold text-xl text-velum-text">
              VELUM
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-velum-text"
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`font-syne text-2xl font-bold transition-colors ${
                  location.pathname === link.href
                    ? "text-velum-accent"
                    : "text-velum-text hover:text-velum-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/contato"
              onClick={() => setOpen(false)}
              className="mt-4 px-8 py-3 rounded-full bg-velum-accent text-velum-bg font-dm font-medium text-base hover:bg-velum-lime transition-colors"
            >
              Fale conosco
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
