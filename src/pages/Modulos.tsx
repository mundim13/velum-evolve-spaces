import { lazy, Suspense, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SeoHead from "@/components/SeoHead";
import { Configurador, NOME_FACE, type Etapa } from "@/components/modulos/Configurador";
import { Envio } from "@/components/modulos/Envio";
import { PainelPreco } from "@/components/modulos/PainelPreco";
import type { ModoVista } from "@/components/modulos/Showroom";
import { reduzir } from "@/lib/modulos-3x6/estado";
import { carregarConfig, salvarConfig } from "@/lib/modulos-3x6/persistencia";
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
  mobilia: "dentro",
  opcionais: "fora",
  entrega: "fora",
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

const GUIA_VISTO = "velum:modulos:guia-visto";
const GIRO_VISTO = "velum:modulos:giro-visto";
const lerMarca = (chave: string) => {
  try {
    return localStorage.getItem(chave) === "1";
  } catch {
    return false;
  }
};
const gravarMarca = (chave: string) => {
  try {
    localStorage.setItem(chave, "1");
  } catch {
    // Sem armazenamento (aba anônima bloqueada): a dica volta na próxima visita, sem problema.
  }
};

/** Como funciona, para quem chega pela primeira vez: três passos e um botão para começar. */
function ComoFunciona({ onComecar }: { onComecar: () => void }) {
  const passos = [
    ["Escolha um modelo pronto", "ou comece do zero. O modelo já preenche tudo, e você ajusta o que quiser."],
    ["Ajuste passo a passo", "uso do espaço, banheiro, cozinha, porta de vidro, fachada e extras. O 3D e o preço mudam na hora."],
    ["Receba a proposta", "no fim, informe a cidade de entrega e receba a proposta com link pelo WhatsApp."],
  ];
  return (
    <section aria-label="Como funciona" style={{ border: "1px solid rgba(34,211,238,0.3)", background: "rgba(34,211,238,0.05)", borderRadius: 10, padding: 16, marginBottom: 8 }}>
      <p className="font-syncopate font-bold uppercase" style={{ fontSize: 11, letterSpacing: 2, color: "#22D3EE" }}>
        Como funciona
      </p>
      <ol className="grid gap-3" style={{ marginTop: 12 }}>
        {passos.map(([titulo, texto], i) => (
          <li key={titulo} className="flex gap-3 font-dm" style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(249,250,251,0.7)" }}>
            <span
              className="shrink-0 flex items-center justify-center font-medium"
              style={{ width: 24, height: 24, borderRadius: 999, background: "#22D3EE", color: "#050505", fontSize: 12 }}
            >
              {i + 1}
            </span>
            <span>
              <strong style={{ color: "#F9FAFB", fontWeight: 500 }}>{titulo}</strong> {texto}
            </span>
          </li>
        ))}
      </ol>
      <p className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.5)", marginTop: 12 }}>
        Dica: arraste o 3D para girar e use “Por dentro” para ver os ambientes. Suas escolhas ficam salvas neste navegador.
      </p>
      <button
        type="button"
        onClick={onComecar}
        className="w-full font-dm font-medium hover:brightness-110 transition-all"
        style={{ marginTop: 14, minHeight: 44, borderRadius: 8, fontSize: 14, background: "#22D3EE", color: "#050505" }}
      >
        Entendi, vamos começar
      </button>
    </section>
  );
}

export default function Modulos() {
  // A configuração fica guardada no navegador: quem volta depois continua de onde parou.
  const [config, despachar] = useReducer(reduzir, undefined, () => carregarConfig());
  useEffect(() => salvarConfig(config), [config]);
  const [enviando, setEnviando] = useState(false);
  const [etapa, setEtapa] = useState<Etapa>("atalho");
  const [vistas, setVistas] = useState<ReadonlySet<Etapa>>(() => new Set<Etapa>(["atalho"]));
  const [mostrarGuia, setMostrarGuia] = useState(() => !lerMarca(GUIA_VISTO));
  const [mostrarGiro, setMostrarGiro] = useState(() => !lerMarca(GIRO_VISTO));
  // Abre por fora, girando devagar; as etapas de interior trocam para a vista em corte.
  const [modo, setModo] = useState<ModoVista>("fora");
  const resultado = useMemo(() => calcularPreco(config), [config]);

  const passos = useRef<HTMLDivElement>(null);
  const irPara = useCallback((e: Etapa) => {
    setEtapa(e);
    setVistas((v) => (v.has(e) ? v : new Set([...v, e])));
    setModo(VISTA_DA_ETAPA[e]);
    // No celular o 3D e a barra de preço ficam fixos: leva o passo novo para logo abaixo do 3D.
    requestAnimationFrame(() => {
      const el = passos.current;
      if (!el || window.matchMedia("(min-width: 1024px)").matches) return;
      const topo3d = document.querySelector<HTMLElement>("[data-showroom]")?.getBoundingClientRect().bottom ?? 0;
      const delta = el.getBoundingClientRect().top - topo3d - 8;
      if (delta > 0) window.scrollBy({ top: delta, behavior: "smooth" });
    });
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
          data-showroom
          onPointerDown={() => {
            if (!mostrarGiro) return;
            setMostrarGiro(false);
            gravarMarca(GIRO_VISTO);
          }}
          // No celular o 3D fica fixo no topo, com 55% da altura da tela (o CSS global usa overflow-x: hidden, que anula o sticky).
          className="fixed top-[60px] inset-x-0 z-30 h-[55svh] lg:static lg:h-[calc(100vh-60px)]"
        >
          <div className="relative w-full h-full">
            <Suspense fallback={<CarregandoShowroom />}>
              <Showroom
                config={config}
                modo={modo}
                foco={etapa === "esquadria" || etapa === "fachada" || etapa === "opcionais" ? config.esquadria.face : "testada"}
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

            {etapa !== "esquadria" && mostrarGiro && (
              <p
                className="absolute bottom-3 left-1/2 -translate-x-1/2 font-dm pointer-events-none whitespace-nowrap"
                style={{ fontSize: 12, color: "#F9FAFB", background: "rgba(13,13,13,0.7)", padding: "6px 12px", borderRadius: 999 }}
              >
                ↔ Arraste para girar · pinça ou roda para aproximar
              </p>
            )}

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
          <div className="flex items-end justify-between gap-3">
            <h1 className="font-syncopate font-bold uppercase" style={{ fontSize: 28, lineHeight: 1, color: "#F9FAFB" }}>
              Módulo 3x6
            </h1>
            {!mostrarGuia && (
              <button type="button" onClick={() => setMostrarGuia(true)} className="font-dm shrink-0" style={{ fontSize: 12, color: "#22D3EE", minHeight: 32 }}>
                Como funciona?
              </button>
            )}
          </div>
          <p className="font-dm" style={{ fontSize: 14, color: "rgba(249,250,251,0.55)", lineHeight: 1.6, margin: "10px 0 20px" }}>
            Uma caixa, mil vidas. Escolha para que ele serve, o banheiro, a cozinha, a porta de vidro e a fachada, e veja o
            preço mudar na hora. A partir de R$ 62 mil.
          </p>

          {mostrarGuia && (
            <ComoFunciona
              onComecar={() => {
                setMostrarGuia(false);
                gravarMarca(GUIA_VISTO);
                irPara("atalho");
              }}
            />
          )}
          <div ref={passos} />
          <Configurador config={config} etapa={etapa} onEtapa={irPara} vistas={vistas} despachar={despachar} onConcluir={() => setEnviando(true)} />

          <div className="hidden lg:block h-6 shrink-0" />
          <div className="lg:sticky lg:bottom-0 lg:-mx-6">
            <PainelPreco resultado={resultado} onEnviar={() => setEnviando(true)} />
          </div>
        </section>
      </main>
      <Envio aberto={enviando} onFechar={() => setEnviando(false)} config={config} resultado={resultado} />
    </div>
  );
}
