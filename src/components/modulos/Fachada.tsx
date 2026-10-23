import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CHASSI, LARGURA, type Abertura } from "@/lib/modulos-3x6/regras";
import type { Face } from "@/lib/modulos-3x6/tipos";
import { paraLocal, quadroFace } from "./faces";
import { criarMaterialReboco, criarMaterialWpc } from "./materiais";

/** Moldura saliente da testada: o ripado frontal fica dentro dela. */
export const MOLDURA = { lado: 0.18, topo: 0.3, profundidade: 0.14 };

const RIPA = { passo: 0.1, largura: 0.062, profundidade: 0.03, folga: 0.025 };
const DURACAO = 1.1;

/** Material da textura acrílica da casca, com troca de cor animada. */
export function useMaterialFachada(cor: string) {
  // A cor inicial só vale na criação; as trocas seguintes são animadas abaixo.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mat = useMemo(() => criarMaterialReboco(cor), []);
  const alvo = useMemo(() => new THREE.Color(cor), [cor]);
  useFrame((state, dt) => {
    if (mat.color.equals(alvo)) return;
    mat.color.lerp(alvo, Math.min(1, Math.min(dt, 1 / 15) * 5));
    if (Math.abs(mat.color.r - alvo.r) + Math.abs(mat.color.g - alvo.g) + Math.abs(mat.color.b - alvo.b) < 0.004) {
      mat.color.copy(alvo);
    }
    state.invalidate();
  });
  return mat;
}

interface Segmento {
  x: number;
  y0: number;
  y1: number;
  /** Atraso relativo (0 a 1) da ripa na animação, pela posição ao longo da face. */
  atraso: number;
}

function segmentosDaFace(face: Face, comprimento: number, altura: number, aberturas: Abertura[]): Segmento[] {
  const q = quadroFace(face, comprimento);
  const meio = comprimento / 2;
  let uIni: number;
  let uFim: number;
  let topo = altura;
  if (face === "testada") {
    uIni = -LARGURA / 2 + MOLDURA.lado;
    uFim = LARGURA / 2 - MOLDURA.lado;
    topo = altura - MOLDURA.topo;
  } else if (face === "fundo") {
    uIni = -LARGURA / 2;
    uFim = LARGURA / 2;
  } else {
    uIni = -meio;
    uFim = meio;
  }
  const [x0, x1] = paraLocal(q, uIni, uFim);
  const furos = aberturas
    .filter((a) => a.face === face && a.u1 - a.u0 > 0.01)
    .map((a) => {
      const [h0, h1] = paraLocal(q, a.u0, a.u1);
      return { h0: h0 - RIPA.folga, h1: h1 + RIPA.folga, y0: a.y0 - RIPA.folga, y1: a.y1 + RIPA.folga };
    });

  const n = Math.floor((x1 - x0 - RIPA.largura) / RIPA.passo) + 1;
  const sobra = x1 - x0 - RIPA.largura - (n - 1) * RIPA.passo;
  const lista: Segmento[] = [];
  for (let i = 0; i < n; i++) {
    const x = x0 + sobra / 2 + RIPA.largura / 2 + i * RIPA.passo;
    const atraso = n > 1 ? i / (n - 1) : 0;
    const bloqueios = furos
      .filter((f) => x + RIPA.largura / 2 > f.h0 && x - RIPA.largura / 2 < f.h1)
      .sort((a, b) => a.y0 - b.y0);
    let y = CHASSI;
    for (const b of bloqueios) {
      if (b.y0 - y > 0.05) lista.push({ x, y0: y, y1: b.y0, atraso });
      y = Math.max(y, b.y1);
    }
    if (topo - y > 0.05) lista.push({ x, y0: y, y1: topo, atraso });
  }
  return lista;
}

const geometriaRipa = new THREE.BoxGeometry(1, 1, 1);
const auxiliar = new THREE.Object3D();
const suave = (t: number) => t * t * (3 - 2 * t);

function RipasDaFace({ segmentos, material, progresso }: {
  segmentos: Segmento[];
  material: THREE.Material;
  progresso: React.MutableRefObject<number>;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const ultimo = useRef(-1);

  const aplicar = (p: number) => {
    const mesh = ref.current;
    if (!mesh) return;
    segmentos.forEach((s, i) => {
      const t = suave(Math.min(1, Math.max(0, p * 1.6 - s.atraso * 0.6)));
      const h = (s.y1 - s.y0) * Math.max(t, 0.0001);
      auxiliar.position.set(s.x, s.y0 + h / 2, RIPA.profundidade / 2 + 0.002);
      auxiliar.scale.set(RIPA.largura, h, RIPA.profundidade);
      auxiliar.updateMatrix();
      mesh.setMatrixAt(i, auxiliar.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.visible = p > 0.001;
    ultimo.current = p;
  };

  useLayoutEffect(() => aplicar(progresso.current));
  useFrame(() => {
    if (ultimo.current !== progresso.current) aplicar(progresso.current);
  });

  return (
    <instancedMesh
      ref={ref}
      args={[geometriaRipa, material, segmentos.length]}
      frustumCulled={false}
      key={segmentos.length}
      castShadow
      receiveShadow
    />
  );
}

interface Props {
  ativo: boolean;
  faces: Face[];
  aberturas: Abertura[];
  comprimento: number;
  altura: number;
  cor: string;
}

/** Ripado WPC como geometria real (InstancedMesh), que cresce sobre a parede quando entra e recolhe quando sai. */
export function Ripado({ ativo, faces, aberturas, comprimento, altura, cor }: Props) {
  // Ao desligar, as ripas recolhem na última posição em que estavam.
  const ultimo = useRef({ faces, aberturas });
  if (ativo) ultimo.current = { faces, aberturas };
  const atual = ultimo.current;

  const porFace = useMemo(
    () =>
      atual.faces.map((face) => ({
        face,
        segmentos: segmentosDaFace(face, comprimento, altura, atual.aberturas),
      })),
    [atual.faces, atual.aberturas, comprimento, altura],
  );

  const progresso = useRef(0);
  const assinatura = porFace
    .map((f) => `${f.face}:${f.segmentos.map((s) => `${s.x.toFixed(2)}/${s.y0.toFixed(2)}`).join(",")}`)
    .join("|");
  const assinaturaAnterior = useRef(assinatura);
  useEffect(() => {
    // Mudou a face ou o vão com o ripado ligado: as ripas nascem de novo na posição certa.
    if (assinatura !== assinaturaAnterior.current && ativo) progresso.current = 0;
    assinaturaAnterior.current = assinatura;
  }, [assinatura, ativo]);

  // A cor inicial só vale na criação; as trocas de tom são animadas no useFrame.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const material = useMemo(() => criarMaterialWpc(cor), []);
  const corAlvo = useMemo(() => new THREE.Color(cor), [cor]);

  useFrame((state, dt) => {
    const alvo = ativo ? 1 : 0;
    let mexeu = false;
    if (progresso.current !== alvo) {
      const passo = Math.min(dt, 1 / 15) / DURACAO;
      progresso.current = alvo > progresso.current ? Math.min(1, progresso.current + passo) : Math.max(0, progresso.current - passo);
      mexeu = true;
    }
    if (!material.color.equals(corAlvo)) {
      material.color.lerp(corAlvo, Math.min(1, Math.min(dt, 1 / 15) * 5));
      if (Math.abs(material.color.r - corAlvo.r) + Math.abs(material.color.g - corAlvo.g) + Math.abs(material.color.b - corAlvo.b) < 0.004) {
        material.color.copy(corAlvo);
      }
      mexeu = true;
    }
    if (mexeu) state.invalidate();
  });

  return (
    <>
      {porFace.map(({ face, segmentos }) => {
        const q = quadroFace(face, comprimento);
        return (
          <group key={face} position={q.pos} rotation={[0, q.rotY, 0]}>
            <RipasDaFace segmentos={segmentos} material={material} progresso={progresso} />
          </group>
        );
      })}
    </>
  );
}
