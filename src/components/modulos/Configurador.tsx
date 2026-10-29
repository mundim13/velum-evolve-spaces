import { useEffect, useRef, useState, type ReactNode } from "react";
import { ENTREGA_REGIAO, cidadeDoCep, entregaPara, limparCep } from "@/lib/modulos-3x6/entrega";
import { reduzir, type Acao } from "@/lib/modulos-3x6/estado";
import {
  calcularPreco,
  cidadesComFreteIncluso,
  deckComPreco,
  formatarReais,
  kitAirbnbDisponivel,
  kitMobiliaDe,
  pergoladoComPreco,
  textoFrete,
} from "@/lib/modulos-3x6/preco";
import { ambienteDaConfig, type Ambiente } from "@/lib/modulos-3x6/layout";
import { NOME_FACE, resumoConfig } from "@/lib/modulos-3x6/saida";
import { opcoesEsquadria } from "@/lib/modulos-3x6/regras";
import {
  cidades,
  tabela,
  type Banheiro,
  type Config,
  type CorTextura,
  type Cozinha,
  type TipoFachada,
  type TomWpc,
  type Vivencia,
} from "@/lib/modulos-3x6/tipos";

export type Etapa =
  | "atalho"
  | "banheiro"
  | "cozinha"
  | "vivencia"
  | "esquadria"
  | "fachada"
  | "mobilia"
  | "opcionais"
  | "entrega";

/**
 * Passos na ordem em que alguém pensa o módulo: primeiro para que ele serve, depois o que vai dentro,
 * a porta, o lado de fora e a entrega. Cada passo tem um nome curto (barra), uma pergunta e uma linha de ajuda.
 */
export const ETAPAS: { id: Etapa; nome: string; pergunta: string; ajuda: string }[] = [
  {
    id: "atalho",
    nome: "Modelo",
    pergunta: "Por onde começar?",
    ajuda: "Escolha um modelo pronto: ele preenche todos os passos e você ajusta o que quiser depois. Ou comece do zero.",
  },
  {
    id: "vivencia",
    nome: "Uso do espaço",
    pergunta: "Para que vai ser o módulo?",
    ajuda: "É o ambiente principal. Ele define os móveis que aparecem no 3D e o kit de mobília disponível.",
  },
  {
    id: "banheiro",
    nome: "Banheiro",
    pergunta: "Precisa de banheiro?",
    ajuda: "O banheiro fica no fundo, junto da parede hidráulica. Sem ele, o ambiente principal fica maior.",
  },
  {
    id: "cozinha",
    nome: "Cozinha",
    pergunta: "E de cozinha?",
    ajuda: "A cozinha fica ao lado do banheiro, na mesma parede hidráulica.",
  },
  {
    id: "esquadria",
    nome: "Porta de vidro",
    pergunta: "Onde fica a porta de vidro?",
    ajuda: "É a entrada e a maior abertura do módulo. Toque numa face no 3D ou escolha abaixo; os móveis se reorganizam para não bloquear o vidro.",
  },
  {
    id: "fachada",
    nome: "Fachada",
    pergunta: "Como fica por fora?",
    ajuda: "A textura lisa já está inclusa. O ripado de WPC (madeira plástica) pode ir só na frente ou em volta toda.",
  },
  {
    id: "mobilia",
    nome: "Mobília",
    pergunta: "Quer o módulo mobiliado?",
    ajuda: "O 3D mostra o módulo decorado para dar ideia do uso. O kit é a mobília solta (camas, mesas, aparelhos) e é opcional.",
  },
  {
    id: "opcionais",
    nome: "Área externa",
    pergunta: "Algo do lado de fora?",
    ajuda: "Deck, pergolado e fundação. As ligações de água, esgoto e luz são orçadas à parte, fora do total.",
  },
  {
    id: "entrega",
    nome: "Entrega",
    pergunta: "Onde vamos entregar?",
    ajuda: "O frete depende da cidade. No fim, revise o resumo e peça a proposta.",
  },
];

/** O que cada uso do espaço traz, para quem escolhe sem conhecer os nomes. */
const DESCRICAO_USO: Record<Vivencia, string> = {
  casal: "Cama de casal, criados e cabeceira amadeirada",
  solteiro: "Cama de solteiro e mesa de trabalho",
  estar: "Sofá e TV; com cozinha e sem banheiro vira espaço gourmet",
  escritorio: "Duas estações de trabalho, estante e canto de descanso",
  academia: "Cardio, peso livre e alongamento",
  brinquedoteca: "Cabaninha, mesinha, estante e cantinho de leitura",
  loja: "Vitrine, balcão com caixa e prateleiras; serve de consultório",
};

/** Como o ambiente aparece no 3D com as escolhas atuais (o estar muda com banheiro e cozinha). */
const NOME_AMBIENTE: Record<Ambiente, string> = {
  casal: "quarto de casal",
  solteiro: "quarto de solteiro",
  estar: "estar com sofá e TV (estúdio)",
  gourmet: "espaço gourmet",
  vazio: "módulo vazio, só com o acabamento",
  escritorio: "escritório",
  academia: "academia",
  brinquedoteca: "brinquedoteca",
  loja: "loja/consultório",
  franquia: "loja da franquia",
};

/** Passo do simulador onde se altera cada linha do resumo. */
const ETAPA_DO_RESUMO: Record<string, Etapa> = {
  Aplicação: "atalho",
  "Uso do espaço": "vivencia",
  Banheiro: "banheiro",
  Cozinha: "cozinha",
  "Porta de vidro": "esquadria",
  Fachada: "fachada",
  "Kit mobília": "mobilia",
  Opcionais: "opcionais",
  Entrega: "entrega",
};

export { NOME_FACE };

const ACENTO = "#22D3EE";
const TEXTO_FRACO = "rgba(249,250,251,0.5)";
const metros = (m: number) => `${m.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m`;

function Diferenca({ config, acao }: { config: Config; acao: Acao }) {
  const atual = calcularPreco(config).total;
  const novo = calcularPreco(reduzir(config, acao)).total;
  const d = novo - atual;
  if (d === 0) return null;
  return (
    <span className="font-dm tabular-nums" style={{ fontSize: 12, color: d > 0 ? "rgba(249,250,251,0.7)" : ACENTO }}>
      {d > 0 ? "+ " : "− "}
      {formatarReais(Math.abs(d))}
    </span>
  );
}

/** Preço fixo de um item liga/desliga (opcionais): sempre o valor do próprio item. */
function Preco({ valor }: { valor: number }) {
  return (
    <span className="font-dm tabular-nums" style={{ fontSize: 12, color: "rgba(249,250,251,0.7)" }}>
      + {formatarReais(valor)}
    </span>
  );
}

function Opcao({
  ativo,
  titulo,
  detalhe,
  direita,
  selo,
  onClick,
}: {
  ativo: boolean;
  titulo: string;
  detalhe?: string;
  direita?: ReactNode;
  selo?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className="w-full text-left transition-colors duration-200 flex flex-col justify-center"
      style={{
        minHeight: 56,
        padding: "10px 12px",
        borderRadius: 8,
        border: `1px solid ${ativo ? ACENTO : "rgba(34,211,238,0.13)"}`,
        background: ativo ? "rgba(34,211,238,0.08)" : "rgba(255,255,255,0.02)",
      }}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="font-dm font-medium" style={{ fontSize: 14, color: "#F9FAFB" }}>
          {titulo}
        </span>
        {direita}
      </span>
      {detalhe && (
        <span className="font-dm" style={{ fontSize: 12, color: TEXTO_FRACO, marginTop: 2 }}>
          {detalhe}
        </span>
      )}
      {selo && (
        <span
          className="font-dm self-start"
          style={{ fontSize: 10, letterSpacing: 0.5, color: ACENTO, border: `1px solid rgba(34,211,238,0.35)`, borderRadius: 4, padding: "1px 6px", marginTop: 6 }}
        >
          {selo}
        </span>
      )}
    </button>
  );
}

function Amostra({ ativo, hex, nome, onClick }: { ativo: boolean; hex: string; nome: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={ativo} className="flex flex-col items-center gap-1.5" style={{ minWidth: 64 }}>
      <span
        className="block rounded-full transition-all"
        style={{
          width: 40,
          height: 40,
          background: hex,
          boxShadow: ativo ? `0 0 0 2px #0D0D0D, 0 0 0 4px ${ACENTO}` : "inset 0 0 0 1px rgba(255,255,255,0.15)",
        }}
      />
      <span className="font-dm" style={{ fontSize: 11, color: ativo ? "#F9FAFB" : TEXTO_FRACO }}>
        {nome}
      </span>
    </button>
  );
}

function Rotulo({ children }: { children: ReactNode }) {
  return (
    <p className="font-syncopate font-bold uppercase" style={{ fontSize: 10, letterSpacing: 2, color: ACENTO, margin: "18px 0 10px" }}>
      {children}
    </p>
  );
}

/** Passo 9: cidade (com sugestões da tabela) ou CEP, para o frete fora das cidades com frete incluso. */
function PassoEntrega({ config, despachar }: { config: Config; despachar: (a: Acao) => void }) {
  const e = config.entrega;
  const [fora, setFora] = useState(e.modo === "fora" || !!e.cidade);
  const [cidade, setCidade] = useState(e.cidade);
  const [cep, setCep] = useState(e.cep);
  const [buscando, setBuscando] = useState(false);
  const [aviso, setAviso] = useState("");

  const aplicarCidade = (nome: string, cepAtual = "") => {
    if (!nome.trim()) return;
    despachar({ tipo: "entrega", valor: entregaPara(nome, cepAtual) });
    setAviso("");
  };

  useEffect(() => {
    const digitos = limparCep(cep);
    if (digitos.length !== 8 || digitos === limparCep(e.cep)) return;
    const controle = new AbortController();
    setBuscando(true);
    cidadeDoCep(digitos, controle.signal).then((achada) => {
      setBuscando(false);
      if (achada) {
        setCidade(achada);
        aplicarCidade(achada, digitos);
      } else if (!controle.signal.aborted) {
        setAviso("Não encontramos esse CEP. Digite a cidade.");
      }
    });
    return () => controle.abort();
    // A busca só dispara quando o CEP muda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep]);

  const r = calcularPreco(config);
  const frete = r.itens.find((i) => i.id === "frete");
  const inclusas = cidadesComFreteIncluso();
  const listaInclusas = `${inclusas.slice(0, -1).join(", ")} ou ${inclusas[inclusas.length - 1]}`;
  const situacao =
    e.modo === "regiao"
      ? `${e.cidade || listaInclusas}: frete incluso.`
      : e.km !== null
        ? `${e.cidade}: ${textoFrete(e.km)}.`
        : e.cidade
          ? `${e.cidade}: frete sob consulta, fora do total.`
          : "";

  const campo = {
    minHeight: 48,
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 16,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(34,211,238,0.2)",
    color: "#F9FAFB",
    width: "100%",
  } as const;

  return (
    <>
      <div className="grid gap-2">
        <Opcao
          ativo={!fora}
          titulo={listaInclusas}
          detalhe="Frete incluso no preço"
          onClick={() => {
            setFora(false);
            setCidade("");
            setCep("");
            despachar({ tipo: "entrega", valor: ENTREGA_REGIAO });
          }}
        />
        <Opcao
          ativo={fora}
          titulo="Outra cidade"
          detalhe={`Frete de R$ ${tabela.opcionais.freteKm.vendaPorKm} por km, ida e volta, a partir da fábrica`}
          onClick={() => setFora(true)}
        />
      </div>
      {fora && (
        <div className="grid gap-3" style={{ marginTop: 12 }}>
          <label className="grid gap-1.5">
            <span className="font-dm" style={{ fontSize: 12, color: TEXTO_FRACO }}>
              CEP da obra
            </span>
            <input
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00000-000"
              value={cep}
              onChange={(ev) => setCep(ev.target.value.replace(/[^\d-]/g, "").slice(0, 9))}
              className="font-dm"
              style={campo}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="font-dm" style={{ fontSize: 12, color: TEXTO_FRACO }}>
              {buscando ? "Buscando a cidade pelo CEP…" : "ou a cidade"}
            </span>
            <input
              list="cidades-entrega"
              autoComplete="address-level2"
              placeholder="Ex.: Anápolis"
              value={cidade}
              onChange={(ev) => setCidade(ev.target.value)}
              onBlur={() => aplicarCidade(cidade, limparCep(cep))}
              onKeyDown={(ev) => ev.key === "Enter" && aplicarCidade(cidade, limparCep(cep))}
              className="font-dm"
              style={campo}
            />
            <datalist id="cidades-entrega">
              {cidades.map((c) => (
                <option key={c.nome} value={`${c.nome} - ${c.uf}`} />
              ))}
            </datalist>
          </label>
        </div>
      )}
      {(aviso || situacao) && (
        <p className="font-dm" role="status" style={{ fontSize: 13, color: aviso ? "#FCA5A5" : "#F9FAFB", marginTop: 12 }}>
          {aviso || situacao}
        </p>
      )}
    </>
  );
}

/** Largura do degradê da borda direita da barra de passos e folga mínima nas bordas (px). */
const DEGRADE_BARRA = 56;
const MARGEM_BARRA = 16;

/** Barra de passos com rolagem horizontal; passos já vistos ganham ✓ e o degradê na borda indica que há mais. */
function BarraEtapas({ etapa, onEtapa, vistas }: { etapa: Etapa; onEtapa: (e: Etapa) => void; vistas: ReadonlySet<Etapa> }) {
  const barra = useRef<HTMLElement>(null);
  const [temMais, setTemMais] = useState(true);
  // O degradê só aparece enquanto o último passo não estiver inteiro na tela.
  const medir = () => {
    const b = barra.current;
    const ultimo = b?.lastElementChild;
    if (!b || !ultimo) return;
    const noFim = b.scrollLeft + b.clientWidth >= b.scrollWidth - 1;
    setTemMais(!noFim && ultimo.getBoundingClientRect().right > b.getBoundingClientRect().right - MARGEM_BARRA + 1);
  };
  useEffect(() => {
    // O passo ativo fica inteiro na tela e fora do degradê: a barra rola até ele com uma folga de cada lado.
    const b = barra.current;
    const ativo = b?.querySelector<HTMLElement>('[aria-current="step"]');
    if (!b || !ativo) return;
    const caixa = b.getBoundingClientRect();
    const botao = ativo.getBoundingClientRect();
    let alvo = b.scrollLeft;
    if (botao.right > caixa.right - DEGRADE_BARRA - 4) alvo += botao.right - (caixa.right - DEGRADE_BARRA - 4);
    if (botao.left < caixa.left + MARGEM_BARRA) alvo -= caixa.left + MARGEM_BARRA - botao.left;
    // Rolagem imediata: a suave seria cancelada pela rolagem suave da página até o passo novo (celular).
    if (alvo !== b.scrollLeft) b.scrollLeft = alvo;
    medir();
  }, [etapa]);
  useEffect(() => {
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  return (
    <div className="relative -mx-4">
      <nav ref={barra} onScroll={medir} aria-label="Etapas" className="flex gap-2 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: "none" }}>
        {ETAPAS.map((e, i) => {
          const ativo = e.id === etapa;
          const vista = !ativo && vistas.has(e.id);
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => onEtapa(e.id)}
              aria-current={ativo ? "step" : undefined}
              className="shrink-0 font-dm font-medium transition-colors"
              style={{
                minHeight: 40,
                padding: "8px 14px",
                borderRadius: 999,
                fontSize: 13,
                background: ativo ? ACENTO : "rgba(255,255,255,0.04)",
                color: ativo ? "#050505" : "rgba(249,250,251,0.7)",
                border: `1px solid ${ativo ? ACENTO : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <span style={{ opacity: vista ? 1 : 0.6, marginRight: 6, color: vista ? ACENTO : undefined }}>{vista ? "✓" : i + 1}</span>
              {e.nome}
            </button>
          );
        })}
      </nav>
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 bottom-1 transition-opacity duration-200"
        style={{ width: DEGRADE_BARRA, opacity: temMais ? 1 : 0, background: "linear-gradient(to right, rgba(10,10,10,0), #0A0A0A 85%)" }}
      />
    </div>
  );
}

/** Topo de cada passo: posição no percurso, barra de progresso, a pergunta do passo e uma linha de ajuda. */
function CabecalhoPasso({ indice }: { indice: number }) {
  const e = ETAPAS[indice];
  return (
    <div style={{ margin: "16px 0 14px" }}>
      <div className="flex items-center justify-between font-dm" style={{ fontSize: 11, color: TEXTO_FRACO }}>
        <span>
          Passo {indice + 1} de {ETAPAS.length}
        </span>
        <span>{Math.round(((indice + 1) / ETAPAS.length) * 100)}%</span>
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginTop: 6 }}>
        <div style={{ width: `${((indice + 1) / ETAPAS.length) * 100}%`, height: "100%", background: ACENTO, borderRadius: 2, transition: "width 300ms" }} />
      </div>
      <h2 className="font-syncopate font-bold uppercase" style={{ fontSize: 15, letterSpacing: 1, lineHeight: 1.3, color: "#F9FAFB", marginTop: 14 }}>
        {e.pergunta}
      </h2>
      <p className="font-dm" style={{ fontSize: 13, color: "rgba(249,250,251,0.6)", lineHeight: 1.55, marginTop: 6 }}>
        {e.ajuda}
      </p>
    </div>
  );
}

/** Como o ambiente vai aparecer com as escolhas atuais (o uso muda com banheiro e cozinha). */
function ComoFica({ config }: { config: Config }) {
  return (
    <p className="font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.7)", marginTop: 12, padding: "8px 10px", borderRadius: 6, background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.15)" }}>
      Com as escolhas de agora, o ambiente fica como <strong style={{ color: "#F9FAFB", fontWeight: 500 }}>{NOME_AMBIENTE[ambienteDaConfig(config)]}</strong>.
    </p>
  );
}

/** Resumo final, com atalho para alterar cada escolha antes de pedir a proposta. */
function Resumo({ config, onEtapa }: { config: Config; onEtapa: (e: Etapa) => void }) {
  return (
    <>
      <Rotulo>Revise antes de enviar</Rotulo>
      <dl className="grid font-dm" style={{ fontSize: 13, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
        {resumoConfig(config).map(([rotulo, valor], i) => (
          <div key={rotulo} className="flex items-start gap-3" style={{ padding: "8px 12px", background: i % 2 ? "transparent" : "rgba(255,255,255,0.02)" }}>
            <dt style={{ width: 104, flexShrink: 0, color: TEXTO_FRACO }}>{rotulo}</dt>
            <dd className="flex-1" style={{ color: "#F9FAFB" }}>
              {valor}
            </dd>
            {ETAPA_DO_RESUMO[rotulo] && ETAPA_DO_RESUMO[rotulo] !== "entrega" && (
              <button type="button" onClick={() => onEtapa(ETAPA_DO_RESUMO[rotulo])} className="font-dm" style={{ fontSize: 12, color: ACENTO, minHeight: 24 }}>
                alterar
              </button>
            )}
          </div>
        ))}
      </dl>
    </>
  );
}

interface Props {
  config: Config;
  etapa: Etapa;
  onEtapa: (e: Etapa) => void;
  /** Passos que a pessoa já abriu (marcados com ✓ na barra). */
  vistas: ReadonlySet<Etapa>;
  despachar: (a: Acao) => void;
  /** Último passo concluído: abre o envio para a Velum. */
  onConcluir: () => void;
}

/** Escolhas na ordem do briefing (passos 1 a 9). Cada opção mostra quanto muda no total. */
export function Configurador({ config, etapa, onEtapa, vistas, despachar, onConcluir }: Props) {
  const op = (acao: Acao) => () => despachar(acao);
  const indice = ETAPAS.findIndex((e) => e.id === etapa);
  const proxima = ETAPAS[indice + 1];
  const anterior = ETAPAS[indice - 1];
  const atalhoAtual = config.atalho ? tabela.atalhos.find((a) => a.id === config.atalho) : undefined;
  const kit = kitMobiliaDe(config);
  const airbnb = kitAirbnbDisponivel(config);
  const alternar = (chave: "deck" | "pergolado" | "fundacao" | "kitAirbnb") => () =>
    despachar({ tipo: "opcional", chave, valor: !config.extras[chave] });

  return (
    <div>
      <BarraEtapas etapa={etapa} onEtapa={onEtapa} vistas={vistas} />
      <CabecalhoPasso indice={indice} />

      {etapa === "atalho" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tabela.atalhos.map((a) => {
              const partes = [
                a.banheiro !== "nenhum" ? tabela.banheiro[a.banheiro as Banheiro].nome : null,
                a.cozinha !== "nenhuma" ? tabela.cozinha[a.cozinha as Cozinha].nome : null,
                tabela.vivencia[a.vivencia as Vivencia].nome,
                a.esquadria.face !== "testada" ? "esquadria lateral 3 m" : null,
              ].filter(Boolean);
              const total = calcularPreco(reduzir(config, { tipo: "atalho", id: a.id })).total;
              return (
                <Opcao
                  key={a.id}
                  ativo={config.atalho === a.id}
                  titulo={a.nome}
                  detalhe={partes.join(" + ")}
                  direita={
                    <span className="font-dm tabular-nums" style={{ fontSize: 13, color: "#F9FAFB" }}>
                      {formatarReais(total)}
                    </span>
                  }
                  onClick={op({ tipo: "atalho", id: a.id })}
                />
              );
            })}
            <Opcao
              ativo={false}
              titulo="Começar do zero"
              detalhe="Módulo vazio, você monta cada zona"
              onClick={() => {
                despachar({ tipo: "zerar" });
                onEtapa("banheiro");
              }}
            />
          </div>
          <p className="font-dm" style={{ fontSize: 12, color: atalhoAtual ? "rgba(249,250,251,0.75)" : TEXTO_FRACO, marginTop: 10 }}>
            {atalhoAtual
              ? `Modelo ${atalhoAtual.nome} aplicado: os próximos passos já estão preenchidos. Avance para conferir ou ajustar cada um.`
              : "O modelo só pré-seleciona as escolhas. Depois é só ajustar."}
          </p>
        </>
      )}

      {etapa === "banheiro" && (
        <>
          <div className="grid gap-2">
            {(Object.keys(tabela.banheiro) as Banheiro[]).map((b) => (
              <Opcao
                key={b}
                ativo={config.banheiro === b}
                titulo={tabela.banheiro[b].nome}
                detalhe={b === "completo" ? "Box com seixo, bancada, louças e metais" : b === "lavabo" ? "Bacia e bancada, sem box" : "Mais espaço para o ambiente principal"}
                direita={<Diferenca config={config} acao={{ tipo: "banheiro", valor: b }} />}
                onClick={op({ tipo: "banheiro", valor: b })}
              />
            ))}
          </div>
          <ComoFica config={config} />
        </>
      )}

      {etapa === "cozinha" && (
        <>
          <div className="grid gap-2">
            {(Object.keys(tabela.cozinha) as Cozinha[]).map((k) => {
              const item = tabela.cozinha[k];
              return (
                <Opcao
                  key={k}
                  ativo={config.cozinha === k}
                  titulo={item.nome}
                  detalhe={"descricao" in item ? item.descricao : "Sem bancada nem pia"}
                  direita={<Diferenca config={config} acao={{ tipo: "cozinha", valor: k }} />}
                  onClick={op({ tipo: "cozinha", valor: k })}
                />
              );
            })}
          </div>
          <ComoFica config={config} />
        </>
      )}

      {etapa === "vivencia" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.keys(tabela.vivencia) as Vivencia[]).map((v) => (
              <Opcao
                key={v}
                ativo={config.vivencia === v}
                titulo={tabela.vivencia[v].nome}
                detalhe={DESCRICAO_USO[v]}
                direita={<Diferenca config={config} acao={{ tipo: "vivencia", valor: v }} />}
                onClick={op({ tipo: "vivencia", valor: v })}
              />
            ))}
          </div>
          <ComoFica config={config} />
        </>
      )}

      {etapa === "esquadria" && (
        <>
          <div className="grid gap-2">
            {opcoesEsquadria(config).map((o) => {
              const ativo = config.esquadria.face === o.face && config.esquadria.tamanho === o.tamanho;
              const titulo =
                o.tamanho === "padrao"
                  ? `Padrão Cazita · ${metros(o.largura)}`
                  : o.tamanho === "parcial"
                    ? `Parcial · ${metros(o.largura)}`
                    : `Fora a fora · ${metros(o.largura)}`;
              return (
                <Opcao
                  key={`${o.face}-${o.tamanho}`}
                  ativo={ativo}
                  titulo={titulo}
                  detalhe={NOME_FACE[o.face]}
                  selo={o.variante === "fora450" || o.variante === "fora600" ? "Verga reforçada inclusa" : undefined}
                  direita={
                    o.variante === "padrao" ? (
                      <span className="font-dm" style={{ fontSize: 12, color: TEXTO_FRACO }}>
                        Inclusa
                      </span>
                    ) : (
                      <Diferenca config={config} acao={{ tipo: "esquadria", face: o.face, tamanho: o.tamanho }} />
                    )
                  }
                  onClick={op({ tipo: "esquadria", face: o.face, tamanho: o.tamanho })}
                />
              );
            })}
          </div>
          <p className="font-dm" style={{ fontSize: 12, color: TEXTO_FRACO, marginTop: 10 }}>
            A parede do fundo (banheiro e cozinha) não recebe vidro. Com a porta numa lateral, a frente vira parede cheia.
          </p>
        </>
      )}

      {etapa === "fachada" && (
        <>
          <div className="grid gap-2">
            {(["textura", "ripadoFrontal", "ripadoCompleto"] as TipoFachada[]).map((t) => (
              <Opcao
                key={t}
                ativo={config.fachada.tipo === t}
                titulo={tabela.fachada[t].nome}
                detalhe={
                  t === "textura"
                    ? "Casca lisa na cor escolhida"
                    : t === "ripadoFrontal"
                      ? `Na face da porta (${NOME_FACE[config.esquadria.face].toLowerCase()}), R$ ${tabela.fachada.ripadoFrontal.vendaM2}/m²`
                      : "As quatro faces"
                }
                direita={
                  t === "textura" ? (
                    <span className="font-dm" style={{ fontSize: 12, color: TEXTO_FRACO }}>
                      Inclusa
                    </span>
                  ) : (
                    <Diferenca config={config} acao={{ tipo: "fachada", valor: t }} />
                  )
                }
                onClick={op({ tipo: "fachada", valor: t })}
              />
            ))}
          </div>

          <Rotulo>Cor da textura</Rotulo>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(tabela.cores.textura) as CorTextura[]).map((c) => (
              <Amostra
                key={c}
                ativo={config.fachada.cor === c}
                hex={tabela.cores.textura[c].hex}
                nome={tabela.cores.textura[c].nome}
                onClick={op({ tipo: "cor", valor: c })}
              />
            ))}
          </div>

          {config.fachada.tipo !== "textura" && (
            <>
              <Rotulo>Tom do WPC</Rotulo>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(tabela.cores.wpc) as TomWpc[]).map((w) => (
                  <Amostra
                    key={w}
                    ativo={config.fachada.wpc === w}
                    hex={tabela.cores.wpc[w].hex}
                    nome={tabela.cores.wpc[w].nome}
                    onClick={op({ tipo: "wpc", valor: w })}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {etapa === "mobilia" && (
        <>
          {kit ? (
            <div className="grid gap-2">
              <Opcao
                ativo={config.extras.kitMobilia}
                titulo={kit.nome}
                detalhe={"descricao" in kit ? kit.descricao : undefined}
                direita={<Diferenca config={config} acao={{ tipo: "kitMobilia", valor: true }} />}
                onClick={op({ tipo: "kitMobilia", valor: true })}
              />
              <Opcao
                ativo={!config.extras.kitMobilia}
                titulo="Sem kit mobília"
                direita={<Diferenca config={config} acao={{ tipo: "kitMobilia", valor: false }} />}
                onClick={op({ tipo: "kitMobilia", valor: false })}
              />
            </div>
          ) : (
            <p className="font-dm" style={{ fontSize: 13, color: TEXTO_FRACO }}>
              Esta configuração (estar sem banheiro e sem cozinha) não tem kit mobília. Escolha um uso do espaço para ver o kit dele.
            </p>
          )}
        </>
      )}

      {etapa === "opcionais" && (
        <>
          <div className="grid gap-2">
            <Opcao
              ativo={config.extras.deck}
              titulo={deckComPreco(config).nome}
              detalhe="Na frente da porta principal (acompanha a face da esquadria)"
              direita={<Preco valor={deckComPreco(config).venda} />}
              onClick={alternar("deck")}
            />
            {config.extras.deck && (
              <Opcao
                ativo={config.extras.pergolado}
                titulo={pergoladoComPreco(config).nome}
                direita={<Preco valor={pergoladoComPreco(config).venda} />}
                onClick={alternar("pergolado")}
              />
            )}
            <Opcao
              ativo={config.extras.fundacao}
              titulo={tabela.opcionais.fundacao.nome}
              detalhe="Blocos de concreto sob o chassi"
              direita={<Preco valor={tabela.opcionais.fundacao.venda} />}
              onClick={alternar("fundacao")}
            />
            {airbnb && (
              <Opcao
                ativo={config.extras.kitAirbnb}
                titulo={tabela.opcionais.kitAirbnb.nome}
                detalhe={tabela.opcionais.kitAirbnb.descricao}
                direita={<Preco valor={tabela.opcionais.kitAirbnb.venda} />}
                onClick={alternar("kitAirbnb")}
              />
            )}
          </div>
        </>
      )}

      {etapa === "entrega" && (
        <>
          <PassoEntrega config={config} despachar={despachar} />
          <Resumo config={config} onEtapa={onEtapa} />
        </>
      )}

      <div className="flex gap-2" style={{ marginTop: 20 }}>
        {anterior && (
          <button
            type="button"
            onClick={() => onEtapa(anterior.id)}
            className="font-dm font-medium transition-colors hover:text-white"
            style={{ minHeight: 48, padding: "0 16px", borderRadius: 8, fontSize: 14, color: "rgba(249,250,251,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            Voltar
          </button>
        )}
        <button
          type="button"
          onClick={() => (proxima ? onEtapa(proxima.id) : onConcluir())}
          className="flex-1 font-dm font-medium transition-all hover:brightness-110"
          style={{
            minHeight: 48,
            borderRadius: 8,
            fontSize: 14,
            background: proxima ? "transparent" : ACENTO,
            color: proxima ? ACENTO : "#050505",
            border: `1px solid ${proxima ? "rgba(34,211,238,0.45)" : ACENTO}`,
          }}
        >
          {proxima ? `Próximo: ${proxima.nome}` : "Quero este módulo"}
        </button>
      </div>
    </div>
  );
}
