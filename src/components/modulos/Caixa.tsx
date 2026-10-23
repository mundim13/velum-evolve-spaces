import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { material, uvEmMetros } from "./materiais";

type Vec3 = [number, number, number];

const cacheGeometrias = new Map<string, THREE.BufferGeometry>();
const mm = (v: number) => Math.round(v * 1000);

/** Geometria cacheada por tamanho real, com UV em metros (a textura mantém a escala em qualquer peça). */
function geometria(s: Vec3, raio: number, cilindro: boolean) {
  const chave = `${mm(s[0])}|${mm(s[1])}|${mm(s[2])}|${mm(raio)}|${cilindro ? 1 : 0}`;
  let g = cacheGeometrias.get(chave);
  if (!g) {
    if (cilindro) {
      g = new THREE.CylinderGeometry(s[0] / 2, s[0] / 2, s[1], 32);
      g.scale(1, 1, s[2] / s[0]);
    } else if (raio > 0) {
      const r = Math.min(raio, s[0] / 2 - 0.0005, s[1] / 2 - 0.0005, s[2] / 2 - 0.0005);
      g = new RoundedBoxGeometry(s[0], s[1], s[2], 2, Math.max(r, 0.0005));
    } else {
      g = new THREE.BoxGeometry(s[0], s[1], s[2]);
    }
    uvEmMetros(g);
    cacheGeometrias.set(chave, g);
  }
  return g;
}

interface Props {
  /** Centro da caixa. */
  p: Vec3;
  /** Dimensões em metros. */
  s: Vec3;
  cor?: string;
  mat?: THREE.Material;
  rugosidade?: number;
  metal?: number;
  emissivo?: boolean;
  cilindro?: boolean;
  /** Raio do arredondamento das arestas, em metros (estofados, louças, tampos). */
  raio?: number;
  rotY?: number;
  sombra?: boolean;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
}

/** Bloco básico de todo o mobiliário e acabamento. */
export function Caixa({ p, s, cor = "#ffffff", mat, rugosidade, metal, emissivo, cilindro, raio = 0, rotY = 0, sombra = true, onClick }: Props) {
  return (
    <mesh
      position={p}
      rotation={[0, rotY, 0]}
      geometry={geometria(s, raio, !!cilindro)}
      material={mat ?? material(cor, { rugosidade, metal, emissivo })}
      castShadow={sombra && !emissivo}
      receiveShadow={!emissivo}
      onClick={onClick}
    />
  );
}
