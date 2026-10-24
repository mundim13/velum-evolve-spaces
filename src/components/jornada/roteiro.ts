import { CONFIG_INICIAL, aplicarAtalho, buscarAtalho } from "@/lib/modulos-3x6/estado";
import { entregaPara } from "@/lib/modulos-3x6/entrega";
import type { Config } from "@/lib/modulos-3x6/tipos";

/*
 * Roteiro da jornada: um único relógio (segundos) comanda a cena 3D e o painel.
 * Cada etapa tem um trecho do relógio e um trecho do prazo (dias corridos de obra).
 * Prazos e textos são ilustrativos: ajustar com a produção antes de publicar.
 */

export type IdEtapa =
  | "projeto"
  | "estrutura"
  | "fechamento"
  | "interior"
  | "acabamento"
  | "qualidade"
  | "carregamento"
  | "transporte"
  | "instalacao";

export interface Etapa {
  id: IdEtapa;
  nome: string;
  /** Início e fim no relógio da animação, em segundos. */
  t0: number;
  t1: number;
  /** Dias de obra (início e fim). */
  dia0: number;
  dia1: number;
  local: "fabrica" | "estrada" | "cliente";
  resumo: string;
}

export const ETAPAS: Etapa[] = [
  { id: "projeto", nome: "Projeto", t0: 0, t1: 4.5, dia0: 1, dia1: 5, local: "fabrica", resumo: "Planta da academia aprovada: 3 × 6 m, porta de vidro na testada, ao lado da casa." },
  { id: "estrutura", nome: "Estrutura metálica", t0: 4.5, t1: 10.5, dia0: 6, dia1: 12, local: "fabrica", resumo: "Chassi, pilares e vigas em aço montados no gabarito da fábrica." },
  { id: "fechamento", nome: "Paredes e cobertura", t0: 10.5, t1: 16, dia0: 13, dia1: 19, local: "fabrica", resumo: "Paredes com isolamento sobem em volta da estrutura; vãos já recortados." },
  { id: "interior", nome: "Interior academia", t0: 16, t1: 22.5, dia0: 20, dia1: 27, local: "fabrica", resumo: "Piso emborrachado, espelho, iluminação, ar-condicionado e o kit academia." },
  { id: "acabamento", nome: "Fachada e acabamento", t0: 22.5, t1: 27.5, dia0: 28, dia1: 33, local: "fabrica", resumo: "Ripado em WPC na testada, esquadria de vidro e arremates pretos." },
  { id: "qualidade", nome: "Controle de qualidade", t0: 27.5, t1: 31, dia0: 34, dia1: 35, local: "fabrica", resumo: "Vistoria item a item: estanqueidade, elétrica, esquadrias e acabamento." },
  { id: "carregamento", nome: "Carregamento", t0: 31, t1: 35.5, dia0: 36, dia1: 36, local: "fabrica", resumo: "O pórtico iça o módulo pronto e apoia na carreta, já travado para viagem." },
  { id: "transporte", nome: "Transporte", t0: 35.5, t1: 41.5, dia0: 37, dia1: 37, local: "estrada", resumo: "Da fábrica em Aparecida de Goiânia até o terreno do cliente." },
  { id: "instalacao", nome: "Instalação", t0: 41.5, t1: 50, dia0: 38, dia1: 40, local: "cliente", resumo: "Guindaste posiciona o módulo nas sapatas ao lado da casa; ligações e deck." },
];

/** Depois da última etapa, a câmera ainda passeia pela entrega antes de recomeçar. */
export const DURACAO = 56;
export const DIAS_TOTAIS = 40;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const suave = (v: number) => {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
};
/** Progresso 0..1 de t dentro do trecho [a, b]. */
export const trecho = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

export function etapaEm(t: number): { etapa: Etapa; indice: number; u: number; entregue: boolean } {
  const ultima = ETAPAS[ETAPAS.length - 1];
  if (t >= ultima.t1) return { etapa: ultima, indice: ETAPAS.length - 1, u: 1, entregue: true };
  const indice = Math.max(0, ETAPAS.findIndex((e) => t < e.t1));
  const etapa = ETAPAS[indice];
  return { etapa, indice, u: trecho(t, etapa.t0, etapa.t1), entregue: false };
}

/** Dia de obra correspondente ao instante t. */
export function diaEm(t: number) {
  const { etapa, u, entregue } = etapaEm(t);
  if (entregue) return DIAS_TOTAIS;
  return Math.round(etapa.dia0 + (etapa.dia1 - etapa.dia0) * u);
}

/** Instantes-chave da cena (segundos). */
export const T = {
  estruturaChassi: [4.8, 6.4],
  estruturaPilares: [6.2, 8.2],
  estruturaVigas: [8.0, 10.0],
  paredes: [10.8, 15.6],
  academia: 17.2,
  cobertura: [22.6, 24.4],
  ripado: 24.2,
  scan: [28, 30.6],
  icar: [31.4, 35.2],
  viagem: [36, 41.2],
  guindaste: [42.4, 47.6],
  deck: 48.2,
} as const;

/** Cliente fictício para a demonstração. */
export const CLIENTE = {
  nome: "Família Andrade",
  pedido: "VL-2611",
  cidade: "Goiânia - GO",
  bairro: "Jardins Lisboa",
};

const academia = aplicarAtalho(CONFIG_INICIAL, buscarAtalho("academia")!);

/** Módulo vendido: academia 3x6 com ripado na testada, kit academia, fundação e deck. */
export const CONFIG_VENDIDA: Config = {
  ...academia,
  fachada: { tipo: "ripadoFrontal", cor: "grafite", wpc: "cumaru" },
  extras: { kitMobilia: true, deck: true, pergolado: false, fundacao: true, kitAirbnb: false },
  entrega: entregaPara(CLIENTE.cidade),
};

/** O que a cena mostra do módulo em cada instante (as trocas disparam as animações do configurador). */
export function configEm(t: number): Config {
  const vivencia = t >= T.academia ? "academia" : "estar";
  return {
    ...CONFIG_VENDIDA,
    vivencia,
    fachada: { ...CONFIG_VENDIDA.fachada, tipo: t >= T.ripado ? "ripadoFrontal" : "textura" },
    extras: { ...CONFIG_VENDIDA.extras, deck: t >= T.deck, fundacao: false },
  };
}

/** Itens da linha de montagem e o trecho do relógio em que cada um é executado. */
export const MONTAGEM: { nome: string; t0: number; t1: number }[] = [
  { nome: "Chassi e estrutura metálica", t0: 4.6, t1: 10.4 },
  { nome: "Paredes, isolamento e cobertura", t0: 10.6, t1: 16 },
  { nome: "Elétrica, iluminação e ar", t0: 16, t1: 19.5 },
  { nome: "Piso emborrachado e espelho", t0: 17, t1: 21 },
  { nome: "Kit academia", t0: 17.2, t1: 22.4 },
  { nome: "Esquadria de vidro", t0: 22.6, t1: 25 },
  { nome: "Fachada ripada em WPC", t0: 24.2, t1: 27.4 },
];

export const CHECKLIST: { nome: string; t: number }[] = [
  { nome: "Prumo e nível da estrutura", t: 28.1 },
  { nome: "Estanqueidade da cobertura", t: 28.6 },
  { nome: "Teste dos circuitos elétricos", t: 29.1 },
  { nome: "Ar-condicionado e iluminação", t: 29.6 },
  { nome: "Esquadria: abertura e vedação", t: 30.1 },
  { nome: "Acabamento e limpeza", t: 30.6 },
];

export const INSTALACAO: { nome: string; t: number }[] = [
  { nome: "Sapatas de concreto prontas", t: 41.6 },
  { nome: "Içamento com guindaste", t: 44 },
  { nome: "Nivelamento sobre as sapatas", t: 47.4 },
  { nome: "Ligação elétrica na casa", t: 48 },
  { nome: "Deck em WPC", t: 49 },
  { nome: "Vistoria e entrega das chaves", t: 50 },
];
