import { Link } from "react-router-dom";

const solucoesLinks = [
  { label: "Coletânea LÛM", href: "/lum" },
  { label: "Gerenciamento de obra", href: "/gerenciamento" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Viabilidade econômica", href: "/contato" },
];

const empresaLinks = [
  { label: "Quem somos", href: "/sobre" },
  { label: "Blog", href: "#" },
  { label: "Carreiras", href: "#" },
];

function SocialButton({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center transition-all duration-200 group"
      style={{
        width: 36,
        height: 36,
        border: "1px solid rgba(34,211,238,0.15)",
        borderRadius: 6,
        color: "rgba(249,250,251,0.45)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "#22D3EE";
        (e.currentTarget as HTMLElement).style.color = "#050505";
        (e.currentTarget as HTMLElement).style.borderColor = "#22D3EE";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
        (e.currentTarget as HTMLElement).style.color = "rgba(249,250,251,0.45)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,211,238,0.15)";
      }}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: "#050505", borderTop: "1px solid rgba(34,211,238,0.1)" }}>
      <div className="max-w-7xl mx-auto" style={{ padding: "48px 40px 32px" }}>
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1 — Brand */}
          <div>
            <span className="font-syncopate font-bold block mb-3" style={{ fontSize: 22, color: "#F9FAFB" }}>
              VELUM
            </span>
            <p className="font-dm mb-4" style={{ fontSize: 13, color: "rgba(249,250,251,0.45)" }}>
              Espaços que evoluem com você.
            </p>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22D3EE" }} />
              <span className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.45)" }}>
                Goiânia, GO e DF · Brasil
              </span>
            </div>
            <p className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.45)" }}>
              <a
                href="https://wa.me/5562999447553"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                (62) 99944-7553
              </a>
            </p>
            <p className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.45)" }}>
              <a href="mailto:contato@grupovelum.com" className="hover:opacity-80 transition-opacity">
                contato@grupovelum.com
              </a>
            </p>
          </div>

          {/* Col 2 — Soluções */}
          <div>
            <h4
              className="font-dm font-medium uppercase mb-4"
              style={{ fontSize: 10, letterSpacing: 1.5, color: "rgba(249,250,251,0.3)" }}
            >
              Soluções
            </h4>
            <div className="flex flex-col gap-2.5">
              {solucoesLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  to={link.href}
                  className="font-dm transition-colors duration-200 hover:text-white"
                  style={{ fontSize: 13, color: "rgba(249,250,251,0.45)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3 — Empresa */}
          <div>
            <h4
              className="font-dm font-medium uppercase mb-4"
              style={{ fontSize: 10, letterSpacing: 1.5, color: "rgba(249,250,251,0.3)" }}
            >
              Empresa
            </h4>
            <div className="flex flex-col gap-2.5">
              {empresaLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  to={link.href}
                  className="font-dm transition-colors duration-200 hover:text-white"
                  style={{ fontSize: 13, color: "rgba(249,250,251,0.45)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 4 — Social */}
          <div>
            <h4
              className="font-dm font-medium uppercase mb-4"
              style={{ fontSize: 10, letterSpacing: 1.5, color: "rgba(249,250,251,0.3)" }}
            >
              Social
            </h4>
            <div className="flex gap-2.5">
              {/* Instagram */}
              <SocialButton href="https://instagram.com/velum">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" />
                </svg>
              </SocialButton>
              {/* YouTube */}
              <SocialButton href="https://youtube.com/velum">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.35 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" />
                </svg>
              </SocialButton>
              {/* LinkedIn */}
              <SocialButton href="https://linkedin.com/company/velum">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </SocialButton>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{
            marginTop: 32,
            paddingTop: 20,
            borderTop: "1px solid rgba(34,211,238,0.08)",
          }}
        >
          <span className="font-dm" style={{ fontSize: 11, color: "rgba(249,250,251,0.25)" }}>
            &copy; 2026 VELUM. Todos os direitos reservados.
          </span>
          <span className="font-dm" style={{ fontSize: 11, color: "rgba(249,250,251,0.2)" }}>
            Arquitetura e Construção Industrializada
          </span>
        </div>
      </div>
    </footer>
  );
}
