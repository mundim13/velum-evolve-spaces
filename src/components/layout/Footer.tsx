import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#081512",
        borderTop: "1px solid rgba(0,212,180,0.13)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Brand */}
          <div>
            <span
              className="font-syne font-extrabold text-2xl"
              style={{ color: "#EDF5F3" }}
            >
              VELUM
            </span>
          </div>

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 font-dm"
            style={{ fontSize: 13, color: "rgba(237,245,243,0.5)" }}
          >
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: "#00D4B4" }} />
              <span>Goiânia, GO</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} style={{ color: "#00D4B4" }} />
              <a
                href="https://wa.me/5562999447553"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                (62) 99944-7553
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} style={{ color: "#00D4B4" }} />
              <a
                href="mailto:contato@grupovelum.com"
                className="hover:opacity-80 transition-opacity"
              >
                contato@grupovelum.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="mt-10 pt-6 font-dm text-center"
          style={{
            borderTop: "1px solid rgba(0,212,180,0.08)",
            fontSize: 11,
            color: "rgba(237,245,243,0.25)",
          }}
        >
          &copy; 2026 VELUM. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
