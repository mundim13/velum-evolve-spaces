import { normalizarEsquadria } from "./regras";
import {
  tabela,
  type Atalho,
  type Banheiro,
  type Config,
  type CorTextura,
  type Cozinha,
  type Entrega,
  type Extras,
  type FaceEsquadria,
  type TamanhoEsquadria,
  type TipoFachada,
  type TomWpc,
  type Vivencia,
} from "./tipos";

export type Acao =
  | { tipo: "atalho"; id: string }
  | { tipo: "zerar" }
  | { tipo: "banheiro"; valor: Banheiro }
  | { tipo: "cozinha"; valor: Cozinha }
  | { tipo: "vivencia"; valor: Vivencia }
  | { tipo: "esquadria"; face: FaceEsquadria; tamanho?: TamanhoEsquadria }
  | { tipo: "fachada"; valor: TipoFachada }
  | { tipo: "cor"; valor: CorTextura }
  | { tipo: "wpc"; valor: TomWpc }
  | { tipo: "kitMobilia"; valor: boolean }
  | { tipo: "opcional"; chave: Exclude<keyof Extras, "kitMobilia">; valor: boolean }
  | { tipo: "entrega"; valor: Entrega };

export const buscarAtalho = (id: string): Atalho | undefined => tabela.atalhos.find((a) => a.id === id);

/** O atalho só pré-seleciona as escolhas; a fachada escolhida pela pessoa é mantida. */
export function aplicarAtalho(c: Config, a: Atalho): Config {
  return {
    ...c,
    banheiro: a.banheiro as Banheiro,
    cozinha: a.cozinha as Cozinha,
    vivencia: a.vivencia as Vivencia,
    esquadria: normalizarEsquadria(a.esquadria.face as FaceEsquadria, a.esquadria.tamanho as TamanhoEsquadria),
    atalho: a.id,
  };
}

const BASE: Config = {
  comprimento: 6,
  altura: 2.9,
  banheiro: "nenhum",
  cozinha: "nenhuma",
  vivencia: "estar",
  esquadria: { face: "testada", tamanho: "padrao" },
  fachada: { tipo: "textura", cor: "offwhite", wpc: "cumaru" },
  atalho: null,
  extras: { kitMobilia: false, deck: false, pergolado: false, fundacao: false, kitAirbnb: false },
  entrega: { modo: "regiao", cidade: "", cep: "", km: null },
};

/** Configuração inicial: o atalho Cazita. */
export const CONFIG_INICIAL: Config = aplicarAtalho(BASE, buscarAtalho("cazita")!);

export function reduzir(c: Config, a: Acao): Config {
  switch (a.tipo) {
    case "atalho": {
      const atalho = buscarAtalho(a.id);
      return atalho ? aplicarAtalho(c, atalho) : c;
    }
    case "zerar":
      return { ...c, banheiro: "nenhum", cozinha: "nenhuma", vivencia: "estar", esquadria: { face: "testada", tamanho: "padrao" }, atalho: null };
    case "banheiro":
      return { ...c, banheiro: a.valor, atalho: null };
    case "cozinha":
      return { ...c, cozinha: a.valor, atalho: null };
    case "vivencia":
      return { ...c, vivencia: a.valor, atalho: null };
    case "esquadria": {
      const mesmaFace = a.face === c.esquadria.face;
      const tamanho = a.tamanho ?? (mesmaFace ? c.esquadria.tamanho : "parcial");
      return { ...c, esquadria: normalizarEsquadria(a.face, tamanho), atalho: null };
    }
    case "fachada":
      return { ...c, fachada: { ...c.fachada, tipo: a.valor } };
    case "cor":
      return { ...c, fachada: { ...c.fachada, cor: a.valor } };
    case "wpc":
      return { ...c, fachada: { ...c.fachada, wpc: a.valor } };
    case "kitMobilia":
      return { ...c, extras: { ...c.extras, kitMobilia: a.valor } };
    case "opcional": {
      const extras = { ...c.extras, [a.chave]: a.valor };
      // O pergolado só existe sobre o deck: tirar o deck tira o pergolado, e sem deck ele não entra.
      if (!extras.deck) extras.pergolado = false;
      return { ...c, extras };
    }
    case "entrega":
      return { ...c, entrega: a.valor };
  }
}
