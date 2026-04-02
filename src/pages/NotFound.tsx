import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center font-dm" style={{ background: "#0D0D0D" }}>
      <div className="text-center px-6">
        <span className="font-syncopate font-bold block mb-2" style={{ fontSize: 12, letterSpacing: 3, color: "#22D3EE" }}>
          ERRO
        </span>
        <h1 className="font-syncopate font-bold mb-4" style={{ fontSize: 72, color: "#F9FAFB", lineHeight: 1 }}>
          404
        </h1>
        <p className="font-dm mb-8" style={{ fontSize: 15, color: "rgba(249,250,251,0.45)" }}>
          Página não encontrada.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center font-dm font-medium transition-all duration-200 hover:brightness-110"
          style={{
            padding: "12px 24px",
            borderRadius: 6,
            fontSize: 13,
            background: "#22D3EE",
            color: "#050505",
          }}
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
