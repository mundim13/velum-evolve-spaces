import * as THREE from "three";

/** Paleta tirada das fotos do Cazita real. */
export const COR = {
  perfil: "#151515",
  base: "#111111",
  madeira: "#BC9A76",
  madeiraEscura: "#94683F",
  pisoPorcelanato: "#CFCCC6",
  paredeInterna: "#EFEDE9",
  forro: "#F4F3F0",
  armarioVerde: "#4F6B53",
  granitoPreto: "#1B1B1C",
  porcelanatoBanheiro: "#C3BDB3",
  seixo: "#9DA898",
  louca: "#F6F6F4",
  inox: "#B9BCBF",
  led: "#FFD9A0",
  vidro: "#9FC3CF",
  gramado: "#4E6A35",
} as const;

const cacheMateriais = new Map<string, THREE.MeshStandardMaterial>();

/** Material padrão reaproveitado por cor, para manter poucas instâncias na cena. */
export function material(cor: string, opcoes: { rugosidade?: number; metal?: number; emissivo?: boolean } = {}) {
  const chave = `${cor}|${opcoes.rugosidade ?? 0.8}|${opcoes.metal ?? 0}|${opcoes.emissivo ? 1 : 0}`;
  let m = cacheMateriais.get(chave);
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color: cor,
      roughness: opcoes.rugosidade ?? 0.8,
      metalness: opcoes.metal ?? 0,
    });
    if (opcoes.emissivo) {
      m.emissive = new THREE.Color(cor);
      m.emissiveIntensity = 1.6;
      m.toneMapped = false;
    }
    cacheMateriais.set(chave, m);
  }
  return m;
}

export const materialVidro = new THREE.MeshPhysicalMaterial({
  color: COR.vidro,
  roughness: 0.05,
  metalness: 0.1,
  transparent: true,
  opacity: 0.28,
  side: THREE.DoubleSide,
  depthWrite: false,
});

function canvasTextura(tamanho: number, desenhar: (ctx: CanvasRenderingContext2D, t: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = tamanho;
  const ctx = canvas.getContext("2d")!;
  desenhar(ctx, tamanho);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

let ruido: THREE.CanvasTexture | null = null;
/** Ruído fino usado como bumpMap da textura acrílica da fachada. */
export function texturaRuido() {
  if (!ruido) {
    ruido = canvasTextura(128, (ctx, t) => {
      const img = ctx.createImageData(t, t);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 110 + Math.random() * 90;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    });
    ruido.repeat.set(3, 3);
  }
  return ruido;
}

let piso: THREE.CanvasTexture | null = null;
/** Porcelanato grande (90 cm) com rejunte fino. A repetição é ajustada por quem usa. */
export function texturaPiso() {
  if (!piso) {
    piso = canvasTextura(256, (ctx, t) => {
      ctx.fillStyle = COR.pisoPorcelanato;
      ctx.fillRect(0, 0, t, t);
      for (let i = 0; i < 900; i++) {
        ctx.fillStyle = `rgba(120,118,112,${Math.random() * 0.05})`;
        ctx.fillRect(Math.random() * t, Math.random() * t, 6 + Math.random() * 18, 2 + Math.random() * 8);
      }
      ctx.strokeStyle = "rgba(140,138,132,0.8)";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, t, t);
    });
  }
  return piso;
}

let madeira: THREE.CanvasTexture | null = null;
/** Veio vertical do painel amadeirado. */
export function texturaMadeira() {
  if (!madeira) {
    madeira = canvasTextura(256, (ctx, t) => {
      ctx.fillStyle = COR.madeira;
      ctx.fillRect(0, 0, t, t);
      for (let x = 0; x < t; x += 1) {
        const a = 0.04 + Math.abs(Math.sin(x * 0.21) * Math.sin(x * 0.037)) * 0.12;
        ctx.fillStyle = `rgba(90,58,30,${a})`;
        ctx.fillRect(x, 0, 1, t);
      }
    });
  }
  return madeira;
}

let gramado: THREE.CanvasTexture | null = null;
/** Disco de gramado que se dissolve no preto do site. */
export function texturaGramado() {
  if (!gramado) {
    gramado = canvasTextura(512, (ctx, t) => {
      ctx.fillStyle = COR.gramado;
      ctx.fillRect(0, 0, t, t);
      for (let i = 0; i < 9000; i++) {
        const v = Math.random();
        ctx.fillStyle = v > 0.5 ? "rgba(98,128,62,0.35)" : "rgba(40,58,28,0.35)";
        ctx.fillRect(Math.random() * t, Math.random() * t, 1.5, 3);
      }
      const g = ctx.createRadialGradient(t / 2, t / 2, t * 0.18, t / 2, t / 2, t / 2);
      g.addColorStop(0, "rgba(13,13,13,0)");
      g.addColorStop(1, "rgba(13,13,13,1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, t, t);
    });
    gramado.wrapS = gramado.wrapT = THREE.ClampToEdgeWrapping;
    gramado.colorSpace = THREE.SRGBColorSpace;
  }
  return gramado;
}

let madeiraMat: THREE.MeshStandardMaterial | null = null;
/** Painel amadeirado (cabeceira, divisória e portas de correr). */
export function materialMadeira() {
  if (!madeiraMat) {
    const map = texturaMadeira();
    map.colorSpace = THREE.SRGBColorSpace;
    madeiraMat = new THREE.MeshStandardMaterial({ map, roughness: 0.65 });
  }
  return madeiraMat;
}
