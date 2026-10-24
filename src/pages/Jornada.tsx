import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import SeoHead from "@/components/SeoHead";
import {
  CHECKLIST,
  CLIENTE,
  CONFIG_VENDIDA,
  DIAS_TOTAIS,
  DURACAO,
  ETAPAS,
  INSTALACAO,
  MONTAGEM,
  T,
  diaEm,
  etapaEm,
  suave,
  trecho,
} from "@/components/jornada/roteiro";
import { calcularPreco, formatarReais } from "@/lib/modulos-3x6/preco";

// O three.js só baixa depois que o painel já está na tela.
const Cena = lazy(() => import("@/components/jornada/Cena"));

const COR = {
  fundo: "#F3F1ED",
  cartao: "#FFFFFF",
  borda: "#E4E0D8",
  texto: "#15171A",
  suave: "#6B6F76",
  apagado: "#A3A6AB",
  ciano: "#22D3EE",
  cianoEscuro: "#0E7490",
  cianoClaro: "#ECFEFF",
  escuro: "#0D0D0D",
};

/** Data de início da obra para os chips do topo (ilustrativa). */
const INICIO = new Date(2026, 10, 3);
const dataDoDia = (dia: number) => {
  const d = new Date(INICIO);
  d.setDate(d.getDate() + dia - 1);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(/\./g, "");
};

const parametros = () => new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");

type JanelaGravacao = Window & { __quadro?: (t: number) => Promise<void>; __avancar?: (t: number) => void; __pronto?: boolean };

/* ----------------------------------------------------------------------------------------------
 * Peças do painel
 * -------------------------------------------------------------------------------------------- */

function Cartao({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-[10px] ${className}`} style={{ background: COR.cartao, border: `1px solid ${COR.borda}`, ...style }}>
      {children}
    </div>
  );
}

function Rotulo({ children }: { children: ReactNode }) {
  return (
    <span className="font-dm font-medium uppercase" style={{ fontSize: 10, letterSpacing: 1.4, color: COR.apagado }}>
      {children}
    </span>
  );
}

function Chip({ children, destaque }: { children: ReactNode; destaque?: boolean }) {
  return (
    <span
      className="font-dm inline-flex items-center gap-1.5 whitespace-nowrap"
      style={{
        fontSize: 12,
        padding: "5px 10px",
        borderRadius: 7,
        border: `1px solid ${destaque ? COR.ciano : COR.borda}`,
        background: destaque ? COR.cianoClaro : COR.cartao,
        color: COR.texto,
      }}
    >
      {children}
    </span>
  );
}

function Barra({ valor, cor = COR.ciano, altura = 5 }: { valor: number; cor?: string; altura?: number }) {
  return (
    <div style={{ height: altura, borderRadius: altura, background: "#EEEBE5", overflow: "hidden" }}>
      <div style={{ width: `${Math.round(valor * 100)}%`, height: "100%", background: cor, borderRadius: altura }} />
    </div>
  );
}

function Marca({ estado }: { estado: "feito" | "atual" | "pendente" }) {
  if (estado === "feito")
    return (
      <span className="inline-flex items-center justify-center shrink-0" style={{ width: 18, height: 18, borderRadius: 9, background: COR.escuro }}>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M2 5.2 4.1 7.2 8 3" stroke={COR.ciano} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  return (
    <span
      className={`inline-block shrink-0 ${estado === "atual" ? "animate-pulse" : ""}`}
      style={{
        width: 18,
        height: 18,
        borderRadius: 9,
        border: `2px solid ${estado === "atual" ? COR.ciano : COR.borda}`,
        background: estado === "atual" ? COR.cianoClaro : "transparent",
      }}
    />
  );
}

function Logo() {
  return (
    <div>
      <div className="font-syncopate font-bold uppercase" style={{ fontSize: 20, letterSpacing: 5, color: COR.texto, lineHeight: 1 }}>
        Velum
      </div>
      <div className="font-dm" style={{ fontSize: 11, color: COR.suave, marginTop: 6 }}>
        Jornada do módulo
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Blocos que mudam com a etapa
 * -------------------------------------------------------------------------------------------- */

function Pedido() {
  return (
    <Cartao className="p-3">
      <div className="flex items-center justify-between">
        <Rotulo>Pedido {CLIENTE.pedido}</Rotulo>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: COR.ciano }} />
      </div>
      <div className="font-dm font-medium" style={{ fontSize: 14, color: COR.texto, marginTop: 6 }}>
        {CLIENTE.nome}
      </div>
      <div className="font-dm" style={{ fontSize: 12, color: COR.suave, marginTop: 2 }}>
        {CLIENTE.bairro} · {CLIENTE.cidade}
      </div>
      <div className="font-dm" style={{ fontSize: 12, color: COR.texto, marginTop: 8 }}>
        Academia 3x6 · 18 m²
      </div>
      <div className="font-dm" style={{ fontSize: 11, color: COR.suave, marginTop: 2 }}>
        Ao lado da casa existente
      </div>
    </Cartao>
  );
}

function ListaEtapas({ t, onIr }: { t: number; onIr: (t: number) => void }) {
  const { indice, entregue } = etapaEm(t);
  return (
    <div className="flex flex-col gap-1">
      {ETAPAS.map((e, i) => {
        const estado = entregue || i < indice ? "feito" : i === indice ? "atual" : "pendente";
        return (
          <button
            key={e.id}
            type="button"
            onClick={() => onIr(e.t0 + 0.01)}
            className="flex items-center gap-2.5 text-left font-dm"
            style={{
              padding: "7px 8px",
              borderRadius: 8,
              background: estado === "atual" ? COR.cianoClaro : "transparent",
              border: `1px solid ${estado === "atual" ? "rgba(34,211,238,0.5)" : "transparent"}`,
            }}
          >
            <Marca estado={estado} />
            <span className="flex-1" style={{ fontSize: 12.5, color: estado === "pendente" ? COR.suave : COR.texto, fontWeight: estado === "atual" ? 500 : 400 }}>
              {e.nome}
            </span>
            <span style={{ fontSize: 10.5, color: COR.apagado, fontVariantNumeric: "tabular-nums" }}>
              {e.dia0 === e.dia1 ? `D${e.dia0}` : `D${e.dia0}–${e.dia1}`}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function LinhaItem({ nome, valor, direita }: { nome: string; valor?: number; direita?: ReactNode }) {
  return (
    <div className="font-dm" style={{ padding: "7px 0", borderBottom: `1px solid #F0EDE7` }}>
      <div className="flex items-center justify-between gap-2" style={{ fontSize: 12.5 }}>
        <span style={{ color: COR.texto }}>{nome}</span>
        <span style={{ color: COR.suave, fontVariantNumeric: "tabular-nums", fontSize: 11.5 }}>{direita}</span>
      </div>
      {valor !== undefined && (
        <div style={{ marginTop: 5 }}>
          <Barra valor={valor} cor={valor >= 1 ? COR.escuro : COR.ciano} altura={4} />
        </div>
      )}
    </div>
  );
}

function Composicao() {
  const resultado = useMemo(() => calcularPreco(CONFIG_VENDIDA), []);
  return (
    <>
      <CabecalhoCartao titulo="Composição do pedido" nota="Tabela Velum" />
      {resultado.itens.map((i) => (
        <LinhaItem key={i.id} nome={i.nome} direita={i.venda ? formatarReais(i.venda) : "incluso"} />
      ))}
      <div className="flex justify-between font-dm" style={{ marginTop: 10, fontSize: 13, color: COR.texto, fontWeight: 500 }}>
        <span>Total</span>
        <span>{formatarReais(resultado.total)}</span>
      </div>
    </>
  );
}

function CabecalhoCartao({ titulo, nota }: { titulo: string; nota?: string }) {
  return (
    <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
      <span className="font-dm font-medium" style={{ fontSize: 13, color: COR.texto }}>
        {titulo}
      </span>
      {nota && (
        <span className="font-dm" style={{ fontSize: 10.5, color: COR.cianoEscuro, background: COR.cianoClaro, padding: "2px 7px", borderRadius: 5 }}>
          {nota}
        </span>
      )}
    </div>
  );
}

function Montagem({ t }: { t: number }) {
  return (
    <>
      <CabecalhoCartao titulo="Linha de montagem" nota="Fábrica" />
      {MONTAGEM.map((m) => {
        const v = trecho(t, m.t0, m.t1);
        return <LinhaItem key={m.nome} nome={m.nome} valor={v} direita={v >= 1 ? "pronto" : `${Math.round(v * 100)}%`} />;
      })}
    </>
  );
}

function Checklist({ titulo, nota, itens, t }: { titulo: string; nota: string; itens: { nome: string; t: number }[]; t: number }) {
  return (
    <>
      <CabecalhoCartao titulo={titulo} nota={nota} />
      {itens.map((i) => {
        const ok = t >= i.t;
        return (
          <div key={i.nome} className="flex items-center gap-2.5 font-dm" style={{ padding: "8px 0", borderBottom: "1px solid #F0EDE7" }}>
            <Marca estado={ok ? "feito" : "pendente"} />
            <span style={{ fontSize: 12.5, color: ok ? COR.texto : COR.suave }}>{i.nome}</span>
          </div>
        );
      })}
    </>
  );
}

/** Mapa estilizado da rota fábrica → cliente, com o caminhão andando. */
function Rota({ t }: { t: number }) {
  const caminho = useRef<SVGPathElement>(null);
  const [ponto, setPonto] = useState({ x: 30, y: 128 });
  const u = suave(trecho(t, T.viagem[0], T.viagem[1]));
  const km = CONFIG_VENDIDA.entrega.km ?? 10;
  useEffect(() => {
    const p = caminho.current;
    if (!p) return;
    const q = p.getPointAtLength(p.getTotalLength() * u);
    setPonto({ x: q.x, y: q.y });
  }, [u]);
  const estado = t < T.icar[0] ? "Aguardando içamento" : t < T.viagem[0] ? "Carregando na doca" : u < 1 ? "Em trânsito" : "Chegou ao terreno";
  return (
    <>
      <CabecalhoCartao titulo="Rota de entrega" nota={`${km} km · frete incluso`} />
      <svg viewBox="0 0 260 160" className="w-full" style={{ background: "#F7F5F1", borderRadius: 8, marginTop: 4 }} aria-label="Mapa da rota">
        {[30, 70, 110, 150].map((y) => (
          <path key={y} d={`M0 ${y} H260`} stroke="#ECE8E1" strokeWidth="1" />
        ))}
        {[40, 100, 160, 220].map((x) => (
          <path key={x} d={`M${x} 0 V160`} stroke="#ECE8E1" strokeWidth="1" />
        ))}
        <path d="M20 30 C70 20 90 70 130 60 S210 30 245 45" stroke="#E0DBD2" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path ref={caminho} d="M30 128 C70 125 80 92 120 96 S190 70 230 38" stroke="#D5D0C7" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M30 128 C70 125 80 92 120 96 S190 70 230 38" stroke={COR.ciano} strokeWidth="4" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${u} 1`} />
        <circle cx="30" cy="128" r="6" fill={COR.escuro} />
        <circle cx="230" cy="38" r="6" fill="#fff" stroke={COR.escuro} strokeWidth="2.5" />
        <circle cx={ponto.x} cy={ponto.y} r="7" fill={COR.ciano} stroke="#fff" strokeWidth="2.5" />
        <text x="40" y="146" fontSize="10" fill={COR.suave} fontFamily="DM Sans">
          Fábrica · Aparecida de Goiânia
        </text>
        <text x="250" y="24" fontSize="10" fill={COR.suave} textAnchor="end" fontFamily="DM Sans">
          {CLIENTE.nome} · Goiânia
        </text>
      </svg>
      <div className="flex justify-between font-dm" style={{ marginTop: 10, fontSize: 12 }}>
        <span style={{ color: COR.suave }}>{estado}</span>
        <span style={{ color: COR.texto, fontVariantNumeric: "tabular-nums" }}>{Math.round(km * u)} / {km} km</span>
      </div>
      <div style={{ marginTop: 6 }}>
        <Barra valor={u} />
      </div>
    </>
  );
}

function CartaoEtapa({ t }: { t: number }) {
  const { etapa, entregue } = etapaEm(t);
  let conteudo: ReactNode;
  if (entregue || etapa.id === "instalacao") conteudo = <Checklist titulo="Instalação no terreno" nota="Equipe Velum" itens={INSTALACAO} t={t} />;
  else if (etapa.id === "projeto") conteudo = <Composicao />;
  else if (etapa.id === "qualidade") conteudo = <Checklist titulo="Controle de qualidade" nota="Vistoria" itens={CHECKLIST} t={t} />;
  else if (etapa.id === "carregamento" || etapa.id === "transporte") conteudo = <Rota t={t} />;
  else conteudo = <Montagem t={t} />;
  return <Cartao className="p-3.5">{conteudo}</Cartao>;
}

/** Cronograma em barras (gantt) com a linha do dia atual. */
function Cronograma({ t }: { t: number }) {
  const dia = diaEm(t);
  const { indice, entregue } = etapaEm(t);
  const x = (d: number) => ((d - 1) / DIAS_TOTAIS) * 100;
  return (
    <Cartao className="p-3.5">
      <CabecalhoCartao titulo="Cronograma" nota={`${DIAS_TOTAIS} dias`} />
      <div className="relative" style={{ marginTop: 8 }}>
        {ETAPAS.map((e, i) => {
          const feito = entregue || i < indice;
          const atual = !entregue && i === indice;
          return (
            <div key={e.id} className="relative" style={{ height: 13, marginBottom: 4 }}>
              <div
                style={{
                  position: "absolute",
                  left: `${x(e.dia0)}%`,
                  width: `${Math.max(2.5, x(e.dia1 + 1) - x(e.dia0))}%`,
                  top: 2,
                  height: 9,
                  borderRadius: 3,
                  background: feito ? COR.escuro : atual ? COR.ciano : "#E9E5DE",
                }}
              />
            </div>
          );
        })}
        <div style={{ position: "absolute", top: -4, bottom: -2, left: `${x(dia + 0.5)}%`, width: 1.5, background: COR.cianoEscuro }} />
      </div>
      <div className="flex justify-between font-dm" style={{ fontSize: 10.5, color: COR.apagado, marginTop: 4 }}>
        <span>D1</span>
        <span>D20</span>
        <span>D{DIAS_TOTAIS}</span>
      </div>
    </Cartao>
  );
}

function Indicador({ titulo, valor, unidade, nota, barra }: { titulo: string; valor: string; unidade?: string; nota: string; barra?: number }) {
  return (
    <Cartao className="p-3 flex flex-col justify-between" style={{ minHeight: 86 }}>
      <Rotulo>{titulo}</Rotulo>
      <div className="font-dm" style={{ color: COR.texto, marginTop: 4 }}>
        <span style={{ fontSize: 22, fontWeight: 500, fontVariantNumeric: "tabular-nums", letterSpacing: -0.3 }}>{valor}</span>
        {unidade && <span style={{ fontSize: 12, color: COR.suave, marginLeft: 4 }}>{unidade}</span>}
      </div>
      {barra !== undefined ? (
        <div style={{ marginTop: 6 }}>
          <Barra valor={barra} altura={4} />
        </div>
      ) : (
        <span className="font-dm" style={{ fontSize: 11, color: COR.suave, marginTop: 2 }}>
          {nota}
        </span>
      )}
    </Cartao>
  );
}

function Indicadores({ t, compacto = false }: { t: number; compacto?: boolean }) {
  const dia = diaEm(t);
  const { indice, entregue } = etapaEm(t);
  const total = useMemo(() => calcularPreco(CONFIG_VENDIDA).total, []);
  const progresso = entregue ? 1 : dia / DIAS_TOTAIS;
  return (
    <>
      <Indicador titulo="Progresso geral" valor={`${Math.round(progresso * 100)}`} unidade="%" nota="" barra={progresso} />
      <Indicador titulo="Prazo" valor={`${dia}`} unidade={`de ${DIAS_TOTAIS} dias`} nota={entregue ? "Entregue no prazo" : `Entrega em ${DIAS_TOTAIS - dia} dias`} />
      {!compacto && <Indicador titulo="Etapa" valor={`${entregue ? ETAPAS.length : indice + 1}`} unidade={`de ${ETAPAS.length}`} nota={entregue ? "Concluída" : ETAPAS[indice].nome} />}
      {!compacto && <Indicador titulo="Área" valor="18" unidade="m²" nota="3,00 × 6,00 × 2,90 m" />}
      <Indicador titulo="Investimento" valor={formatarReais(total)} nota="Frete incluso em Goiânia" />
    </>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Página
 * -------------------------------------------------------------------------------------------- */

export default function Jornada() {
  const p = useMemo(parametros, []);
  const gravando = p.get("gravar") === "1";
  const [vertical, setVertical] = useState(() => p.get("formato") === "vertical" || (typeof window !== "undefined" && window.innerWidth < 1024));
  const efeitos = p.get("efeitos") !== "0";
  // Formato de reels (1080 × 1920): o painel cresce para continuar legível na tela do celular.
  const escala = p.get("formato") === "vertical" ? 1.55 : 1;

  const inicio = Number(p.get("t") ?? 0) || 0;
  const tempo = useRef(inicio);
  const [t, setT] = useState(inicio);
  const [tocando, setTocando] = useState(!gravando);

  useEffect(() => {
    if (p.get("formato")) return;
    const ajustar = () => setVertical(window.innerWidth < 1024);
    window.addEventListener("resize", ajustar);
    return () => window.removeEventListener("resize", ajustar);
  }, [p]);

  // Relógio ao vivo: avança em tempo real e atualiza o painel ~12 vezes por segundo.
  useEffect(() => {
    if (gravando) return;
    let id = 0;
    let antes = performance.now();
    let ultimoPainel = 0;
    const laco = (agora: number) => {
      const dt = Math.min(0.1, (agora - antes) / 1000);
      antes = agora;
      if (tocando) {
        tempo.current += dt;
        if (tempo.current > DURACAO) tempo.current = 0;
      }
      if (agora - ultimoPainel > 80) {
        ultimoPainel = agora;
        setT(tempo.current);
      }
      id = requestAnimationFrame(laco);
    };
    id = requestAnimationFrame(laco);
    return () => cancelAnimationFrame(id);
  }, [gravando, tocando]);

  // Gravação: o script chama __quadro(t) para cada quadro, em ordem.
  useEffect(() => {
    if (!gravando) return;
    const w = window as JanelaGravacao;
    const quadro = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
    w.__quadro = async (novo: number) => {
      tempo.current = novo;
      flushSync(() => setT(novo));
      await quadro();
      w.__avancar?.(novo);
      await quadro();
    };
    w.__pronto = true;
  }, [gravando]);

  const ir = useCallback((novo: number) => {
    tempo.current = novo;
    setT(novo);
  }, []);

  // Marcos que trocam a configuração do módulo (paredes, móveis, ripado, deck).
  const marco = [T.paredes[0], T.academia, T.ripado, T.deck].map((m) => (t >= m ? 1 : 0)).join("");
  const { etapa, indice, entregue } = etapaEm(t);
  const dia = diaEm(t);
  const local = entregue || etapa.local === "cliente" ? `Terreno do cliente · ${CLIENTE.cidade}` : etapa.local === "estrada" ? "Em trânsito" : "Fábrica Velum · Aparecida de Goiânia";

  const cena = (
    <Cartao className="relative overflow-hidden h-full" style={{ background: "#E6E1D9" }}>
      <Suspense fallback={null}>
        <Cena tempo={tempo} marco={marco} gravando={gravando} afastar={vertical ? 1.35 : 1} efeitos={efeitos} />
      </Suspense>
      <div className="absolute top-3 left-3 pointer-events-none" style={{ background: "rgba(255,255,255,0.82)", padding: "8px 12px 9px", borderRadius: 8, backdropFilter: "blur(6px)", zoom: escala }}>
        <div className="font-dm" style={{ fontSize: 11, color: COR.suave }}>
          {entregue ? "Entregue" : `Etapa ${indice + 1} de ${ETAPAS.length}`}
        </div>
        <div className="font-syncopate font-bold uppercase" style={{ fontSize: vertical ? 22 : 18, letterSpacing: 1.5, color: COR.texto, marginTop: 4 }}>
          {entregue ? "Academia pronta" : etapa.nome}
        </div>
      </div>
      {/* Cartão final, para fechar o vídeo. */}
      {entregue && (
        <div
          className="absolute pointer-events-none text-center"
          style={{
            right: 16,
            bottom: vertical ? 56 : 64,
            transform: `translate(0, ${(1 - suave(trecho(t, ETAPAS[ETAPAS.length - 1].t1 + 1, ETAPAS[ETAPAS.length - 1].t1 + 2))) * 16}px)`,
            opacity: suave(trecho(t, ETAPAS[ETAPAS.length - 1].t1 + 1, ETAPAS[ETAPAS.length - 1].t1 + 2)),
            background: COR.escuro,
            color: "#fff",
            padding: "14px 22px",
            borderRadius: 12,
            whiteSpace: "nowrap",
            zoom: escala,
          }}
        >
          <div className="font-syncopate font-bold uppercase" style={{ fontSize: vertical ? 18 : 16, letterSpacing: 4 }}>
            Velum
          </div>
          <div className="font-dm" style={{ fontSize: vertical ? 15 : 14, marginTop: 6, color: "rgba(255,255,255,0.85)" }}>
            Da fábrica ao seu quintal em <span style={{ color: COR.ciano, fontWeight: 500 }}>{DIAS_TOTAIS} dias</span>
          </div>
        </div>
      )}
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 pointer-events-none">
        <span className="font-dm" style={{ fontSize: 11, color: COR.suave, background: "rgba(255,255,255,0.75)", padding: "4px 8px", borderRadius: 6 }}>
          Academia 3x6 · 3,00 × 6,00 × 2,90 m
        </span>
        {!gravando && (
          <div className="flex items-center gap-2 pointer-events-auto" style={{ background: "rgba(255,255,255,0.85)", padding: "4px 8px", borderRadius: 8 }}>
            <button type="button" onClick={() => setTocando((v) => !v)} className="font-dm" style={{ fontSize: 12, color: COR.texto, minWidth: 44 }}>
              {tocando ? "Pausar" : "Tocar"}
            </button>
            <input
              type="range"
              min={0}
              max={DURACAO}
              step={0.05}
              value={t}
              onChange={(e) => ir(Number(e.target.value))}
              aria-label="Linha do tempo"
              style={{ width: 160, accentColor: COR.ciano }}
            />
          </div>
        )}
      </div>
    </Cartao>
  );

  const resumo = (
    <Cartao className="p-3" style={{ background: "#FBFAF8" }}>
      <div className="flex items-start gap-2">
        <span className="shrink-0" style={{ width: 7, height: 7, borderRadius: 4, background: COR.ciano, marginTop: 5 }} />
        <span className="font-dm" style={{ fontSize: 12, color: COR.texto, lineHeight: 1.45 }}>
          {entregue ? "Academia instalada ao lado da casa, com deck e ligação elétrica. Chaves entregues no dia 40." : etapa.resumo}
        </span>
      </div>
    </Cartao>
  );

  const chips = (
    <>
      <Chip>
        Dia <strong style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{dia}</strong> de {DIAS_TOTAIS}
      </Chip>
      <Chip>{dataDoDia(dia)}</Chip>
      <Chip destaque>{local}</Chip>
    </>
  );

  return (
    <div className="font-dm" style={{ background: COR.fundo, color: COR.texto, minHeight: "100vh" }}>
      <SeoHead title="Jornada do módulo" description="Da fábrica ao seu quintal: acompanhe a produção, o transporte e a instalação de um módulo Velum." path="/jornada" />

      {vertical ? (
        <div className="flex flex-col gap-3 p-4" style={{ height: "100vh" }}>
          <div className="flex items-center justify-between" style={{ zoom: escala }}>
            <Logo />
            <Chip destaque>
              Dia <strong style={{ fontWeight: 600 }}>{dia}</strong> de {DIAS_TOTAIS}
            </Chip>
          </div>
          <div className="flex-1 min-h-0">{cena}</div>
          {/* No formato de reels, o painel de baixo é ampliado para ler no celular. */}
          <div className="flex flex-col gap-3" style={{ zoom: escala }}>
            {resumo}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-3">
                <Indicadores t={t} compacto />
              </div>
              <CartaoEtapa t={t} />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid h-screen" style={{ gridTemplateColumns: "248px minmax(0,1fr)" }}>
          <aside className="flex flex-col gap-4 p-4 overflow-y-auto" style={{ borderRight: `1px solid ${COR.borda}`, background: "#FAF9F6" }}>
            <Logo />
            <div className="flex flex-col gap-2">
              <Rotulo>Pedido</Rotulo>
              <Pedido />
            </div>
            <div className="flex flex-col gap-2">
              <Rotulo>Etapas</Rotulo>
              <ListaEtapas t={t} onIr={ir} />
            </div>
            <div className="mt-auto">{resumo}</div>
          </aside>

          <main className="flex flex-col gap-3 p-3 min-h-0">
            <div className="flex items-center gap-2">
              {chips}
              <div className="flex-1" />
              <div className="flex rounded-[8px] overflow-hidden" style={{ border: `1px solid ${COR.borda}`, background: COR.cartao }}>
                {["3D", "Planta", "Lateral"].map((v, i) => (
                  <span key={v} className="font-dm" style={{ fontSize: 12, padding: "5px 11px", background: i === 0 ? COR.escuro : "transparent", color: i === 0 ? "#fff" : COR.suave }}>
                    {v}
                  </span>
                ))}
              </div>
              <span className="font-dm font-medium" style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, background: COR.ciano, color: COR.escuro }}>
                Acompanhar obra
              </span>
            </div>

            <div className="grid flex-1 min-h-0 gap-3" style={{ gridTemplateColumns: "minmax(0,1fr) 300px" }}>
              {cena}
              <div className="flex flex-col gap-3 min-h-0 overflow-hidden">
                <CartaoEtapa t={t} />
                <Cronograma t={t} />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              <Indicadores t={t} />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
