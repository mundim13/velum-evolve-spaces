import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Phone } from "lucide-react";
import SkipNav from "@/components/SkipNav";

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

  useEffect(() => {
    if (open) {
      const y = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${y}px`;
    } else {
      const top = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (top) window.scrollTo(0, parseInt(top || "0") * -1);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [open]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <>
    <SkipNav />
    <nav
      className="fixed top-0 left-0 w-full z-50 border-b"
      style={{
        height: 60,
        background: "rgba(8,8,8,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "rgba(34,211,238,0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-full">
        <Link to="/" className="shrink-0">
          <span className="font-syncopate font-bold" style={{ fontSize: 16, letterSpacing: 3, color: "#F9FAFB" }}>
            VELUM
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className="font-dm font-medium uppercase transition-colors duration-200"
                style={{ fontSize: 11, letterSpacing: 1, color: isActive ? "#22D3EE" : "rgba(249,250,251,0.45)" }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#F9FAFB"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(249,250,251,0.45)"; }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <a
          href="https://wa.me/5562999447553?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Velum%20e%20gostaria%20de%20falar%20com%20um%20especialista."
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex font-dm font-medium hover:brightness-110 transition-all"
          style={{ padding: "9px 20px", borderRadius: 5, fontSize: 12, background: "#22D3EE", color: "#050505" }}
        >
          Falar com especialista
        </a>

        <button
          onClick={() => setOpen(true)}
          className="lg:hidden flex flex-col justify-center gap-[5px] w-11 h-11 items-center"
          aria-label="Abrir menu"
        >
          <span className="block w-6 h-[2px] rounded-full" style={{ background: "#F9FAFB" }} />
          <span className="block w-6 h-[2px] rounded-full" style={{ background: "#F9FAFB" }} />
          <span className="block w-4 h-[2px] rounded-full" style={{ background: "#F9FAFB" }} />
        </button>
      </div>
    </nav>

    {/* ── Mobile fullscreen menu ── */}
    {open && (
      <div
        className="fixed inset-0 flex flex-col lg:hidden"
        style={{ zIndex: 9999, background: "#050505" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 shrink-0"
          style={{ height: 60, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="font-syncopate font-bold" style={{ fontSize: 16, letterSpacing: 3, color: "#F9FAFB" }}>
            VELUM
          </span>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center"
            style={{ minWidth: 44, minHeight: 44, color: "#F9FAFB" }}
            aria-label="Fechar menu"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Links — centered group */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="flex flex-col w-full max-w-xs">
            {mobileLinks.map((link, i) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="font-syncopate font-bold uppercase block"
                  style={{
                    fontSize: 20,
                    letterSpacing: 2,
                    lineHeight: 1,
                    padding: "18px 0",
                    color: isActive ? "#22D3EE" : "rgba(255,255,255,0.7)",
                    borderBottom: i < mobileLinks.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    animation: `menuSlideIn 400ms ease both`,
                    animationDelay: `${60 + i * 50}ms`,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA bottom */}
        <div className="shrink-0 px-6" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 2rem))" }}>
          <a
            href="https://wa.me/5562999447553?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Velum%20e%20gostaria%20de%20falar%20com%20um%20especialista."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full font-dm font-medium"
            style={{
              background: "#22D3EE",
              color: "#050505",
              minHeight: 52,
              padding: "14px 24px",
              borderRadius: 16,
              fontSize: 14,
            }}
          >
            <Phone size={18} />
            Falar com especialista
          </a>
          <p className="font-dm text-center mt-3" style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
            (62) 99944-7553
          </p>
        </div>

        {/* Keyframe */}
        <style>{`
          @keyframes menuSlideIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    )}
    </>
  );
}
