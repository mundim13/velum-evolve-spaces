import { cidadesComFreteIncluso, deckComPreco, formatarReais, kitMobiliaDe, pergoladoComPreco, textoFrete, type ResultadoPreco } from "./preco";
import { usoDaConfig, varianteEsquadria } from "./regras";
import { tabela, type Config, type FaceEsquadria, type Uso } from "./tipos";

/** Nome da face como a pessoa vê o módulo de frente (da testada). */
export const NOME_FACE: Record<FaceEsquadria, string> = {
  testada: "Frente (testada)",
  ladoA: "Lateral direita",
  ladoB: "Lateral esquerda",
};

export const NOME_USO: Record<Uso, string> = {
  suite: "Suíte",
  estudio: "Estúdio/kitnet",
  gourmet: "Gourmet",
  escritorio: "Escritório",
  academia: "Academia",
  brinquedoteca: "Brinquedoteca",
  loja: "Loja/consultório",
};

/** Nome da aplicação: o atalho, quando a configuração veio de um, ou o uso derivado das escolhas. */
export function nomeAplicacao(c: Config) {
  const atalho = c.atalho ? tabela.atalhos.find((a) => a.id === c.atalho) : undefined;
  if (atalho) return atalho.nome;
  const uso = usoDaConfig(c);
  return uso ? NOME_USO[uso] : "Personalizado";
}

/** Linhas "Rótulo: valor" com cada escolha, na ordem do simulador. */
export function resumoConfig(c: Config): [string, string][] {
  const t = tabela;
  const variante = varianteEsquadria(c);
  const fachada =
    c.fachada.tipo === "textura"
      ? `Textura ${t.cores.textura[c.fachada.cor].nome.toLowerCase()}`
      : `${t.fachada[c.fachada.tipo].nome} em ${t.cores.wpc[c.fachada.wpc].nome.toLowerCase()} (textura ${t.cores.textura[c.fachada.cor].nome.toLowerCase()})`;
  const kit = kitMobiliaDe(c);
  const opcionais = [
    c.extras.deck && deckComPreco(c).nome,
    c.extras.deck && c.extras.pergolado && pergoladoComPreco(c).nome,
    c.extras.fundacao && t.opcionais.fundacao.nome,
    c.extras.kitAirbnb && (usoDaConfig(c) === "suite" || usoDaConfig(c) === "estudio") && t.opcionais.kitAirbnb.nome,
  ].filter(Boolean) as string[];
  const entrega =
    c.entrega.modo === "regiao"
      ? `${c.entrega.cidade || cidadesComFreteIncluso().join(", ")} (frete incluso)`
      : c.entrega.km !== null
        ? `${c.entrega.cidade}: ${textoFrete(c.entrega.km)}`
        : `${c.entrega.cidade || "Cidade a confirmar"} (frete sob consulta)`;

  return [
    ["Aplicação", nomeAplicacao(c)],
    ["Uso do espaço", t.vivencia[c.vivencia].nome],
    ["Banheiro", t.banheiro[c.banheiro].nome],
    ["Cozinha", t.cozinha[c.cozinha].nome],
    ["Porta de vidro", `${t.esquadria[variante].nome} · ${NOME_FACE[c.esquadria.face].toLowerCase()}`],
    ["Fachada", fachada],
    ["Kit mobília", c.extras.kitMobilia && kit ? kit.nome : "Sem kit"],
    ["Opcionais", opcionais.length ? opcionais.join(", ") : "Nenhum"],
    ["Entrega", entrega],
  ];
}

export interface Contato {
  nome: string;
  telefone: string;
}

/** Só dígitos, com DDD (10 ou 11 dígitos), aceitando +55 na frente. */
export function telefoneValido(telefone: string) {
  const d = telefone.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  return d.length === 10 || d.length === 11;
}

export function nomeValido(nome: string) {
  return nome.trim().length >= 2 && nome.trim().length <= 120;
}

/** Mensagem pronta para o WhatsApp da Velum: resumo, total e o link da proposta. */
export function mensagemWhatsApp(c: Config, r: ResultadoPreco, contato: Contato, link: string | null) {
  const linhas = [
    "Olá! Montei meu módulo 3x6 no simulador da Velum.",
    "",
    ...resumoConfig(c).map(([rotulo, valor]) => `• ${rotulo}: ${valor}`),
    "",
    `Total estimado: ${formatarReais(r.total)}`,
    ...r.sobConsulta.map((s) => `${s}: sob consulta`),
  ];
  if (link) linhas.push("", `Proposta: ${link}`);
  linhas.push("", `Nome: ${contato.nome.trim()}`, `Telefone: ${contato.telefone.trim()}`);
  return linhas.join("\n");
}

/**
 * Parâmetros da função criar_proposta_simulador (Supabase), no formato que a página /proposta/:token já lê:
 * itens com descrição e valor, observações em linhas com "•".
 */
export function montarProposta(c: Config, r: ResultadoPreco, contato: Contato) {
  const resumo = resumoConfig(c);
  return {
    p_nome: contato.nome.trim(),
    p_telefone: contato.telefone.trim(),
    p_titulo: `Módulo 3x6 · ${nomeAplicacao(c)}`,
    p_descricao: [
      "Configuração montada no simulador do site da Velum.",
      resumo.map(([rotulo, valor]) => `${rotulo}: ${valor}`).join("\n"),
    ].join("\n\n"),
    p_itens: r.itens.map((i, n) => ({
      id: `${n + 1}-${i.id}`,
      description: `${i.grupo}: ${i.nome}${i.venda === 0 ? " (incluso)" : ""}${i.nota ? ` · ${i.nota}` : ""}`,
      quantity: 1,
      unit_price: i.venda,
    })),
    p_total: r.total,
    p_notas: [
      "• Estimativa gerada no simulador do site; a Velum confirma os valores antes da contratação.",
      ...r.sobConsulta.map((s) => `• ${s}: sob consulta, fora do total.`),
    ].join("\n"),
    p_configuracao: c,
  };
}
