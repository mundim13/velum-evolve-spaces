import { ESPESSURA_PAREDE, LARGURA } from "@/lib/modulos-3x6/regras";
import type { Face } from "@/lib/modulos-3x6/tipos";

export interface QuadroFace {
  /** Centro da face externa, na cota do chão. */
  pos: [number, number, number];
  rotY: number;
  /** Converte u (coordenada da face no mundo) para o x local do grupo: xLocal = sinal * u. */
  sinal: 1 | -1;
  /** Trecho de u que a parede ocupa. As laterais param antes dos cantos, que ficam com a testada e o fundo. */
  u: [number, number];
}

/**
 * Cada face vira um grupo local em que x corre ao longo da parede, y para cima e z aponta para fora.
 * A superfície externa fica em z = 0 e a parede ocupa z de -espessura a 0.
 */
export function quadroFace(face: Face, comprimento: number): QuadroFace {
  const meio = comprimento / 2;
  const lat = meio - ESPESSURA_PAREDE;
  switch (face) {
    case "testada":
      return { pos: [meio, 0, 0], rotY: Math.PI / 2, sinal: -1, u: [-LARGURA / 2, LARGURA / 2] };
    case "fundo":
      return { pos: [-meio, 0, 0], rotY: -Math.PI / 2, sinal: 1, u: [-LARGURA / 2, LARGURA / 2] };
    case "ladoB":
      return { pos: [0, 0, LARGURA / 2], rotY: 0, sinal: 1, u: [-lat, lat] };
    case "ladoA":
      return { pos: [0, 0, -LARGURA / 2], rotY: Math.PI, sinal: -1, u: [-lat, lat] };
  }
}

/** Intervalo local [min, max] a partir de um trecho em u. */
export function paraLocal(q: QuadroFace, u0: number, u1: number): [number, number] {
  const a = q.sinal * u0;
  const b = q.sinal * u1;
  return a < b ? [a, b] : [b, a];
}

export const FACES: Face[] = ["testada", "ladoA", "fundo", "ladoB"];
