import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { material } from "./materiais";

const geometriaCaixa = new THREE.BoxGeometry(1, 1, 1);
const geometriaCilindro = new THREE.CylinderGeometry(0.5, 0.5, 1, 20);

type Vec3 = [number, number, number];

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
  rotY?: number;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
}

/** Bloco básico de todo o mobiliário e acabamento: uma geometria unitária compartilhada, escalada. */
export function Caixa({ p, s, cor = "#ffffff", mat, rugosidade, metal, emissivo, cilindro, rotY = 0, onClick }: Props) {
  return (
    <mesh
      position={p}
      scale={s}
      rotation={[0, rotY, 0]}
      geometry={cilindro ? geometriaCilindro : geometriaCaixa}
      material={mat ?? material(cor, { rugosidade, metal, emissivo })}
      onClick={onClick}
    />
  );
}
