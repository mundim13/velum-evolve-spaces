import tabelaJson from "@/data/modulos-3x6/precos.json";

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
}

export interface ItemPreco {
  id: string;
  grupo: "Casca" | "Banheiro" | "Cozinha" | "Vivência" | "Esquadria" | "Fachada";
  nome: string;
  venda: number;
  nota?: string;
}

export type TabelaPrecos = typeof tabelaJson;
export const tabela: TabelaPrecos = tabelaJson;
export type Atalho = TabelaPrecos["atalhos"][number];
