import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { ESPESSURA_PAREDE, type Abertura } from "@/lib/modulos-3x6/regras";
import { paraLocal, type QuadroFace } from "./faces";
import { useSombraCasca } from "./sombra";

interface Props {
  quadro: QuadroFace;
  altura: number;
  aberturas: Abertura[];
  materialExterno: THREE.Material;
  materialInterno: THREE.Material;
}

function forma(quadro: QuadroFace, altura: number, aberturas: Abertura[]) {
  const [x0, x1] = paraLocal(quadro, quadro.u[0], quadro.u[1]);
  const s = new THREE.Shape();
  s.moveTo(x0, 0);
  s.lineTo(x1, 0);
  s.lineTo(x1, altura);
  s.lineTo(x0, altura);
  s.closePath();
  for (const a of aberturas) {
    if (!a.recorta || a.u1 - a.u0 < 0.01) continue;
    const [h0, h1] = paraLocal(quadro, a.u0, a.u1);
    const furo = new THREE.Path();
    furo.moveTo(h0, a.y0);
    furo.lineTo(h0, a.y1);
    furo.lineTo(h1, a.y1);
    furo.lineTo(h1, a.y0);
    furo.closePath();
    s.holes.push(furo);
  }
  return s;
}

/** Uma face da casca: parede extrudada com os vãos recortados e o revestimento interno do lado de dentro. */
export function Parede({ quadro, altura, aberturas, materialExterno, materialInterno }: Props) {
  const sombra = useSombraCasca();
  const { externa, interna } = useMemo(() => {
    const f = forma(quadro, altura, aberturas);
    const externa = new THREE.ExtrudeGeometry(f, { depth: ESPESSURA_PAREDE, bevelEnabled: false });
    externa.translate(0, 0, -ESPESSURA_PAREDE);
    const interna = new THREE.ShapeGeometry(f);
    interna.translate(0, 0, -ESPESSURA_PAREDE - 0.003);
    return { externa, interna };
  }, [quadro, altura, aberturas]);

  useEffect(
    () => () => {
      externa.dispose();
      interna.dispose();
    },
    [externa, interna],
  );

  return (
    <>
      <mesh geometry={externa} material={materialExterno} castShadow={sombra} receiveShadow />
      <mesh geometry={interna} material={materialInterno} receiveShadow />
    </>
  );
}
