import {
  CHASSI,
  ESPESSURA_DIVISORIA,
  ESPESSURA_PAREDE as T,
  FAIXA,
  VAO_BANHEIRO,
  VAO_COZINHA,
  aberturas,
  temFaixa,
} from "./regras";
import type { Config, Face } from "./tipos";

/*
 * Layout da vivência com regra geral de aberturas.
 *
 * Os móveis não têm posição fixa: cada ambiente declara, para cada móvel, em quais paredes ele pode
 * ficar (em ordem de preferência) e onde gostaria de ficar ao longo dela. O motor lê as aberturas reais
 * da configuração e coloca cada móvel no ponto válido mais próximo do preferido:
 *
 * - nenhum móvel entra na faixa livre de 80 cm na frente de uma porta, de um vidro ou de uma passagem;
 * - móvel alto (estante, rack, armário, espelho) nunca fica na frente de janela;
 * - móveis não se sobrepõem e ficam dentro da sala.
 *
 * Se a parede preferida estiver ocupada, o móvel vai para a próxima parede livre; se nenhuma servir,
 * ele some. Um ambiente pode ter arranjos alternativos (sofá e TV trocando de parede, por exemplo):
 * vale o que coloca mais móveis essenciais.
 */

/** Paredes da vivência: cabeceira (lado A, z < 0), lateral (lado B, z > 0), testada (x = fim) e fundo (divisória ou fundo). */
export type Parede = "cabeceira" | "lateral" | "testada" | "fundo";

/** Faixa livre na frente de portas, vidros e passagens. */
export const LIVRE_PORTA = 0.8;
/** Folga lateral entre móvel alto e janela. */
const FOLGA_JANELA = 0.05;
/** Folga mínima entre móveis. */
const FOLGA_MOVEIS = 0.03;
const PASSO = 0.05;
const EPS = 1e-6;

export interface Sala {
  /** Início útil ao longo de x (face da divisória ou da parede do fundo). */
  a: number;
  /** Fim útil ao longo de x (face interna da testada). */
  b: number;
  /** Faces internas das laterais. */
  zA: number;
  zB: number;
}

export function sala(c: Config): Sala {
  const meio = c.comprimento / 2;
  return {
    a: temFaixa(c) ? -meio + FAIXA + ESPESSURA_DIVISORIA / 2 : -meio + T,
    b: meio - T,
    zA: -1.5 + T,
    zB: 1.5 - T,
  };
}

export interface Ret {
  x0: number;
  x1: number;
  z0: number;
  z1: number;
}

export interface Vao {
  id: string;
  parede: Parede;
  /** Trecho ao longo da parede (x na cabeceira e na lateral, z na testada e no fundo). */
  u0: number;
  u1: number;
  /** Porta, vidro ou passagem (pede faixa livre) ou janela (não aceita móvel alto na frente). */
  tipo: "porta" | "janela";
  /** Altura do peitoril acima do piso (0 nas portas). */
  peitoril: number;
}

const PAREDE_DA_FACE: Record<Exclude<Face, "fundo">, Parede> = { testada: "testada", ladoA: "cabeceira", ladoB: "lateral" };

/** Comprimento útil de cada parede, no eixo u. */
export function limitesParede(s: Sala, p: Parede): [number, number] {
  return p === "cabeceira" || p === "lateral" ? [s.a, s.b] : [s.zA, s.zB];
}

/** Aberturas que dão para a vivência: a esquadria, as janelas e as passagens da divisória. */
export function vaosDaSala(c: Config): Vao[] {
  const s = sala(c);
  const vaos: Vao[] = [];
  for (const ab of aberturas(c)) {
    if (!ab.recorta) continue;
    if (ab.face === "fundo" && temFaixa(c)) continue; // o fundo, aí, é do banheiro e da cozinha
    const parede = ab.face === "fundo" ? "fundo" : PAREDE_DA_FACE[ab.face];
    const [lo, hi] = limitesParede(s, parede);
    const u0 = Math.max(lo, ab.u0);
    const u1 = Math.min(hi, ab.u1);
    if (u1 - u0 <= EPS) continue;
    vaos.push({
      id: ab.id,
      parede,
      u0,
      u1,
      tipo: ab.tipo === "porta" ? "porta" : "janela",
      peitoril: ab.tipo === "porta" ? 0 : ab.y0 - CHASSI,
    });
  }
  // Divisória: portas do banheiro e da cozinha, ou passagem aberta onde não há parede.
  if (temFaixa(c)) {
    const temBanheiro = c.banheiro !== "nenhum";
    const temCozinha = c.cozinha !== "nenhuma";
    const passagens: [string, number, number][] = [];
    if (temBanheiro) passagens.push(["porta-banheiro", VAO_BANHEIRO[0], VAO_BANHEIRO[1]]);
    if (temBanheiro && temCozinha) passagens.push(["porta-cozinha", VAO_COZINHA[0], VAO_COZINHA[1]]);
    // Sem banheiro, a cozinha fica aberta para a vivência (sem divisória); sem cozinha, o lado dela é passagem.
    if (!temBanheiro) passagens.push(["cozinha-aberta", s.zA, s.zB]);
    else if (!temCozinha) passagens.push(["passagem", 0, s.zB]);
    for (const [id, u0, u1] of passagens) vaos.push({ id, parede: "fundo", u0, u1, tipo: "porta", peitoril: 0 });
  }
  return vaos;
}

/** Faixa livre na frente de cada porta, vidro ou passagem, em planta. */
export function zonasLivres(c: Config): Ret[] {
  const s = sala(c);
  return vaosDaSala(c)
    .filter((v) => v.tipo === "porta")
    .map((v) => retNaParede(s, v.parede, (v.u0 + v.u1) / 2, v.u1 - v.u0, LIVRE_PORTA));
}

/** Retângulo em planta de uma peça encostada na parede, centrada em u, com a largura ao longo dela. */
export function retNaParede(s: Sala, p: Parede, u: number, largura: number, profundidade: number): Ret {
  const h = largura / 2;
  switch (p) {
    case "cabeceira":
      return { x0: u - h, x1: u + h, z0: s.zA, z1: s.zA + profundidade };
    case "lateral":
      return { x0: u - h, x1: u + h, z0: s.zB - profundidade, z1: s.zB };
    case "testada":
      return { x0: s.b - profundidade, x1: s.b, z0: u - h, z1: u + h };
    case "fundo":
      return { x0: s.a, x1: s.a + profundidade, z0: u - h, z1: u + h };
  }
}

/** Rotação (em y) que vira a frente da peça (+z local) para dentro da sala. */
export const ROTACAO: Record<Parede, number> = { cabeceira: 0, lateral: Math.PI, testada: -Math.PI / 2, fundo: Math.PI / 2 };

/** Ponto da parede no centro da peça (onde fica a origem local dela). */
function pontoNaParede(s: Sala, p: Parede, u: number): [number, number] {
  switch (p) {
    case "cabeceira":
      return [u, s.zA];
    case "lateral":
      return [u, s.zB];
    case "testada":
      return [s.b, u];
    case "fundo":
      return [s.a, u];
  }
}

export const OPOSTA: Record<Parede, Parede> = { cabeceira: "lateral", lateral: "cabeceira", testada: "fundo", fundo: "testada" };

export const cruzam = (r: Ret, q: Ret, folga = 0) =>
  r.x0 < q.x1 + folga - EPS && q.x0 < r.x1 + folga - EPS && r.z0 < q.z1 + folga - EPS && q.z0 < r.z1 + folga - EPS;

const dentro = (s: Sala, r: Ret) => r.x0 >= s.a - EPS && r.x1 <= s.b + EPS && r.z0 >= s.zA - EPS && r.z1 <= s.zB + EPS;

/* ------------------------------------------- declaração ------------------------------------------- */

export type TipoPeca =
  | "cama-casal"
  | "cama-solteiro"
  | "escrivaninha"
  | "sofa"
  | "rack-tv"
  | "mesa-centro"
  | "bancada-gourmet"
  | "frigobar"
  | "mesa-alta"
  | "mesas-escritorio"
  | "estante"
  | "espelho"
  | "esteira"
  | "bike"
  | "rack-anilhas"
  | "halteres"
  | "banco-supino"
  | "cabaninha"
  | "estante-baixa"
  | "mesinha-infantil"
  | "vitrine"
  | "balcao-caixa"
  | "prateleira-loja"
  | "mesa-expositora"
  | "criado-mudo"
  | "canto-descanso"
  | "aparador"
  | "mesa-jantar"
  | "adega"
  | "espaldar"
  | "colchonetes"
  | "kettlebells"
  | "cantinho-leitura"
  | "espera"
  | "espelho-corpo"
  | "planta";

interface PecaBase {
  id: string;
  tipo: TipoPeca;
  /** Largura ao longo da parede (ou ao longo do eixo da peça de referência, nas peças soltas). */
  largura: number;
  profundidade: number;
  /** Peça alta: não fica na frente de janela. */
  alto: boolean;
  /** Sem ela, o ambiente não se sustenta (conta mais na escolha do arranjo). */
  essencial?: boolean;
}

export interface PecaParede extends PecaBase {
  /** Paredes aceitas, em ordem de preferência; "oposta-porta" é a parede em frente à esquadria principal. */
  paredes: (Parede | "oposta-porta")[];
  /** Posição preferida ao longo da parede: 0 no início (fundo ou lado A), 1 no fim (testada ou lado B). */
  ancora: number;
  /** Fica ao lado desta peça, na mesma parede (frigobar junto da bancada); se não couber, vai para as paredes declaradas. */
  junto?: string;
  /** Espaço reservado de cada lado para as peças que vão junto (criados, frigobar); se não couber, tenta sem. */
  reserva?: number;
}

export interface PecaSolta extends PecaBase {
  /** Fica na frente desta peça, voltada para ela, à distância preferida da frente dela. */
  frente: string;
  distancia: number;
  /** Encara a peça de referência (gira 180°): banquetas viradas para a bancada, por exemplo. */
  virada?: boolean;
}

export type Peca = PecaParede | PecaSolta;
const solta = (p: Peca): p is PecaSolta => "frente" in p;

export interface Colocada {
  id: string;
  tipo: TipoPeca;
  /** Parede onde está encostada (null nas peças soltas). */
  parede: Parede | null;
  /** Origem local: ponto da parede no centro da peça (ou o centro da peça, nas soltas). */
  x: number;
  z: number;
  rotY: number;
  largura: number;
  profundidade: number;
  alto: boolean;
  rect: Ret;
}

/* ------------------------------------------- ambientes ------------------------------------------- */

export type Ambiente =
  | "casal"
  | "solteiro"
  | "estar"
  | "gourmet"
  | "vazio"
  | "escritorio"
  | "academia"
  | "brinquedoteca"
  | "loja";

/**
 * Ambiente mobiliado a partir das escolhas. Estar com cozinha e sem banheiro é gourmet; estar sem banheiro
 * e sem cozinha é o "começar do zero": o módulo aparece vazio, só com o acabamento.
 */
export function ambienteDaConfig(c: Pick<Config, "banheiro" | "cozinha" | "vivencia">): Ambiente {
  if (c.vivencia !== "estar") return c.vivencia;
  const temBanheiro = c.banheiro !== "nenhum";
  const temCozinha = c.cozinha !== "nenhuma";
  if (temCozinha && !temBanheiro) return "gourmet";
  if (!temCozinha && !temBanheiro) return "vazio";
  return "estar";
}

/** Criado-mudo com abajur, ao lado da cama (some se não couber). */
const criado = (id: string): PecaParede => ({ id, tipo: "criado-mudo", largura: 0.45, profundidade: 0.4, alto: false, paredes: [], ancora: 0, junto: "cama" });

/** Espelho de parede (2 m no fundo, de frente para a entrada, ou 1 m onde não couber). */
const espelho = (largura: number): PecaParede => ({
  id: "espelho",
  tipo: "espelho",
  largura,
  profundidade: 0.05,
  alto: true,
  essencial: true,
  paredes: ["fundo", "lateral", "cabeceira", "testada"],
  ancora: 0.5,
});

const planta = (ancora: number, paredes: Parede[] = ["lateral", "testada", "cabeceira", "fundo"]): PecaParede => ({
  id: "planta",
  tipo: "planta",
  largura: 0.45,
  profundidade: 0.45,
  alto: true,
  paredes,
  ancora,
});

const ESTEIRA: PecaParede = { id: "esteira", tipo: "esteira", largura: 1.8, profundidade: 0.85, alto: true, essencial: true, paredes: ["lateral", "cabeceira", "testada"], ancora: 0.3 };
const ANILHAS: PecaParede = { id: "anilhas", tipo: "rack-anilhas", largura: 0.9, profundidade: 0.5, alto: true, essencial: true, paredes: ["cabeceira", "lateral", "fundo", "testada"], ancora: 0.55 };
const BIKE: PecaParede = { id: "bike", tipo: "bike", largura: 1.05, profundidade: 0.6, alto: true, paredes: ["lateral", "cabeceira", "fundo", "testada"], ancora: 0.8 };
const HALTERES: PecaParede = { id: "halteres", tipo: "halteres", largura: 0.6, profundidade: 0.36, alto: true, paredes: ["cabeceira", "lateral", "fundo", "testada"], ancora: 0.85 };
const BANCO: PecaSolta = { id: "banco", tipo: "banco-supino", largura: 1.25, profundidade: 0.45, alto: false, frente: "anilhas", distancia: 0.45 };
/** Zona de alongamento: espaldar na parede e colchonetes na frente dele. */
const ESPALDAR: PecaParede = { id: "espaldar", tipo: "espaldar", largura: 0.9, profundidade: 0.14, alto: true, paredes: ["testada", "cabeceira", "lateral", "fundo"], ancora: 0.15 };
const COLCHONETES: PecaSolta = { id: "colchonetes", tipo: "colchonetes", largura: 1.8, profundidade: 0.75, alto: false, frente: "espaldar", distancia: 0.1 };
const KETTLEBELLS: PecaParede = { id: "kettlebells", tipo: "kettlebells", largura: 0.6, profundidade: 0.3, alto: false, junto: "halteres", paredes: ["cabeceira", "lateral", "fundo", "testada"], ancora: 0.7 };

/** Arranjos de cada ambiente, em ordem de preferência. */
export const ARRANJOS: Record<Ambiente, Peca[][]> = {
  casal: [
    [
      // Cabeceira na parede amadeirada; com o vidro numa lateral, a cama pode virar a cabeceira para a testada.
      { id: "cama", tipo: "cama-casal", largura: 1.66, profundidade: 2.12, alto: false, essencial: true, paredes: ["cabeceira", "lateral", "testada", "fundo"], ancora: 0.43, reserva: 0.48 },
      criado("criado-1"),
      criado("criado-2"),
      planta(1),
    ],
  ],
  solteiro: [
    [
      { id: "cama", tipo: "cama-solteiro", largura: 2.02, profundidade: 0.96, alto: false, essencial: true, paredes: ["cabeceira", "lateral", "testada", "fundo"], ancora: 0 },
      criado("criado-1"),
      // A mesa do caseiro fica junto da janela, como nas fotos: mesa não é móvel alto.
      { id: "mesa", tipo: "escrivaninha", largura: 1.1, profundidade: 1.05, alto: false, essencial: true, paredes: ["lateral", "cabeceira", "testada", "fundo"], ancora: 0.57 },
    ],
  ],
  estar: [
    ["cabeceira", "lateral"],
    ["lateral", "cabeceira"],
    ["cabeceira", "fundo"],
    ["lateral", "fundo"],
    ["cabeceira", "testada"],
    ["lateral", "testada"],
  ].map(([parSofa, parTv]) => [
    { id: "sofa", tipo: "sofa", largura: 2.3, profundidade: 0.95, alto: false, essencial: true, paredes: [parSofa as Parede], ancora: 0.43 },
    { id: "tv", tipo: "rack-tv", largura: 1.6, profundidade: 0.45, alto: true, essencial: true, paredes: [parTv as Parede], ancora: 0.3 },
    { id: "mesa-centro", tipo: "mesa-centro", largura: 0.8, profundidade: 0.8, alto: false, frente: "sofa", distancia: 0.4 },
    // Kitnet: mesa para dois junto da parede, perto da cozinha.
    { id: "jantar", tipo: "mesa-jantar", largura: 1.0, profundidade: 0.75, alto: false, paredes: ["lateral", "cabeceira", "testada", "fundo"], ancora: 0.05 },
    planta(1),
  ]),
  gourmet: [
    [
      // Bancada voltada para a porta de vidro: na parede em frente à esquadria principal.
      { id: "bancada", tipo: "bancada-gourmet", largura: 1.8, profundidade: 0.65, alto: false, essencial: true, paredes: ["oposta-porta", "cabeceira", "lateral", "testada", "fundo"], ancora: 0.45, reserva: 0.6 },
      { id: "frigobar", tipo: "frigobar", largura: 0.56, profundidade: 0.62, alto: false, essencial: true, paredes: ["oposta-porta", "cabeceira", "lateral", "testada", "fundo"], ancora: 0.45, junto: "bancada" },
      // Mesa alta com banquetas entre a bancada e a porta; quem senta fica de frente para o vidro.
      { id: "mesa-alta", tipo: "mesa-alta", largura: 1.3, profundidade: 0.95, alto: false, essencial: true, frente: "bancada", distancia: 0.35 },
      { id: "adega", tipo: "adega", largura: 0.6, profundidade: 0.5, alto: false, paredes: ["testada", "lateral", "cabeceira", "fundo"], ancora: 0.5 },
      planta(1),
    ],
  ],
  vazio: [[]],
  escritorio: [
    [
      { id: "mesas", tipo: "mesas-escritorio", largura: 2.6, profundidade: 1.2, alto: false, essencial: true, paredes: ["cabeceira", "lateral", "fundo"], ancora: 0.5 },
      { id: "estante", tipo: "estante", largura: 1.6, profundidade: 0.36, alto: true, essencial: true, paredes: ["lateral", "fundo", "cabeceira", "testada"], ancora: 0.5 },
      // Canto de descanso (poltrona, mesinha e luminária de piso) longe das mesas, perto da luz da entrada.
      { id: "descanso", tipo: "canto-descanso", largura: 1.3, profundidade: 0.85, alto: false, paredes: ["lateral", "cabeceira", "fundo", "testada"], ancora: 1 },
      { id: "aparador", tipo: "aparador", largura: 1.0, profundidade: 0.45, alto: false, paredes: ["fundo", "lateral", "cabeceira"], ancora: 0.5 },
      planta(1),
    ],
  ],
  // Espelho largo na parede do fundo, de frente para a entrada; com a divisória no fundo, um espelho estreito.
  academia: [
    [espelho(2.0), ESTEIRA, ANILHAS, HALTERES, KETTLEBELLS, BANCO, ESPALDAR, COLCHONETES, BIKE],
    [espelho(1.0), ESTEIRA, ANILHAS, HALTERES, KETTLEBELLS, BANCO, ESPALDAR, COLCHONETES, BIKE],
    [ESTEIRA, ANILHAS, espelho(1.0), HALTERES, KETTLEBELLS, BANCO, ESPALDAR, COLCHONETES, BIKE],
  ],
  brinquedoteca: [
    [
      { id: "cabaninha", tipo: "cabaninha", largura: 1.25, profundidade: 1.2, alto: true, essencial: true, paredes: ["cabeceira", "lateral", "fundo"], ancora: 0.1 },
      { id: "estante", tipo: "estante-baixa", largura: 2.0, profundidade: 0.36, alto: true, essencial: true, paredes: ["lateral", "cabeceira", "fundo"], ancora: 0.4 },
      { id: "mesinha", tipo: "mesinha-infantil", largura: 1.25, profundidade: 1.25, alto: false, frente: "estante", distancia: 0.55 },
      // Cantinho de leitura: livros de capa para a frente, pufes e almofadões no chão.
      { id: "leitura", tipo: "cantinho-leitura", largura: 1.2, profundidade: 0.9, alto: true, paredes: ["fundo", "lateral", "cabeceira", "testada"], ancora: 0.5 },
    ],
  ],
  loja: [
    [
      // Vitrine perto da entrada (testada), balcão com caixa no fundo, de frente para quem entra.
      { id: "vitrine", tipo: "vitrine", largura: 1.2, profundidade: 0.5, alto: false, essencial: true, paredes: ["lateral", "cabeceira"], ancora: 1 },
      { id: "prateleira-a", tipo: "prateleira-loja", largura: 1.5, profundidade: 0.4, alto: true, essencial: true, paredes: ["cabeceira", "lateral", "testada"], ancora: 0.45 },
      { id: "balcao", tipo: "balcao-caixa", largura: 1.2, profundidade: 0.62, alto: false, essencial: true, paredes: ["fundo", "cabeceira", "lateral", "testada"], ancora: 0.5 },
      { id: "prateleira-b", tipo: "prateleira-loja", largura: 1.5, profundidade: 0.4, alto: true, paredes: ["lateral", "cabeceira", "testada"], ancora: 0.45 },
      { id: "expositora", tipo: "mesa-expositora", largura: 1.0, profundidade: 0.7, alto: false, frente: "balcao", distancia: 1.3 },
      // Espera do cliente (ou do paciente, no consultório) e espelho de corpo inteiro.
      { id: "espera", tipo: "espera", largura: 1.5, profundidade: 0.75, alto: false, paredes: ["cabeceira", "lateral", "testada", "fundo"], ancora: 0.9 },
      { id: "espelho", tipo: "espelho-corpo", largura: 0.6, profundidade: 0.05, alto: true, paredes: ["cabeceira", "lateral", "fundo", "testada"], ancora: 0.15 },
    ],
  ],
};

/* ------------------------------------------- motor ------------------------------------------- */

interface Contexto {
  s: Sala;
  vaos: Vao[];
  zonas: Ret[];
  paredePorta: Parede;
}

function valida(ctx: Contexto, r: Ret, alto: boolean, parede: Parede | null, u0: number, u1: number, colocadas: Colocada[]) {
  if (!dentro(ctx.s, r)) return false;
  if (ctx.zonas.some((z) => cruzam(r, z))) return false;
  if (colocadas.some((q) => cruzam(r, q.rect, FOLGA_MOVEIS))) return false;
  if (alto && parede) {
    for (const v of ctx.vaos) {
      if (v.tipo === "janela" && v.parede === parede && u0 < v.u1 + FOLGA_JANELA && v.u0 - FOLGA_JANELA < u1) return false;
    }
  }
  return true;
}

function colocarNaParede(ctx: Contexto, peca: PecaParede, colocadas: Colocada[]): Colocada | null {
  const ref = peca.junto ? colocadas.find((q) => q.id === peca.junto) : undefined;
  if (ref?.parede) {
    const junto = tentarParedes(ctx, peca, colocadas, [ref.parede], ref, 0);
    if (junto) return junto;
  }
  const paredes = [...new Set(peca.paredes.map((p) => (p === "oposta-porta" ? OPOSTA[ctx.paredePorta] : p)))];
  if (peca.reserva) {
    const comReserva = tentarParedes(ctx, peca, colocadas, paredes, undefined, peca.reserva);
    if (comReserva) return comReserva;
  }
  return tentarParedes(ctx, peca, colocadas, paredes, undefined, 0);
}

function tentarParedes(ctx: Contexto, peca: PecaParede, colocadas: Colocada[], paredes: Parede[], ref: Colocada | undefined, reserva: number) {
  for (const parede of paredes) {
    const [lo, hi] = limitesParede(ctx.s, parede);
    const min = lo + peca.largura / 2 + reserva;
    const max = hi - peca.largura / 2 - reserva;
    if (max < min - EPS) continue;
    // Pontos candidatos ao longo da parede, do mais próximo ao mais distante da posição preferida.
    const alvos: number[] = [];
    if (ref) {
      const lado = (ref.largura + peca.largura) / 2 + FOLGA_MOVEIS + 0.01;
      const uRef = parede === "cabeceira" || parede === "lateral" ? ref.x : ref.z;
      alvos.push(uRef + lado, uRef - lado);
    } else {
      alvos.push(min + (max - min) * peca.ancora);
    }
    const candidatos: number[] = [];
    for (let u = min; u <= max + EPS; u += PASSO) candidatos.push(u);
    candidatos.push(max, ...alvos.filter((u) => u >= min - EPS && u <= max + EPS));
    const distancia = (u: number) => Math.min(...alvos.map((a) => Math.abs(u - a)));
    candidatos.sort((p, q) => distancia(p) - distancia(q));
    for (const u of candidatos) {
      const r = retNaParede(ctx.s, parede, u, peca.largura, peca.profundidade);
      const teste = reserva ? retNaParede(ctx.s, parede, u, peca.largura + 2 * reserva, peca.profundidade) : r;
      if (valida(ctx, teste, peca.alto, parede, u - peca.largura / 2, u + peca.largura / 2, colocadas)) {
        const [x, z] = pontoNaParede(ctx.s, parede, u);
        return { id: peca.id, tipo: peca.tipo, parede, x, z, rotY: ROTACAO[parede], largura: peca.largura, profundidade: peca.profundidade, alto: peca.alto, rect: r };
      }
    }
  }
  return null;
}

function colocarSolta(ctx: Contexto, peca: PecaSolta, colocadas: Colocada[]): Colocada | null {
  const ref = colocadas.find((q) => q.id === peca.frente);
  if (!ref || !ref.parede) return null;
  // Direção da frente da peça de referência e eixo ao longo dela.
  const n: [number, number] = [Math.sin(ref.rotY), Math.cos(ref.rotY)];
  const t: [number, number] = [Math.cos(ref.rotY), -Math.sin(ref.rotY)];
  const ao = (d: number, desvio: number) => {
    const dist = ref.profundidade + d + peca.profundidade / 2;
    const cx = ref.x + n[0] * dist + t[0] * desvio;
    const cz = ref.z + n[1] * dist + t[1] * desvio;
    const ex = Math.abs(n[0]) > 0.5 ? peca.profundidade / 2 : peca.largura / 2;
    const ez = Math.abs(n[0]) > 0.5 ? peca.largura / 2 : peca.profundidade / 2;
    return { cx, cz, r: { x0: cx - ex, x1: cx + ex, z0: cz - ez, z1: cz + ez } };
  };
  const opcoes: [number, number][] = [];
  for (let d = 0.15; d <= 2.5; d += PASSO) for (let k = -12; k <= 12; k++) opcoes.push([d, k * 0.1]);
  opcoes.sort((p, q) => Math.abs(p[0] - peca.distancia) + Math.abs(p[1]) * 0.8 - (Math.abs(q[0] - peca.distancia) + Math.abs(q[1]) * 0.8));
  for (const [d, desvio] of opcoes) {
    const { cx, cz, r } = ao(d, desvio);
    if (valida(ctx, r, peca.alto, null, 0, 0, colocadas)) {
      return {
        id: peca.id,
        tipo: peca.tipo,
        parede: null,
        x: cx,
        z: cz,
        rotY: ref.rotY + (peca.virada ? Math.PI : 0),
        largura: peca.largura,
        profundidade: peca.profundidade,
        alto: peca.alto,
        rect: r,
      };
    }
  }
  return null;
}

/** Coloca as peças de um arranjo, na ordem declarada. */
function montar(ctx: Contexto, pecas: Peca[]) {
  const colocadas: Colocada[] = [];
  for (const peca of pecas) {
    const c = solta(peca) ? colocarSolta(ctx, peca, colocadas) : colocarNaParede(ctx, peca, colocadas);
    if (c) colocadas.push(c);
  }
  const pontos = colocadas.reduce((s, c) => s + (pecas.find((p) => p.id === c.id)?.essencial ? 10 : 1), 0);
  return { colocadas, pontos };
}

export interface Layout {
  ambiente: Ambiente;
  sala: Sala;
  vaos: Vao[];
  zonas: Ret[];
  pecas: Colocada[];
  /** Peças declaradas que não couberam em nenhuma parede (somem). */
  fora: string[];
}

/** Layout da vivência para a configuração: o arranjo que coloca mais peças, com preferência para o primeiro. */
export function layoutVivencia(c: Config): Layout {
  const ambiente = ambienteDaConfig(c);
  const s = sala(c);
  const vaos = vaosDaSala(c);
  const principal = vaos.find((v) => v.id === "principal");
  const ctx: Contexto = { s, vaos, zonas: zonasLivres(c), paredePorta: principal?.parede ?? "testada" };
  let melhor: { colocadas: Colocada[]; pontos: number; pecas: Peca[] } | null = null;
  for (const pecas of ARRANJOS[ambiente]) {
    const r = montar(ctx, pecas);
    if (!melhor || r.pontos > melhor.pontos) melhor = { ...r, pecas };
  }
  const colocadas = melhor?.colocadas ?? [];
  const fora = (melhor?.pecas ?? []).filter((p) => !colocadas.some((q) => q.id === p.id)).map((p) => p.id);
  return { ambiente, sala: s, vaos, zonas: ctx.zonas, pecas: colocadas, fora };
}
