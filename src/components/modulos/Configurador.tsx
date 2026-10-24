import { useEffect, useRef, useState, type ReactNode } from "react";
import { ENTREGA_REGIAO, cidadeDoCep, entregaPara, limparCep } from "@/lib/modulos-3x6/entrega";
import { reduzir, type Acao } from "@/lib/modulos-3x6/estado";
import { calcularPreco, formatarReais, kitAirbnbDisponivel, kitMobiliaDe } from "@/lib/modulos-3x6/preco";
import { NOME_FACE } from "@/lib/modulos-3x6/saida";
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

export const ETAPAS: { id: Etapa; nome: string }[] = [
  { id: "atalho", nome: "Atalhos" },
  { id: "banheiro", nome: "Banheiro" },
  { id: "cozinha", nome: "Cozinha" },
  { id: "vivencia", nome: "Vivência" },
  { id: "esquadria", nome: "Esquadria" },
  { id: "fachada", nome: "Fachada" },
  { id: "mobilia", nome: "Kit mobília" },
  { id: "opcionais", nome: "Opcionais" },
  { id: "entrega", nome: "Entrega" },
];

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

/** Passo 9: cidade (com sugestões da tabela) ou CEP, para o frete fora de Goiânia e região. */
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
  const situacao =
    e.modo === "regiao"
      ? `Goiânia e região${e.cidade ? ` (${e.cidade})` : ""}: frete incluso.`
      : e.km !== null
        ? `${e.cidade}: ${e.km} km de Goiânia, frete de ${formatarReais(frete?.venda ?? 0)}.`
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
      <Rotulo>Onde o módulo vai ser entregue</Rotulo>
      <div className="grid gap-2">
        <Opcao
          ativo={!fora}
          titulo="Goiânia e região"
          detalhe="Frete incluso no preço"
          onClick={() => {
            setFora(false);
            setCidade("");
            setCep("");
            despachar({ tipo: "entrega", valor: ENTREGA_REGIAO });
          }}
        />
        <Opcao ativo={fora} titulo="Outra cidade" detalhe={`Frete de R$ ${tabela.opcionais.freteKm.vendaPorKm} por km a partir de Goiânia`} onClick={() => setFora(true)} />
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

/** Barra de passos com rolagem horizontal; o degradê na borda direita indica que há mais passos. */
function BarraEtapas({ etapa, onEtapa }: { etapa: Etapa; onEtapa: (e: Etapa) => void }) {
  const barra = useRef<HTMLElement>(null);
  const [temMais, setTemMais] = useState(true);
  const medir = () => {
    const b = barra.current;
    if (b) setTemMais(b.scrollLeft + b.clientWidth < b.scrollWidth - 4);
  };
  useEffect(() => {
    // O passo ativo sempre fica visível na barra.
    barra.current?.querySelector<HTMLElement>('[aria-current="step"]')?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    medir();
  }, [etapa]);
  useEffect(() => {
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  return (
    <div className="relative -mx-4">
      <nav ref={barra} onScroll={medir} aria-label="Etapas" className="flex gap-2 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: "none" }}>
        {ETAPAS.map((e, i) => {
          const ativo = e.id === etapa;
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
              <span style={{ opacity: 0.6, marginRight: 6 }}>{i + 1}</span>
              {e.nome}
            </button>
          );
        })}
      </nav>
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 bottom-1 transition-opacity duration-200"
        style={{ width: 56, opacity: temMais ? 1 : 0, background: "linear-gradient(to right, rgba(10,10,10,0), #0A0A0A 85%)" }}
      />
    </div>
  );
}

interface Props {
  config: Config;
  etapa: Etapa;
  onEtapa: (e: Etapa) => void;
  despachar: (a: Acao) => void;
  /** Último passo concluído: abre o envio para a Velum. */
  onConcluir: () => void;
}

/** Escolhas na ordem do briefing (passos 1 a 9). Cada opção mostra quanto muda no total. */
export function Configurador({ config, etapa, onEtapa, despachar, onConcluir }: Props) {
  const op = (acao: Acao) => () => despachar(acao);
  const indice = ETAPAS.findIndex((e) => e.id === etapa);
  const proxima = ETAPAS[indice + 1];
  const kit = kitMobiliaDe(config);
  const airbnb = kitAirbnbDisponivel(config);
  const alternar = (chave: "deck" | "pergolado" | "fundacao" | "kitAirbnb") => () =>
    despachar({ tipo: "opcional", chave, valor: !config.extras[chave] });

  return (
    <div>
      <BarraEtapas etapa={etapa} onEtapa={onEtapa} />

      {etapa === "atalho" && (
        <>
          <Rotulo>Comece por um atalho</Rotulo>
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
          <p className="font-dm" style={{ fontSize: 12, color: TEXTO_FRACO, marginTop: 10 }}>
            O atalho só pré-seleciona as escolhas. Depois é só ajustar.
          </p>
        </>
      )}

      {etapa === "banheiro" && (
        <>
          <Rotulo>Banheiro no fundo, junto à parede hidráulica</Rotulo>
          <div className="grid gap-2">
            {(Object.keys(tabela.banheiro) as Banheiro[]).map((b) => (
              <Opcao
                key={b}
                ativo={config.banheiro === b}
                titulo={tabela.banheiro[b].nome}
                detalhe={b === "completo" ? "Box com seixo, bancada, louças e metais" : b === "lavabo" ? "Bacia e bancada, sem box" : undefined}
                direita={<Diferenca config={config} acao={{ tipo: "banheiro", valor: b }} />}
                onClick={op({ tipo: "banheiro", valor: b })}
              />
            ))}
          </div>
        </>
      )}

      {etapa === "cozinha" && (
        <>
          <Rotulo>Cozinha colada ao banheiro</Rotulo>
          <div className="grid gap-2">
            {(Object.keys(tabela.cozinha) as Cozinha[]).map((k) => {
              const item = tabela.cozinha[k];
              return (
                <Opcao
                  key={k}
                  ativo={config.cozinha === k}
                  titulo={item.nome}
                  detalhe={"descricao" in item ? item.descricao : undefined}
                  direita={<Diferenca config={config} acao={{ tipo: "cozinha", valor: k }} />}
                  onClick={op({ tipo: "cozinha", valor: k })}
                />
              );
            })}
          </div>
        </>
      )}

      {etapa === "vivencia" && (
        <>
          <Rotulo>O que é o espaço que sobra</Rotulo>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(tabela.vivencia) as Vivencia[]).map((v) => (
              <Opcao
                key={v}
                ativo={config.vivencia === v}
                titulo={tabela.vivencia[v].nome}
                direita={<Diferenca config={config} acao={{ tipo: "vivencia", valor: v }} />}
                onClick={op({ tipo: "vivencia", valor: v })}
              />
            ))}
          </div>
          <p className="font-dm" style={{ fontSize: 12, color: TEXTO_FRACO, marginTop: 10 }}>
            O módulo aparece mobiliado; a mobília solta vira um kit opcional na próxima etapa do simulador.
          </p>
        </>
      )}

      {etapa === "esquadria" && (
        <>
          <Rotulo>Porta de correr de vidro: face e tamanho</Rotulo>
          <p className="font-dm" style={{ fontSize: 12, color: TEXTO_FRACO, marginBottom: 10 }}>
            Toque numa face do módulo ou escolha abaixo. A parede do banheiro nunca recebe vidro.
          </p>
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
        </>
      )}

      {etapa === "fachada" && (
        <>
          <Rotulo>Acabamento da fachada</Rotulo>
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
          <Rotulo>Mobília solta</Rotulo>
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
              Esta configuração (estar sem banheiro e sem cozinha) não tem kit mobília. Escolha uma aplicação para ver o kit dela.
            </p>
          )}
          <p className="font-dm" style={{ fontSize: 12, color: TEXTO_FRACO, marginTop: 10 }}>
            No 3D o módulo aparece sempre mobiliado; o kit é a mobília solta (cama, cadeiras, aparelhos).
          </p>
        </>
      )}

      {etapa === "opcionais" && (
        <>
          <Rotulo>Opcionais externos</Rotulo>
          <div className="grid gap-2">
            <Opcao
              ativo={config.extras.deck}
              titulo={tabela.opcionais.deck.nome}
              direita={<Preco valor={tabela.opcionais.deck.venda} />}
              onClick={alternar("deck")}
            />
            {config.extras.deck && (
              <Opcao
                ativo={config.extras.pergolado}
                titulo={tabela.opcionais.pergolado.nome}
                direita={<Preco valor={tabela.opcionais.pergolado.venda} />}
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
          <p className="font-dm" style={{ fontSize: 12, color: TEXTO_FRACO, marginTop: 10 }}>
            {tabela.opcionais.ligacoes.nome}: sob consulta, fora do total.
          </p>
        </>
      )}

      {etapa === "entrega" && <PassoEntrega config={config} despachar={despachar} />}

      <button
        type="button"
        onClick={() => (proxima ? onEtapa(proxima.id) : onConcluir())}
        className="w-full font-dm font-medium transition-all hover:brightness-110"
        style={{
          marginTop: 20,
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
  );
}
