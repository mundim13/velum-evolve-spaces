import * as THREE from "three";

/*
 * Marcas da franquia (Teslink e Starlink), recriadas em canvas a partir das fotos da loja: viram texturas
 * para o letreiro, os adesivos da fachada e os painéis internos. Nada é baixado: a fonte é a do sistema.
 */

const FONTE = '"DM Sans", "Helvetica Neue", Arial, sans-serif';
const cache = new Map<string, THREE.CanvasTexture>();

function textura(chave: string, largura: number, altura: number, desenhar: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  let t = cache.get(chave);
  if (!t) {
    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d")!;
    desenhar(ctx, largura, altura);
    t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    cache.set(chave, t);
  }
  return t;
}

/** Texto com espaçamento entre letras (o canvas só tem letterSpacing em navegadores novos). */
function textoEspacado(ctx: CanvasRenderingContext2D, texto: string, xCentro: number, y: number, espaco: number) {
  const larguras = [...texto].map((l) => ctx.measureText(l).width);
  const total = larguras.reduce((s, w) => s + w, 0) + espaco * (texto.length - 1);
  let x = xCentro - total / 2;
  [...texto].forEach((l, i) => {
    ctx.fillText(l, x, y);
    x += larguras[i] + espaco;
  });
  return total;
}

/** Ícone de sinal da Teslink: triângulo apontando para a esquerda e duas barras verticais. */
function iconeTeslink(ctx: CanvasRenderingContext2D, x: number, yMeio: number, h: number, cor: string) {
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.moveTo(x, yMeio);
  ctx.lineTo(x + h * 0.45, yMeio - h * 0.32);
  ctx.lineTo(x + h * 0.45, yMeio + h * 0.32);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(x + h * 0.52, yMeio - h * 0.42, h * 0.1, h * 0.84);
  ctx.fillRect(x + h * 0.7, yMeio - h * 0.5, h * 0.1, h);
}

/** Logo TESLINK (palavra + ícone), em branco sobre transparente. */
export function texturaTeslink(cor = "#FFFFFF") {
  return textura(`teslink-${cor}`, 1024, 256, (ctx, w, h) => {
    ctx.fillStyle = cor;
    ctx.font = `500 150px ${FONTE}`;
    ctx.textBaseline = "middle";
    const largura = textoEspacado(ctx, "TESLINK", w / 2 - 70, h / 2 + 6, 18);
    iconeTeslink(ctx, w / 2 - 70 + largura / 2 + 22, h / 2, 150, cor);
  });
}

/** Letreiro "A CASA DA STARLINK", letras brancas soltas. */
export function texturaCasaStarlink() {
  return textura("casa-starlink", 2048, 256, (ctx, w, h) => {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 170px ${FONTE}`;
    ctx.textBaseline = "middle";
    textoEspacado(ctx, "A CASA DA STARLINK", w / 2, h / 2 + 8, 10);
  });
}

/** Painel STARLINK: fundo azul-noite, o planeta nascendo embaixo e a palavra em cima (como o outdoor da loja). */
export function texturaPainelStarlink() {
  return textura("painel-starlink", 1600, 960, (ctx, w, h) => {
    const fundo = ctx.createLinearGradient(0, 0, 0, h);
    fundo.addColorStop(0, "#05070D");
    fundo.addColorStop(1, "#0B1430");
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, w, h);
    // Estrelas.
    for (let i = 0; i < 160; i++) {
      const r = Math.abs(Math.sin(i * 91.7) * 43758.5) % 1;
      const s = Math.abs(Math.sin(i * 17.3) * 12345.6) % 1;
      ctx.fillStyle = `rgba(255,255,255,${0.25 + 0.6 * s})`;
      ctx.fillRect(r * w, ((s * 7.3) % 1) * h * 0.6, 2, 2);
    }
    // Planeta: disco azul com brilho na borda.
    const cx = w * 0.5;
    const cy = h * 1.35;
    const raio = h * 0.95;
    const planeta = ctx.createRadialGradient(cx - raio * 0.25, cy - raio * 0.6, raio * 0.1, cx, cy, raio);
    planeta.addColorStop(0, "#8EC5FF");
    planeta.addColorStop(0.45, "#2B6FD6");
    planeta.addColorStop(0.8, "#123C8C");
    planeta.addColorStop(1, "#0A1F4F");
    ctx.fillStyle = planeta;
    ctx.beginPath();
    ctx.arc(cx, cy, raio, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(160,210,255,0.85)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, raio + 2, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();
    // Nuvens claras no planeta.
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.ellipse(cx - raio * 0.6 + i * raio * 0.15, cy - raio * 0.82 + (i % 3) * 24, 90, 18, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `600 150px ${FONTE}`;
    ctx.textBaseline = "middle";
    textoEspacado(ctx, "STARLINK", w / 2, h * 0.24, 34);
  });
}

/** Caixa do kit Starlink (frente branca com a palavra e a foto da antena estilizada). */
export function texturaCaixaKit() {
  return textura("caixa-kit", 256, 320, (ctx, w, h) => {
    ctx.fillStyle = "#F4F4F2";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#111111";
    ctx.font = `600 34px ${FONTE}`;
    ctx.textBaseline = "middle";
    textoEspacado(ctx, "STARLINK", w / 2, 40, 5);
    ctx.save();
    ctx.translate(w / 2, h * 0.6);
    ctx.rotate(-0.35);
    ctx.fillStyle = "#D9DADC";
    ctx.fillRect(-70, -95, 140, 190);
    ctx.strokeStyle = "#9A9DA2";
    ctx.lineWidth = 3;
    ctx.strokeRect(-70, -95, 140, 190);
    ctx.restore();
  });
}
