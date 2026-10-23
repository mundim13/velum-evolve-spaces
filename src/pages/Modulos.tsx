import { lazy, Suspense, useCallback, useMemo, useReducer, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SeoHead from "@/components/SeoHead";
import { Configurador, NOME_FACE, type Etapa } from "@/components/modulos/Configurador";
import { PainelPreco } from "@/components/modulos/PainelPreco";
import type { ModoVista } from "@/components/modulos/Showroom";
import { CONFIG_INICIAL, reduzir } from "@/lib/modulos-3x6/estado";
import { calcularPreco } from "@/lib/modulos-3x6/preco";
import type { FaceEsquadria } from "@/lib/modulos-3x6/tipos";

// O three.js só baixa depois que a página (texto, escolhas e preço) já está na tela.
const Showroom = lazy(() => import("@/components/modulos/Showroom"));

const VISTA_DA_ETAPA: Record<Etapa, ModoVista> = {
  atalho: "dentro",
  banheiro: "dentro",
  cozinha: "dentro",
  vivencia: "dentro",
  esquadria: "fora",
  fachada: "fora",
};

function CarregandoShowroom() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "#0D0D0D" }}>
      <span className="font-syncopate font-bold uppercase animate-pulse" style={{ fontSize: 10, letterSpacing: 3, color: "rgba(34,211,238,0.7)" }}>
        Montando o módulo
      </span>
    </div>
  );
}

export default function Modulos() {
  const [config, despachar] = useReducer(reduzir, CONFIG_INICIAL);
  const [etapa, setEtapa] = useState<Etapa>("atalho");
  // Abre por fora, girando devagar; as etapas de interior trocam para a vista em corte.
  const [modo, setModo] = useState<ModoVista>("fora");
  const resultado = useMemo(() => calcularPreco(config), [config]);

  const irPara = useCallback((e: Etapa) => {
    setEtapa(e);
    setModo(VISTA_DA_ETAPA[e]);
  }, []);

  const escolherFace = useCallback((face: FaceEsquadria) => despachar({ tipo: "esquadria", face }), []);

  return (
    <div className="min-h-screen font-dm" style={{ background: "#0D0D0D", color: "#F9FAFB" }}>
      <SeoHead
        title="Módulo 3x6 · Showroom 3D"
        description="Monte o seu módulo 3x6 da Velum em 3D: banheiro, cozinha, vivência, esquadria e fachada, com o preço mudando ao vivo. A partir de R$ 62 mil."
        path="/modulos"
      />
      <Navbar />

      <main id="main" className="pt-[60px] lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:h-screen">
        <section
          aria-label="Módulo 3x6 em 3D"
          // No celular o 3D fica fixo no topo, com 55% da altura da tela (o CSS global usa overflow-x: hidden, que anula o sticky).
          className="fixed top-[60px] inset-x-0 z-30 h-[55svh] lg:static lg:h-[calc(100vh-60px)]"
        >
          <div className="relative w-full h-full">
            <Suspense fallback={<CarregandoShowroom />}>
              <Showroom
                config={config}
                modo={modo}
                foco={etapa === "esquadria" || etapa === "fachada" ? config.esquadria.face : "testada"}
                escolhendoFace={etapa === "esquadria"}
                onEscolherFace={escolherFace}
              />
            </Suspense>

            <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
              <span
                className="font-dm"
                style={{ fontSize: 11, color: "rgba(249,250,251,0.75)", background: "rgba(13,13,13,0.6)", padding: "4px 8px", borderRadius: 4 }}
              >
                3,00 × {config.comprimento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} m · {3 * config.comprimento} m²
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

            {etapa === "esquadria" && (
              <p
                className="absolute bottom-3 left-3 right-3 text-center font-dm pointer-events-none"
                style={{ fontSize: 12, color: "#F9FAFB", background: "rgba(13,13,13,0.7)", padding: "6px 10px", borderRadius: 6 }}
              >
                Toque numa face destacada · agora: {NOME_FACE[config.esquadria.face].toLowerCase()}
              </p>
            )}
          </div>
        </section>

        <section className="mt-[55svh] lg:mt-0 px-4 pt-6 pb-36 lg:pb-0 lg:pt-8 lg:px-6 lg:h-[calc(100vh-60px)] lg:overflow-y-auto lg:flex lg:flex-col" style={{ background: "#0A0A0A" }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
            <div style={{ width: 16, height: 1, background: "#22D3EE" }} />
            <span className="font-syncopate font-bold uppercase" style={{ fontSize: 10, letterSpacing: 2, color: "#22D3EE" }}>
              Showroom 3D
            </span>
          </div>
          <h1 className="font-syncopate font-bold uppercase" style={{ fontSize: 28, lineHeight: 1, color: "#F9FAFB" }}>
            Módulo 3x6
          </h1>
          <p className="font-dm" style={{ fontSize: 14, color: "rgba(249,250,251,0.55)", lineHeight: 1.6, margin: "10px 0 20px" }}>
            Uma caixa, mil vidas. Monte banheiro, cozinha e vivência, escolha a porta e a fachada e veja o preço mudar na hora.
            A partir de R$ 62 mil.
          </p>

          <Configurador config={config} etapa={etapa} onEtapa={irPara} despachar={despachar} />

          <div className="hidden lg:block h-6 shrink-0" />
          <div className="lg:sticky lg:bottom-0 lg:-mx-6">
            <PainelPreco resultado={resultado} />
          </div>
        </section>
      </main>
    </div>
  );
}
