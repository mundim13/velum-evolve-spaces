import { useMemo } from "react";
import * as THREE from "three";
import { ESPESSURA_PAREDE as T, type Abertura } from "@/lib/modulos-3x6/regras";
import { Caixa } from "./Caixa";
import { paraLocal, type QuadroFace } from "./faces";
import { COR, materialVidro } from "./materiais";

const PERFIL = 0.05;

function Vidro({ x, y, w, h, z }: { x: number; y: number; w: number; h: number; z: number }) {
  return (
    <mesh position={[x, y, z]} material={materialVidro}>
      <planeGeometry args={[w, h]} />
    </mesh>
  );
}

/** Porta de correr de alumínio preto e vidro: duas folhas até 3 m de vão, quatro acima disso. */
function PortaCorrer({ x0, x1, y0, y1 }: { x0: number; x1: number; y0: number; y1: number }) {
  const largura = x1 - x0;
  const altura = y1 - y0;
  if (largura < 0.3) return null;
  const folhas = largura > 3.2 ? 4 : 2;
  const luz = largura - 2 * PERFIL;
  const larguraFolha = luz / folhas + 0.03;
  const hFolha = altura - 2 * PERFIL;
  const yc = y0 + altura / 2;

  return (
    <group>
      <Caixa p={[x0 + PERFIL / 2, yc, -T / 2]} s={[PERFIL, altura, T]} cor={COR.perfil} />
      <Caixa p={[x1 - PERFIL / 2, yc, -T / 2]} s={[PERFIL, altura, T]} cor={COR.perfil} />
      <Caixa p={[(x0 + x1) / 2, y1 - PERFIL / 2, -T / 2]} s={[largura, PERFIL, T]} cor={COR.perfil} />
      <Caixa p={[(x0 + x1) / 2, y0 + PERFIL / 2, -T / 2]} s={[largura, PERFIL, T]} cor={COR.perfil} />
      {Array.from({ length: folhas }, (_, i) => {
        const cx = x0 + PERFIL + luz * ((i + 0.5) / folhas);
        const z = -T / 2 + (i % 2 === 0 ? 0.022 : -0.022);
        const b = 0.045;
        return (
          <group key={i}>
            <Caixa p={[cx - larguraFolha / 2 + b / 2, yc, z]} s={[b, hFolha, 0.03]} cor={COR.perfil} />
            <Caixa p={[cx + larguraFolha / 2 - b / 2, yc, z]} s={[b, hFolha, 0.03]} cor={COR.perfil} />
            <Caixa p={[cx, yc + hFolha / 2 - b / 2, z]} s={[larguraFolha, b, 0.03]} cor={COR.perfil} />
            <Caixa p={[cx, yc - hFolha / 2 + b / 2, z]} s={[larguraFolha, b, 0.03]} cor={COR.perfil} />
            <Vidro x={cx} y={yc} w={larguraFolha - 2 * b} h={hFolha - 2 * b} z={z} />
          </group>
        );
      })}
    </group>
  );
}

/** Janela vertical estreita de perfil preto, com travessas (o basculante do banheiro tem três vidros). */
function Janela({ x0, x1, y0, y1, travessas }: { x0: number; x1: number; y0: number; y1: number; travessas: number[] }) {
  const largura = x1 - x0;
  const altura = y1 - y0;
  const xc = (x0 + x1) / 2;
  const yc = (y0 + y1) / 2;
  const z = -T * 0.35;
  return (
    <group>
      <Caixa p={[x0 + PERFIL / 2, yc, z]} s={[PERFIL, altura, 0.06]} cor={COR.perfil} />
      <Caixa p={[x1 - PERFIL / 2, yc, z]} s={[PERFIL, altura, 0.06]} cor={COR.perfil} />
      <Caixa p={[xc, y1 - PERFIL / 2, z]} s={[largura, PERFIL, 0.06]} cor={COR.perfil} />
      <Caixa p={[xc, y0 + PERFIL / 2, z]} s={[largura, PERFIL, 0.06]} cor={COR.perfil} />
      {travessas.map((t) => (
        <Caixa key={t} p={[xc, y0 + altura * t, z]} s={[largura, 0.04, 0.05]} cor={COR.perfil} />
      ))}
      <Vidro x={xc} y={yc} w={largura - 2 * PERFIL} h={altura - 2 * PERFIL} z={z} />
    </group>
  );
}

let texturaVeneziana: THREE.CanvasTexture | null = null;
function materialVeneziana() {
  if (!texturaVeneziana) {
    const c = document.createElement("canvas");
    c.width = 16;
    c.height = 64;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#1c1c1c";
    ctx.fillRect(0, 0, 16, 64);
    ctx.fillStyle = "#050505";
    for (let y = 0; y < 64; y += 8) ctx.fillRect(0, y, 16, 3);
    texturaVeneziana = new THREE.CanvasTexture(c);
    texturaVeneziana.wrapS = texturaVeneziana.wrapT = THREE.RepeatWrapping;
    texturaVeneziana.repeat.set(1, 4);
    texturaVeneziana.colorSpace = THREE.SRGBColorSpace;
  }
  return new THREE.MeshStandardMaterial({ map: texturaVeneziana, roughness: 0.6, metalness: 0.2 });
}

/** Veneziana preta alta que fecha a laje técnica do fundo. Fica por cima da parede (e do ripado). */
function Veneziana({ x0, x1, y0, y1 }: { x0: number; x1: number; y0: number; y1: number }) {
  const mat = useMemo(materialVeneziana, []);
  return (
    <group>
      <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, 0.06]} material={mat}>
        <boxGeometry args={[x1 - x0, y1 - y0, 0.04]} />
      </mesh>
    </group>
  );
}

/** Renderiza uma abertura no sistema local da face. */
export function Esquadria({ abertura, quadro }: { abertura: Abertura; quadro: QuadroFace }) {
  const [x0, x1] = paraLocal(quadro, abertura.u0, abertura.u1);
  const { y0, y1 } = abertura;
  switch (abertura.tipo) {
    case "porta":
      return <PortaCorrer x0={x0} x1={x1} y0={y0} y1={y1} />;
    case "basculante":
      return <Janela x0={x0} x1={x1} y0={y0} y1={y1} travessas={[0.42, 0.72]} />;
    case "janela":
      return <Janela x0={x0} x1={x1} y0={y0} y1={y1} travessas={[0.62]} />;
    case "veneziana":
      return <Veneziana x0={x0} x1={x1} y0={y0} y1={y1} />;
  }
}

/** Arandela preta cúbica com fresta de luz, dos dois lados da porta principal. */
export function Arandela({ x, y }: { x: number; y: number }) {
  return (
    <group position={[x, y, 0.1]}>
      <Caixa p={[0, 0, 0]} s={[0.11, 0.11, 0.08]} cor={COR.perfil} />
      <Caixa p={[0, -0.01, 0.041]} s={[0.09, 0.012, 0.002]} cor={COR.led} emissivo />
      <Caixa p={[0, 0.025, 0.041]} s={[0.09, 0.012, 0.002]} cor={COR.led} emissivo />
    </group>
  );
}
