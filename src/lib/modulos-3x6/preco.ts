import { areaRipadoFrontal, deckDe, usoDaConfig, varianteEsquadria } from "./regras";
import { tabela as tabelaPadrao, type Config, type ItemPreco, type TabelaPrecos } from "./tipos";

export interface ResultadoPreco {
  itens: ItemPreco[];
  total: number;
  /** Itens que aparecem no resumo mas ficam fora do total. */
  sobConsulta: string[];
  etiquetas: string[];
}

/** Kit mobília que se aplica ao uso atual (ou null quando o uso não tem kit, como o estar sem banheiro e cozinha). */
export function kitMobiliaDe(c: Config, t: TabelaPrecos = tabelaPadrao) {
  const uso = usoDaConfig(c);
  if (!uso) return null;
  const kit = t.kitMobilia[uso];
  return kit && (kit.disponivelEm as string[]).includes(uso) ? { uso, ...kit } : null;
}

const m = (v: number) => v.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

/** Deck da configuração atual, com nome e preço (R$ por m²). */
export function deckComPreco(c: Config, t: TabelaPrecos = tabelaPadrao) {
  const d = deckDe(c, t.opcionais.deck.profundidade);
  return {
    ...d,
    nome: `${t.opcionais.deck.nome} ${m(d.largura)} x ${m(d.profundidade)} m`,
    venda: Math.round(d.area * t.opcionais.deck.vendaM2),
    nota: `${m(d.area)} m² × R$ ${t.opcionais.deck.vendaM2}/m²`,
  };
}

/** Frete pela distância da fábrica: incluso até o limite da tabela, e cada km acima dele é cobrado. */
export function fretePorKm(km: number, t: TabelaPrecos = tabelaPadrao) {
  const f = t.opcionais.freteKm;
  const excedente = Math.max(0, km - f.kmIncluso);
  return { excedente, venda: Math.round(excedente * f.vendaPorKm) };
}

/** O kit Airbnb só aparece em suíte e estúdio. */
export function kitAirbnbDisponivel(c: Config, t: TabelaPrecos = tabelaPadrao) {
  const uso = usoDaConfig(c);
  return !!uso && (t.opcionais.kitAirbnb.disponivelEm as string[]).includes(uso);
}

/** Soma a casca com os cômodos e acabamentos escolhidos. O preço sempre sai desta soma, inclusive nos atalhos. */
export function calcularPreco(c: Config, t: TabelaPrecos = tabelaPadrao): ResultadoPreco {
  const itens: ItemPreco[] = [];
  const etiquetas: string[] = [];

  itens.push({ id: "casca", grupo: "Casca", nome: t.casca.nome, venda: t.casca.venda, nota: t.casca.descricao });

  if (c.banheiro !== "nenhum") {
    const b = t.banheiro[c.banheiro];
    itens.push({ id: `banheiro-${c.banheiro}`, grupo: "Banheiro", nome: b.nome, venda: b.venda });
  }

  if (c.cozinha !== "nenhuma") {
    const k = t.cozinha[c.cozinha];
    itens.push({ id: `cozinha-${c.cozinha}`, grupo: "Cozinha", nome: k.nome, venda: k.venda });
  }

  const v = t.vivencia[c.vivencia];
  itens.push({ id: `vivencia-${c.vivencia}`, grupo: "Vivência", nome: v.nome, venda: v.venda });

  const variante = varianteEsquadria(c);
  const e = t.esquadria[variante];
  const reforco = "vergaReforcada" in e && e.vergaReforcada;
  if (reforco) etiquetas.push("Verga reforçada inclusa");
  itens.push({
    id: `esquadria-${variante}`,
    grupo: "Esquadria",
    nome: e.nome,
    venda: e.venda,
    nota: variante === "padrao" ? "Inclusa na casca" : reforco ? "Verga reforçada inclusa" : undefined,
  });

  const f = c.fachada;
  if (f.tipo === "textura") {
    itens.push({ id: "fachada-textura", grupo: "Fachada", nome: t.fachada.textura.nome, venda: 0, nota: "Inclusa na casca" });
  } else if (f.tipo === "ripadoFrontal") {
    const area = areaRipadoFrontal(c);
    itens.push({
      id: "fachada-ripadoFrontal",
      grupo: "Fachada",
      nome: t.fachada.ripadoFrontal.nome,
      venda: Math.round(area * t.fachada.ripadoFrontal.vendaM2),
      nota: `${area.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} m² × R$ ${t.fachada.ripadoFrontal.vendaM2}/m²`,
    });
  } else {
    itens.push({ id: "fachada-ripadoCompleto", grupo: "Fachada", nome: t.fachada.ripadoCompleto.nome, venda: t.fachada.ripadoCompleto.venda });
  }

  // Passo 7: kit mobília (o 3D aparece sempre mobiliado; o kit é a mobília solta).
  const kit = kitMobiliaDe(c, t);
  if (c.extras.kitMobilia && kit) {
    itens.push({ id: `kit-${kit.uso}`, grupo: "Kit mobília", nome: kit.nome, venda: kit.venda, nota: "descricao" in kit ? kit.descricao : undefined });
  }

  // Passo 8: opcionais externos. Pergolado só com deck; kit Airbnb só em suíte e estúdio.
  const o = t.opcionais;
  if (c.extras.deck) {
    const deck = deckComPreco(c, t);
    itens.push({ id: "deck", grupo: "Opcionais", nome: deck.nome, venda: deck.venda, nota: deck.nota });
  }
  if (c.extras.deck && c.extras.pergolado) itens.push({ id: "pergolado", grupo: "Opcionais", nome: o.pergolado.nome, venda: o.pergolado.venda });
  if (c.extras.fundacao) itens.push({ id: "fundacao", grupo: "Opcionais", nome: o.fundacao.nome, venda: o.fundacao.venda });
  if (c.extras.kitAirbnb && kitAirbnbDisponivel(c, t)) {
    itens.push({ id: "kit-airbnb", grupo: "Opcionais", nome: o.kitAirbnb.nome, venda: o.kitAirbnb.venda, nota: o.kitAirbnb.descricao });
  }

  // Passo 9: entrega. Até o limite da tabela (50 km da fábrica) o frete é incluso; acima, R$ por km excedente;
  // cidade sem distância conhecida, sob consulta.
  const sobConsulta: string[] = [t.opcionais.ligacoes.nome];
  const entrega = c.entrega;
  const incluso = o.freteKm.kmIncluso;
  if (entrega.km !== null) {
    const frete = fretePorKm(entrega.km, t);
    itens.push({
      id: "frete",
      grupo: "Entrega",
      nome: `Frete até ${entrega.cidade}`,
      venda: frete.venda,
      nota:
        frete.excedente > 0
          ? `${entrega.km} km, ${incluso} km inclusos: ${frete.excedente} km × R$ ${o.freteKm.vendaPorKm}/km`
          : `${entrega.km} km, dentro dos ${incluso} km inclusos`,
    });
  } else if (entrega.modo === "regiao") {
    itens.push({ id: "frete", grupo: "Entrega", nome: `Frete até ${incluso} km da fábrica`, venda: 0 });
  } else {
    sobConsulta.push(entrega.cidade ? `Frete até ${entrega.cidade}` : "Frete");
  }

  return {
    itens,
    total: itens.reduce((s, i) => s + i.venda, 0),
    sobConsulta,
    etiquetas,
  };
}

export const formatarReais = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
