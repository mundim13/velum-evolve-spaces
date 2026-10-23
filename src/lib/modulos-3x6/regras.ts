import type {
  Config,
  Face,
  FaceEsquadria,
  TamanhoEsquadria,
  VarianteEsquadria,
} from "./tipos";

/*
 * Sistema de coordenadas (metros): x ao longo do comprimento, z ao longo da largura, y para cima.
 * A testada fica em x = +L/2 e o fundo em x = -L/2. ladoA é z = -1,5 (banheiro), ladoB é z = +1,5 (cozinha).
 * Cada face mede posições num eixo "u": z na testada e no fundo, x nas laterais.
 */

export const LARGURA = 3;
/** Profundidade da faixa hidráulica (banheiro e cozinha lado a lado no fundo). */
export const FAIXA = 1.5;
/** Altura da base preta do chassi; o piso interno fica nessa cota. */
export const CHASSI = 0.2;
export const ESPESSURA_PAREDE = 0.12;
export const ALTURA_VAO = 2.1;

export type TipoAbertura = "porta" | "janela" | "basculante" | "veneziana";

export interface Abertura {
  id: string;
  face: Face;
  tipo: TipoAbertura;
  u0: number;
  u1: number;
  y0: number;
  y1: number;
  /** false para peças sobrepostas à parede (veneziana), que não abrem vão mas tiram ripas. */
  recorta: boolean;
}

export const temFaixa = (c: Pick<Config, "banheiro" | "cozinha">) =>
  c.banheiro !== "nenhum" || c.cozinha !== "nenhuma";

/** Trecho da vivência ao longo de x: tudo que sobra depois da faixa hidráulica. */
export function trechoVivencia(c: Config): [number, number] {
  const meio = c.comprimento / 2;
  return [temFaixa(c) ? -meio + FAIXA : -meio, meio];
}

/** Comprimento de cada face (largura útil ao longo de u). */
export function comprimentoFace(face: Face, c: Pick<Config, "comprimento">) {
  return face === "testada" || face === "fundo" ? LARGURA : c.comprimento;
}

export function areaFace(face: Face, c: Pick<Config, "comprimento" | "altura">) {
  return comprimentoFace(face, c) * c.altura;
}

export function varianteEsquadria(c: Config): VarianteEsquadria {
  const { face, tamanho } = c.esquadria;
  if (face === "testada") return "padrao";
  if (tamanho === "parcial") return "parcial";
  const [x0, x1] = trechoVivencia(c);
  return x1 - x0 >= 6 - 1e-6 ? "fora600" : "fora450";
}

/** Largura do vão principal em metros. */
export function larguraVao(c: Config): number {
  const v = varianteEsquadria(c);
  if (v === "padrao") return 2.0;
  if (v === "parcial") return 3.0;
  const [x0, x1] = trechoVivencia(c);
  return x1 - x0;
}

/**
 * Garante que a esquadria respeita as regras: a testada só aceita a porta padrão,
 * as laterais aceitam parcial ou fora a fora, e o fundo (parede do banheiro e da laje técnica) nunca recebe vidro.
 */
export function normalizarEsquadria(
  face: FaceEsquadria,
  tamanho: TamanhoEsquadria,
): Config["esquadria"] {
  if (face === "testada") return { face, tamanho: "padrao" };
  return { face, tamanho: tamanho === "padrao" ? "parcial" : tamanho };
}

export interface OpcaoEsquadria {
  face: FaceEsquadria;
  tamanho: TamanhoEsquadria;
  variante: VarianteEsquadria;
  largura: number;
}

/** Combinações de face e tamanho permitidas para a configuração atual. */
export function opcoesEsquadria(c: Config): OpcaoEsquadria[] {
  const combos: [FaceEsquadria, TamanhoEsquadria][] = [
    ["testada", "padrao"],
    ["ladoA", "parcial"],
    ["ladoA", "fora"],
    ["ladoB", "parcial"],
    ["ladoB", "fora"],
  ];
  return combos.map(([face, tamanho]) => {
    const cfg = { ...c, esquadria: { face, tamanho } };
    return { face, tamanho, variante: varianteEsquadria(cfg), largura: larguraVao(cfg) };
  });
}

/**
 * Todas as aberturas da casca: a esquadria principal mais as regras automáticas
 * (basculante do banheiro, janela secundária da vivência e veneziana técnica fixa no fundo).
 */
export function aberturas(c: Config): Abertura[] {
  const lista: Abertura[] = [];
  const meio = c.comprimento / 2;
  const topoVao = CHASSI + ALTURA_VAO;
  const { face } = c.esquadria;

  if (face === "testada") {
    lista.push({ id: "principal", face, tipo: "porta", u0: -1, u1: 1, y0: CHASSI, y1: topoVao, recorta: true });
  } else {
    const [x0, x1] = trechoVivencia(c);
    const centro = (x0 + x1) / 2;
    const metade = larguraVao(c) / 2;
    lista.push({
      id: "principal",
      face,
      tipo: "porta",
      u0: centro - metade,
      u1: centro + metade,
      y0: CHASSI,
      y1: topoVao,
      recorta: true,
    });
  }

  // O banheiro sempre recebe basculante: janela vertical alta no fundo, sobre o box (como no Cazita).
  if (c.banheiro !== "nenhum") {
    lista.push({
      id: "basculante",
      face: "fundo",
      tipo: "basculante",
      u0: -1.3,
      u1: -0.92,
      y0: CHASSI + 0.45,
      y1: CHASSI + 2.4,
      recorta: true,
    });
  }

  // A cozinha ganha uma janela vertical estreita na lateral dela.
  if (c.cozinha !== "nenhuma") {
    lista.push({
      id: "janela-cozinha",
      face: "ladoB",
      tipo: "janela",
      u0: -meio + 0.8,
      u1: -meio + 1.25,
      y0: CHASSI + 0.45,
      y1: topoVao,
      recorta: true,
    });
  }

  // Com a esquadria na testada, a vivência ganha uma janela secundária estreita na lateral da cozinha
  // (a lateral do banheiro é a parede-cabeceira em painel amadeirado).
  if (face === "testada") {
    const [x0, x1] = trechoVivencia(c);
    const centro = (x0 + x1) / 2;
    lista.push({
      id: "secundaria",
      face: "ladoB",
      tipo: "janela",
      u0: centro - 0.3,
      u1: centro + 0.3,
      y0: CHASSI + 0.5,
      y1: topoVao,
      recorta: true,
    });
  }

  // Veneziana preta alta no fundo, fechando a laje técnica. Peça fixa em todas as configurações.
  lista.push({
    id: "veneziana",
    face: "fundo",
    tipo: "veneziana",
    u0: -0.75,
    u1: -0.05,
    y0: CHASSI + 0.3,
    y1: c.altura - 0.3,
    recorta: false,
  });

  return lista;
}

export const aberturaPrincipal = (c: Config) => aberturas(c).find((a) => a.id === "principal")!;

/** Área de ripado frontal: a face da esquadria principal, descontado o vão. */
export function areaRipadoFrontal(c: Config) {
  const vao = aberturaPrincipal(c);
  return areaFace(vao.face, c) - (vao.u1 - vao.u0) * (vao.y1 - vao.y0);
}
