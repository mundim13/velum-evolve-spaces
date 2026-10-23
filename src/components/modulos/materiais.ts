import * as THREE from "three";

/** Paleta tirada das fotos do Cazita real. */
export const COR = {
  perfil: "#161616",
  base: "#101010",
  madeira: "#BC9A76",
  pisoPorcelanato: "#CDCAC4",
  paredeInterna: "#F1EFEB",
  forro: "#F4F3F0",
  armarioVerde: "#4C6A51",
  granitoPreto: "#1B1B1C",
  porcelanatoBanheiro: "#C9C2B7",
  seixo: "#9DA898",
  louca: "#F7F7F5",
  inox: "#C4C7CA",
  led: "#FFD9A0",
  vidro: "#C9DDE3",
} as const;

/* ---------------------------------------------------------------------------------------------
 * Carregamento progressivo das texturas PBR (public/modulos/texturas, geradas por
 * scripts/gerar-texturas-modulos.py). O material nasce só com a cor e ganha os mapas quando
 * chegam, então o módulo aparece na hora e "revela" o acabamento em seguida.
 * As geometrias usam UV em metros, então a repetição é 1 / (metros cobertos pela textura).
 * ------------------------------------------------------------------------------------------- */

const PASTA = "/modulos/texturas/";
const carregador = new THREE.TextureLoader();
const imagens = new Map<string, Promise<THREE.Texture>>();
let pedirQuadro: () => void = () => {};

/** O Canvas registra aqui o invalidate(), para redesenhar quando uma textura chega (frameloop "demand"). */
export function registrarRedesenho(fn: () => void) {
  pedirQuadro = fn;
}

function textura(nome: string, cor: boolean, metros: number, repeticaoExtra: [number, number] = [1, 1]) {
  let base = imagens.get(nome);
  if (!base) {
    base = carregador.loadAsync(`${PASTA}${nome}.webp`);
    imagens.set(nome, base);
  }
  return base.then((t) => {
    const c = t.clone();
    c.wrapS = c.wrapT = THREE.RepeatWrapping;
    c.repeat.set(repeticaoExtra[0] / metros, repeticaoExtra[1] / metros);
    c.colorSpace = cor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    c.anisotropy = 8;
    c.needsUpdate = true;
    return c;
  });
}

interface DefinicaoPBR {
  cor: string;
  /** Cor usada enquanto o mapa de cor não chega (quando a cor final é branca, só multiplicando o mapa). */
  corPrevia?: string;
  rugosidade: number;
  metal?: number;
  /** Nome do conjunto de texturas (prefixo dos arquivos). */
  conjunto?: string;
  metros?: number;
  mapas?: ("cor" | "normal" | "rug")[];
  normal?: number;
  /** Repetição adicional (por exemplo, para comprimir o veio nas ripas instanciadas). */
  repeticao?: [number, number];
}

function pbr(d: DefinicaoPBR) {
  const m = new THREE.MeshStandardMaterial({
    color: d.corPrevia ?? d.cor,
    roughness: d.rugosidade,
    metalness: d.metal ?? 0,
  });
  if (d.conjunto && typeof document !== "undefined") {
    const metros = d.metros ?? 1;
    for (const tipo of d.mapas ?? ["cor", "normal"]) {
      textura(`${d.conjunto}_${tipo}`, tipo === "cor", metros, d.repeticao)
        .then((t) => {
          if (tipo === "cor") {
            m.map = t;
            // Só troca a cor prévia; materiais tingidos (reboco, WPC) mantêm a cor animada.
            if (d.corPrevia) m.color.set(d.cor);
          }
          if (tipo === "normal") {
            m.normalMap = t;
            m.normalScale.setScalar(d.normal ?? 1);
          }
          if (tipo === "rug") m.roughnessMap = t;
          m.needsUpdate = true;
          pedirQuadro();
        })
        .catch(() => {
          // Sem a textura, o material continua com a cor lisa.
        });
    }
  }
  return m;
}

const unicos = new Map<string, THREE.Material>();
function unico<T extends THREE.Material>(chave: string, criar: () => T): T {
  let m = unicos.get(chave) as T | undefined;
  if (!m) {
    m = criar();
    unicos.set(chave, m);
  }
  return m;
}

/** Biblioteca de materiais do showroom. Cada um é criado uma vez e compartilhado. */
export const MAT = {
  piso: () =>
    unico("piso", () => pbr({ cor: "#FFFFFF", corPrevia: COR.pisoPorcelanato, rugosidade: 1, conjunto: "piso", metros: 1.8, mapas: ["cor", "normal", "rug"], normal: 0.8 })),
  paredeBanheiro: () =>
    unico("paredeBanheiro", () =>
      pbr({ cor: "#FFFFFF", corPrevia: COR.porcelanatoBanheiro, rugosidade: 1, conjunto: "parede_banheiro", metros: 1.2, mapas: ["cor", "normal", "rug"], normal: 0.8 }),
    ),
  madeira: () => unico("madeira", () => pbr({ cor: "#FFFFFF", corPrevia: COR.madeira, rugosidade: 0.55, conjunto: "madeira", metros: 1.2, normal: 0.35 })),
  madeiraMovel: () =>
    unico("madeiraMovel", () => pbr({ cor: "#B48A66", rugosidade: 0.5, conjunto: "madeira", metros: 1.2, normal: 0.35 })),
  seixo: () => unico("seixo", () => pbr({ cor: "#FFFFFF", corPrevia: COR.seixo, rugosidade: 0.55, conjunto: "seixo", metros: 0.8, normal: 1.2 })),
  granito: () => unico("granito", () => pbr({ cor: "#FFFFFF", corPrevia: COR.granitoPreto, rugosidade: 0.22, conjunto: "granito", metros: 0.6, mapas: ["cor"] })),
  tecido: (cor: string) => unico(`tecido-${cor}`, () => pbr({ cor, rugosidade: 0.95, conjunto: "tecido", metros: 0.25, normal: 0.6 })),
  pintura: (cor: string) => unico(`pintura-${cor}`, () => pbr({ cor, rugosidade: 0.88 })),
  laca: (cor: string) => unico(`laca-${cor}`, () => pbr({ cor, rugosidade: 0.42 })),
  perfil: () => unico("perfil", () => pbr({ cor: COR.perfil, rugosidade: 0.38, metal: 0.55 })),
  inox: () => unico("inox", () => pbr({ cor: COR.inox, rugosidade: 0.22, metal: 1 })),
  espelho: () => unico("espelho", () => pbr({ cor: "#E8ECEE", rugosidade: 0.02, metal: 1 })),
  louca: () =>
    unico(
      "louca",
      () => new THREE.MeshPhysicalMaterial({ color: COR.louca, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05 }),
    ),
  vidro: () =>
    unico(
      "vidro",
      () =>
        new THREE.MeshPhysicalMaterial({
          color: COR.vidro,
          roughness: 0.02,
          metalness: 0,
          ior: 1.5,
          transparent: true,
          opacity: 0.16,
          envMapIntensity: 2.2,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
    ),
  led: (cor: string = COR.led, intensidade = 2.4) =>
    unico(`led-${cor}-${intensidade}`, () => {
      const m = new THREE.MeshStandardMaterial({ color: cor, emissive: cor, emissiveIntensity: intensidade });
      m.toneMapped = false;
      return m;
    }),
};

/** Material da textura acrílica da casca. Um por instância de Casca, porque a cor é animada. */
export function criarMaterialReboco(cor: string) {
  const m = pbr({ cor, rugosidade: 0.93, conjunto: "reboco", metros: 0.5, normal: 1.1 });
  m.side = THREE.DoubleSide;
  return m;
}

/** WPC do ripado: veio neutro tingido pelo tom; a repetição vertical compensa a ripa esticada. */
export function criarMaterialWpc(cor: string) {
  return pbr({ cor, rugosidade: 0.62, conjunto: "wpc", metros: 0.5, normal: 0.8, repeticao: [0.12, 2.6] });
}

/** Material liso genérico, por cor. */
export function material(cor: string, opcoes: { rugosidade?: number; metal?: number; emissivo?: boolean } = {}) {
  if (opcoes.emissivo) return MAT.led(cor);
  return unico(`liso-${cor}-${opcoes.rugosidade ?? 0.8}-${opcoes.metal ?? 0}`, () =>
    pbr({ cor, rugosidade: opcoes.rugosidade ?? 0.8, metal: opcoes.metal }),
  );
}

/* ------------------------------------------- UV em metros ------------------------------------------- */

/**
 * Reescreve as UVs por projeção em caixa (pela normal dominante), em metros reais.
 * Assim a mesma textura tem a mesma escala em qualquer móvel, parede ou piso.
 */
export function uvEmMetros(geo: THREE.BufferGeometry) {
  const pos = geo.getAttribute("position");
  const nor = geo.getAttribute("normal");
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const nx = Math.abs(nor.getX(i));
    const ny = Math.abs(nor.getY(i));
    const nz = Math.abs(nor.getZ(i));
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (ny >= nx && ny >= nz) {
      uv[i * 2] = x;
      uv[i * 2 + 1] = z;
    } else if (nx >= nz) {
      uv[i * 2] = z;
      uv[i * 2 + 1] = y;
    } else {
      uv[i * 2] = x;
      uv[i * 2 + 1] = y;
    }
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geo;
}
