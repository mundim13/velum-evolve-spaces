import { areaRipadoFrontal, varianteEsquadria } from "./regras";
import { tabela as tabelaPadrao, type Config, type ItemPreco, type TabelaPrecos } from "./tipos";

export interface ResultadoPreco {
  itens: ItemPreco[];
  total: number;
  /** Itens que aparecem no resumo mas ficam fora do total. */
  sobConsulta: string[];
  etiquetas: string[];
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

  return {
    itens,
    total: itens.reduce((s, i) => s + i.venda, 0),
    sobConsulta: [t.opcionais.ligacoes.nome],
    etiquetas,
  };
}

export const formatarReais = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
