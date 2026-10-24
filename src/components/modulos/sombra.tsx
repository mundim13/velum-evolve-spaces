import { createContext, useContext } from "react";
import * as THREE from "three";
import { CHASSI } from "@/lib/modulos-3x6/regras";

/**
 * Se a casca (paredes, divisórias, revestimentos, ripado, cobertura) projeta sombra do sol.
 * Por fora, sim. Na vista em corte, não: as paredes cortadas fariam feixes de sol diagonais no
 * interior, que parecem planos atravessando o ambiente. Os móveis continuam projetando sombra.
 */
export const SombraCasca = createContext(true);
export const useSombraCasca = () => useContext(SombraCasca);

/** Materiais com esta marca ficam fora do corte da vista por dentro (fundo, chão, sombras de contato do terreno). */
export const SEM_CORTE = "semCorte";

let texturaMancha: THREE.CanvasTexture | null = null;
/** Retângulo com borda bem difusa: a sombra de contato "pré-calculada" sob móveis e na base das paredes. */
function mancha() {
  if (!texturaMancha) {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.filter = "blur(14px)";
    ctx.fillStyle = "#000";
    ctx.fillRect(30, 30, 68, 68);
    texturaMancha = new THREE.CanvasTexture(c);
  }
  return texturaMancha;
}

let materialMancha: THREE.MeshBasicMaterial | null = null;
function matMancha() {
  if (!materialMancha) {
    materialMancha = new THREE.MeshBasicMaterial({
      color: "#1A140E",
      alphaMap: mancha(),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
  }
  return materialMancha;
}

const plano = new THREE.PlaneGeometry(1, 1);

/**
 * Sombra de contato sob uma peça apoiada no piso (largura x profundidade em metros).
 * A textura tem margem difusa, então a mancha passa um pouco da peça e escurece a junta com o chão.
 */
export function SombraContato({ x, z, w, d, rotY = 0, y = CHASSI }: { x: number; z: number; w: number; d: number; rotY?: number; y?: number }) {
  // A parte cheia da textura ocupa ~53% do quadro; a margem difusa fica fora da peça.
  const escala = 1 / 0.53;
  return (
    <mesh
      geometry={plano}
      material={matMancha()}
      position={[x, y + 0.002, z]}
      rotation={[-Math.PI / 2, 0, rotY]}
      scale={[w * escala, d * escala, 1]}
      renderOrder={1}
    />
  );
}
