import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Coletânea LÛM", href: "/lum" },
  { label: "Gerenciamento", href: "/gerenciamento" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Quem somos", href: "/sobre" },
];

const mobileLinks = [
  { label: "Início", href: "/" },
  ...navLinks,
  { label: "Contato", href: "/contato" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close overlay on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 border-b"
      style={{
        height: 60,
        background: "rgba(8,21,18,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "rgba(0,212,180,0.13)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-full">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <span
            className="font-syne font-extrabold text-[1.25rem] text-velum-text"
            style={{ letterSpacing: "0.12em" }}
          >
            VELUM
          </span>
        </Link>

        {/* Desktop — center links */}
        <div className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className="relative font-dm text-[0.8125rem] font-medium transition-colors duration-200"
                style={{ color: isActive ? "#00D4B4" : "rgba(237,245,243,0.6)" }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = "#EDF5F3";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(237,245,243,0.6)";
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop — CTA right */}
        <Link
          to="/contato"
          className="hidden lg:inline-flex items-center gap-2 px-6 py-2 rounded-full font-dm font-medium text-sm transition-colors duration-200 hover:brightness-110"
          style={{ background: "#00D4B4", color: "#081512" }}
        >
          Falar com especialista
        </Link>

        {/* Mobile — hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden flex flex-col justify-center gap-[5px] w-7 h-7"
          aria-label="Abrir menu"
        >
          <span className="block w-full h-[2px] bg-velum-text rounded-full" />
          <span className="block w-full h-[2px] bg-velum-text rounded-full" />
          <span className="block w-5 h-[2px] bg-velum-text rounded-full" />
        </button>
      </div>

      {/* ── Mobile overlay ── */}
      <div
        className="fixed inset-0 z-[60] flex flex-col transition-all duration-300 ease-out lg:pointer-events-none"
        style={{
          background: open ? "#0B1E1B" : "transparent",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          visibility: open ? "visible" : "hidden",
        }}
      >
        {/* Decorative grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,180,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,180,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* Header row */}
        <div
          className="relative flex items-center justify-between px-6 shrink-0"
          style={{ height: 60 }}
        >
          <span
            className="font-syne font-extrabold text-[1.25rem] text-velum-text"
            style={{ letterSpacing: "0.12em" }}
          >
            VELUM
          </span>
          <button
            onClick={() => setOpen(false)}
            className="text-velum-text p-1"
            aria-label="Fechar menu"
          >
            <X size={26} strokeWidth={2} />
          </button>
        </div>

        {/* Links */}
        <div className="relative flex-1 flex flex-col items-center justify-center gap-7 px-6">
          {mobileLinks.map((link, i) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className="font-syne font-extrabold uppercase tracking-wide transition-all duration-300"
                style={{
                  fontSize: "1.5rem",
                  lineHeight: 1.2,
                  color: isActive ? "#00D4B4" : "#EDF5F3",
                  transform: open ? "translateY(0)" : `translateY(${20 + i * 8}px)`,
                  opacity: open ? 1 : 0,
                  transitionDelay: open ? `${80 + i * 40}ms` : "0ms",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* CTA fixed at bottom */}
        <div
          className="relative shrink-0 px-6 pb-8 pt-4 transition-all duration-300"
          style={{
            transform: open ? "translateY(0)" : "translateY(24px)",
            opacity: open ? 1 : 0,
            transitionDelay: open ? "360ms" : "0ms",
          }}
        >
          <a
            href="https://wa.me/5562999447553"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-full font-dm font-medium text-base transition-colors duration-200"
            style={{ background: "#00D4B4", color: "#081512" }}
          >
            <Phone size={18} />
            Falar com especialista — (62) 99944-7553
          </a>
        </div>
      </div>
    </nav>
  );
}
