import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logoVelum from "@/assets/logo-velum-white.svg";

const HeaderNew = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Quem Somos", href: "#quem-somos" },
    { label: "Soluções", href: "#solucoes" },
    { label: "Coletânea LÛM", href: "#coletanea-lum" },
    { label: "Portfólio", href: "#portfolio" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-velum py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-primary rounded">
          <img
            src={logoVelum}
            alt="VELUM — Projetar, Montar, Entregar"
            className="h-8 md:h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-montserrat text-sm text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
          <button
            data-whatsapp="true"
            data-msg="Olá! Gostaria de solicitar um orçamento."
            className="btn-velum-primary text-sm py-2 px-5"
          >
            Solicitar orçamento
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden bg-background/98 backdrop-blur-md border-t border-border overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-80 py-4' : 'max-h-0 py-0'
        }`}
      >
        <div className="px-4 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-montserrat text-foreground hover:text-primary transition-colors duration-200 py-3 border-b border-border/30 last:border-0"
            >
              {item.label}
            </a>
          ))}
          <button
            data-whatsapp="true"
            data-msg="Olá! Gostaria de solicitar um orçamento."
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn-velum-primary w-full text-center py-3 mt-2"
          >
            Solicitar orçamento
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderNew;