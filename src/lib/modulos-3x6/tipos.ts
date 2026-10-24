import tabelaJson from "@/data/modulos-3x6/precos.json";
import cidadesJson from "@/data/modulos-3x6/cidades.json";

export type Banheiro = "nenhum" | "lavabo" | "completo";
export type Cozinha = "nenhuma" | "copa" | "completa";
export type Vivencia =
  | "casal"
  | "solteiro"
  | "estar"
  | "escritorio"
  | "academia"
  | "brinquedoteca"
  | "loja";

/**
 * Faces do módulo. A testada é a ponta livre (face de 3 m, onde fica a porta padrão);
 * o fundo é a ponta da faixa hidráulica. ladoA é a lateral do banheiro, ladoB a da cozinha.
 */
export type Face = "testada" | "ladoA" | "ladoB" | "fundo";
export type FaceEsquadria = Exclude<Face, "fundo">;
export type TamanhoEsquadria = "padrao" | "parcial" | "fora";
/** Chave da esquadria na tabela de preços, já resolvida pelo layout. */
export type VarianteEsquadria = "padrao" | "parcial" | "fora450" | "fora600";

export type TipoFachada = "textura" | "ripadoFrontal" | "ripadoCompleto";
export type CorTextura = "offwhite" | "grafite" | "areia" | "musgo";
export type TomWpc = "ipe" | "cumaru" | "teca" | "cinza";

/** Uso do módulo, derivado das escolhas: define qual kit mobília e quais opcionais se aplicam. */
export type Uso = "suite" | "estudio" | "gourmet" | "escritorio" | "academia" | "brinquedoteca" | "loja";

/** Passos 7 e 8 do simulador. */
export interface Extras {
  kitMobilia: boolean;
  deck: boolean;
  /** Só vale com o deck marcado. */
  pergolado: boolean;
  fundacao: boolean;
  /** Só vale em suíte e estúdio. */
  kitAirbnb: boolean;
}

/** Passo 9: entrega. Até 50 km da fábrica o frete está incluso ("regiao"); acima, R$ por km excedente ("fora"). */
export interface Entrega {
  modo: "regiao" | "fora";
  /** Cidade informada (ou encontrada pelo CEP). */
  cidade: string;
  cep: string;
  /** Distância da fábrica em km; null quando não se sabe (região sem cidade informada, ou cidade fora da tabela). */
  km: number | null;
}

export interface Config {
  /** Comprimento da casca em metros. A largura é sempre 3 m. */
  comprimento: number;
  /** Altura externa da casca em metros (a confirmar: 2,90 m). */
  altura: number;
  banheiro: Banheiro;
  cozinha: Cozinha;
  vivencia: Vivencia;
  esquadria: { face: FaceEsquadria; tamanho: TamanhoEsquadria };
  fachada: { tipo: TipoFachada; cor: CorTextura; wpc: TomWpc };
  /** Atalho que originou a configuração; vira null quando a pessoa ajusta algo. */
  atalho: string | null;
  extras: Extras;
  entrega: Entrega;
}

export interface ItemPreco {
  id: string;
  grupo: "Casca" | "Banheiro" | "Cozinha" | "Vivência" | "Esquadria" | "Fachada" | "Kit mobília" | "Opcionais" | "Entrega";
  nome: string;
  venda: number;
  nota?: string;
}

export type TabelaPrecos = typeof tabelaJson;
export const tabela: TabelaPrecos = tabelaJson;
export type Atalho = TabelaPrecos["atalhos"][number];
export type Cidade = (typeof cidadesJson)["cidades"][number];
export const cidades: Cidade[] = cidadesJson.cidades;
