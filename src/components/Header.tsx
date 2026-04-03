import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logoVelum from "@/assets/logo-velum-wordmark.svg";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md ${
          isScrolled
            ? "bg-background shadow-lg py-3"
            : "bg-background/90 py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="focus:outline-none focus:ring-2 focus:ring-primary-variant rounded"
            aria-label="VELUM · Projetar, Montar, Entregar"
          >
            <img
              src={logoVelum}
              alt="VELUM · Projetar, Montar, Entregar"
              className="h-9 md:h-12 w-auto"
              width={120}
              height={40}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/produtos"
              className="text-foreground hover:text-primary-variant transition-colors"
            >
              Produtos
            </Link>
            <Link
              to="/portfolio"
              className="text-foreground hover:text-primary-variant transition-colors"
            >
              Portfolio
            </Link>
            <a
              href="https://wa.me/5562999447553"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-primary inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-11 px-6"
            >
              Solicitar orçamento
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border mt-4 py-4 px-4 space-y-4">
            <Link
              to="/produtos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left py-2 text-foreground hover:text-primary-variant transition-colors"
            >
              Produtos
            </Link>
            <Link
              to="/portfolio"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-left py-2 text-foreground hover:text-primary-variant transition-colors"
            >
              Portfolio
            </Link>
            <a
              href="https://wa.me/5562999447553"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-primary inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium w-full h-11"
            >
              Solicitar orçamento
            </a>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
