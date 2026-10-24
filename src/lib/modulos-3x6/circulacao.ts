import type { Colocada, Layout, Ret } from "./layout";

/** Passagem mínima para uma pessoa (metade dela de cada lado do eixo de quem anda). */
export const PASSAGEM = 0.5;
/** Até onde a pessoa precisa chegar perto de um móvel para usá-lo. */
const ALCANCE = 0.45;
/** Peças decorativas: não precisam de acesso. */
const DECORATIVAS = new Set(["planta", "criado-mudo", "espelho", "espelho-corpo", "kettlebells", "rack-tv"]);

const dentro = (r: Ret, x: number, z: number) => x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1;
const distancia = (r: Ret, x: number, z: number) => Math.hypot(Math.max(r.x0 - x, 0, x - r.x1), Math.max(r.z0 - z, 0, z - r.z1));

/** Faixa de uso de uma peça: na frente e nas laterais (encostada na parede) ou em volta (solta). */
function faixaDeUso(p: Colocada): Ret[] {
  const r = p.rect;
  const a = ALCANCE;
  const volta: Ret[] = [
    { x0: r.x0 - a, x1: r.x0, z0: r.z0, z1: r.z1 },
    { x0: r.x1, x1: r.x1 + a, z0: r.z0, z1: r.z1 },
    { x0: r.x0, x1: r.x1, z0: r.z0 - a, z1: r.z0 },
    { x0: r.x0, x1: r.x1, z0: r.z1, z1: r.z1 + a },
  ];
  if (!p.parede) return volta;
  // Encostada: a faixa do lado da parede não conta.
  const lado = { cabeceira: 2, lateral: 3, testada: 1, fundo: 0 }[p.parede];
  return volta.filter((_, i) => i !== lado);
}

/** Total de problemas de circulação (para comparar arranjos e posições). */
export const falhasDeCirculacao = (r: Circulacao) => r.portasIsoladas + r.semAcesso.length;

export interface Circulacao {
  /** Portas e passagens (banheiro, cozinha) que não se alcançam a partir da porta de vidro. */
  portasIsoladas: number;
  /** Peças de uso sem acesso a partir da porta de vidro. */
  semAcesso: string[];
}

/**
 * Simula uma pessoa entrando pela porta de vidro: numa grade (5 cm por padrão), anda só onde cabe a passagem mínima
 * (longe dos móveis e das paredes) e confere se chega a cada porta interna e à frente de cada móvel de uso.
 */
export function circulacao(l: Pick<Layout, "sala" | "vaos" | "zonas" | "pecas">, PASSO = 0.05): Circulacao {
  const { a, b, zA, zB } = l.sala;
  // Grade grossa fica conservadora: meia célula a mais de folga, para nunca aprovar o que a fina reprova.
  const r = PASSAGEM / 2 + Math.max(0, PASSO - 0.05) / 2;
  const nx = Math.round((b - a) / PASSO);
  const nz = Math.round((zB - zA) / PASSO);
  const px = (i: number) => a + (i + 0.5) * PASSO;
  const pz = (k: number) => zA + (k + 0.5) * PASSO;
  // Na porta e nas passagens, a pessoa pode encostar na parede (é ali que ela entra).
  const livre = (i: number, k: number) => {
    const x = px(i);
    const z = pz(k);
    if (l.pecas.some((p) => !p.pisavel && distancia(p.rect, x, z) < r)) return false;
    if (l.zonas.some((zn) => dentro(zn, x, z))) return true;
    return x - a >= r && b - x >= r && z - zA >= r && zB - z >= r;
  };
  const ok: boolean[] = [];
  for (let i = 0; i < nx; i++) for (let k = 0; k < nz; k++) ok[i * nz + k] = livre(i, k);

  // Busca em largura a partir das células livres na frente da porta de vidro.
  const principal = l.vaos.find((v) => v.id === "principal");
  const zonasPrincipal = l.zonas.filter((z) => principal && (z.x1 >= b - 1e-6 || z.z0 <= zA + 1e-6 || z.z1 >= zB - 1e-6 || z.x0 <= a + 1e-6));
  const visto = new Uint8Array(nx * nz);
  const fila: number[] = [];
  for (let i = 0; i < nx; i++)
    for (let k = 0; k < nz; k++) {
      const id = i * nz + k;
      if (!ok[id]) continue;
      const x = px(i);
      const z = pz(k);
      const naPrincipal = principal && zonasPrincipal.some((zn) => dentro(zn, x, z) && portaPrincipal(l, zn));
      if (naPrincipal) {
        visto[id] = 1;
        fila.push(id);
      }
    }
  while (fila.length) {
    const id = fila.pop()!;
    const i = Math.floor(id / nz);
    const k = id % nz;
    for (const [di, dk] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const ni = i + di;
      const nk = k + dk;
      if (ni < 0 || nk < 0 || ni >= nx || nk >= nz) continue;
      const n = ni * nz + nk;
      if (!visto[n] && ok[n]) {
        visto[n] = 1;
        fila.push(n);
      }
    }
  }
  const alcanca = (alvos: Ret[]) => {
    for (let i = 0; i < nx; i++)
      for (let k = 0; k < nz; k++) if (visto[i * nz + k] && alvos.some((t) => dentro(t, px(i), pz(k)))) return true;
    return false;
  };
  const internas = l.zonas.filter((z) => !portaPrincipal(l, z));
  return {
    portasIsoladas: internas.filter((z) => !alcanca([z])).length,
    semAcesso: l.pecas.filter((p) => !DECORATIVAS.has(p.tipo) && !alcanca(faixaDeUso(p))).map((p) => p.id),
  };
}

/** A zona livre é da porta de vidro (e não de uma porta interna da divisória)? */
function portaPrincipal(l: Pick<Layout, "sala" | "vaos">, z: Ret) {
  const v = l.vaos.find((x) => x.id === "principal");
  if (!v) return false;
  const { a, b, zA, zB } = l.sala;
  switch (v.parede) {
    case "testada":
      return Math.abs(z.x1 - b) < 1e-6;
    case "fundo":
      return Math.abs(z.x0 - a) < 1e-6 && !l.vaos.some((x) => x.id !== "principal" && x.parede === "fundo");
    case "cabeceira":
      return Math.abs(z.z0 - zA) < 1e-6;
    case "lateral":
      return Math.abs(z.z1 - zB) < 1e-6;
  }
}
