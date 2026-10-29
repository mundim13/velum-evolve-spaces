import { lazy, Suspense, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SeoHead from "@/components/SeoHead";
import { FachadaTeslink } from "@/components/modulos/franquia/FachadaTeslink";
import type { ModoVista } from "@/components/modulos/Showroom";
import { AMBIENTE_FRANQUIA, CONFIG_FRANQUIA } from "@/lib/modulos-3x6/franquia";
import { VELUM_WHATSAPP, getUtm } from "@/lib/whatsapp";

// O three.js só baixa depois que o texto da página já está na tela.
const Showroom = lazy(() => import("@/components/modulos/Showroom"));

const ITENS: [string, string][] = [
  ["Módulo", "3,00 × 6,00 m, 18 m², a mesma casca modular da Velum: replica igual em cada franquia."],
  ["Vitrine", "Vidro fora a fora de 4,50 m na lateral que dá para a rua, com o letreiro A CASA DA STARLINK por cima."],
  ["Fachada", "Grafite, logo TESLINK na frente, painel STARLINK na lateral e a seta branca da marca na quina."],
  ["Loja", "Painel Starlink retroiluminado, balcão de atendimento TESLINK, expositor de kits e antena em pedestal."],
  ["Apoio", "Banheiro e copa no fundo, atrás da divisória amadeirada, fora da vista do cliente."],
];

const mensagem = encodeURIComponent("Olá! Quero conversar sobre o módulo franquia Teslink (A Casa da Starlink).");

/** Apresentação do módulo franquia Teslink: o 3D girando com a identidade da marca, por fora e por dentro. */
export default function FranquiaTeslink() {
  const [modo, setModo] = useState<ModoVista>("fora");

  return (
    <div className="min-h-screen font-dm" style={{ background: "#0D0D0D", color: "#F9FAFB" }}>
      <SeoHead
        title="Módulo franquia Teslink · A Casa da Starlink"
        description="Módulo 3x6 da Velum para a rede Teslink, A Casa da Starlink: loja com vitrine, banheiro e copa, pronto para replicar em cada franquia."
        path="/modulos/franquia-teslink"
        noindex
      />
      <Navbar />

      <main id="main" className="pt-[60px] lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:h-screen">
        <section aria-label="Módulo franquia em 3D" className="relative h-[60svh] lg:h-[calc(100vh-60px)]">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-syncopate font-bold uppercase animate-pulse" style={{ fontSize: 10, letterSpacing: 3, color: "rgba(34,211,238,0.7)" }}>
                  Montando o módulo
                </span>
              </div>
            }
          >
            <Showroom
              config={CONFIG_FRANQUIA}
              modo={modo}
              foco={CONFIG_FRANQUIA.esquadria.face}
              escolhendoFace={false}
              onEscolherFace={() => {}}
              ambiente={AMBIENTE_FRANQUIA}
            >
              <FachadaTeslink config={CONFIG_FRANQUIA} />
            </Showroom>
          </Suspense>

          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
            <span className="font-dm" style={{ fontSize: 11, color: "rgba(249,250,251,0.75)", background: "rgba(13,13,13,0.6)", padding: "4px 8px", borderRadius: 4 }}>
              3,00 × 6,00 m · 18 m²
            </span>
            <div className="flex rounded-md overflow-hidden pointer-events-auto" style={{ border: "1px solid rgba(34,211,238,0.35)" }}>
              {(["fora", "dentro"] as ModoVista[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModo(m)}
                  aria-pressed={modo === m}
                  className="font-dm font-medium"
                  style={{
                    minHeight: 36,
                    padding: "0 12px",
                    fontSize: 12,
                    background: modo === m ? "#22D3EE" : "rgba(13,13,13,0.7)",
                    color: modo === m ? "#050505" : "rgba(249,250,251,0.8)",
                  }}
                >
                  {m === "fora" ? "Por fora" : "Por dentro"}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pt-6 pb-10 lg:pt-8 lg:px-6 lg:h-[calc(100vh-60px)] lg:overflow-y-auto" style={{ background: "#0A0A0A" }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
            <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
            <span className="font-syncopate font-bold uppercase" style={{ fontSize: 10, letterSpacing: 2, color: "#22D3EE" }}>
              Módulo franquia
            </span>
          </div>
          <h1 className="font-syncopate font-bold uppercase" style={{ fontSize: 24, lineHeight: 1.15, color: "#F9FAFB" }}>
            A Casa da Starlink
          </h1>
          <p className="font-dm" style={{ fontSize: 14, color: "rgba(249,250,251,0.6)", lineHeight: 1.6, margin: "10px 0 22px" }}>
            O módulo 3x6 da Velum vestido com a identidade da Teslink: uma loja pronta, com vitrine, atendimento, banheiro e copa,
            que chega montada e se repete igual em cada franquia.
          </p>

          <dl className="grid gap-3">
            {ITENS.map(([titulo, texto]) => (
              <div key={titulo} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(34,211,238,0.13)", background: "rgba(255,255,255,0.02)" }}>
                <dt className="font-syncopate font-bold uppercase" style={{ fontSize: 10, letterSpacing: 1.5, color: "#22D3EE" }}>
                  {titulo}
                </dt>
                <dd className="font-dm" style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(249,250,251,0.75)", marginTop: 6 }}>
                  {texto}
                </dd>
              </div>
            ))}
          </dl>

          <p className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.45)", marginTop: 14 }}>
            Arraste o 3D para girar e use “Por dentro” para ver a loja. Marcas Teslink e Starlink de seus respectivos titulares,
            usadas aqui só para apresentar a proposta.
          </p>

          <a
            href={`https://wa.me/${VELUM_WHATSAPP}?text=${mensagem}${encodeURIComponent(getUtm())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center font-dm font-medium hover:brightness-110 transition-all"
            style={{ marginTop: 18, minHeight: 48, lineHeight: "48px", borderRadius: 8, fontSize: 14, background: "#22D3EE", color: "#050505" }}
          >
            Falar com a Velum sobre a franquia
          </a>
        </section>
      </main>
    </div>
  );
}
