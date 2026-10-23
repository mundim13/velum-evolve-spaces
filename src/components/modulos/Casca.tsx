import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import {
  CHASSI,
  ESPESSURA_PAREDE as T,
  LARGURA,
  aberturas as calcularAberturas,
  type Abertura,
} from "@/lib/modulos-3x6/regras";
import { tabela, type Config, type Face, type FaceEsquadria } from "@/lib/modulos-3x6/tipos";
import { Caixa } from "./Caixa";
import { Arandela, Esquadria } from "./Esquadria";
import { FACES, paraLocal, quadroFace } from "./faces";
import { MOLDURA, Ripado, useMaterialFachada } from "./Fachada";
import { COR, MAT } from "./materiais";
import { Parede } from "./Parede";
import { Banheiro } from "./zonas/Banheiro";
import { Cozinha } from "./zonas/Cozinha";
import { Divisorias, TETO } from "./zonas/Divisorias";
import { Vivencia } from "./zonas/Vivencia";

/** Vão principal animado: o vidro abre a parede até o tamanho certo. */
function useVaoAnimado(alvo: Abertura): Abertura {
  const [atual, setAtual] = useState<Abertura>(alvo);
  const ref = useRef(atual);
  ref.current = atual;

  useEffect(() => {
    // Trocou de face: o vão nasce do centro na face nova.
    if (ref.current.face !== alvo.face) {
      const centro = (alvo.u0 + alvo.u1) / 2;
      setAtual({ ...alvo, u0: centro, u1: centro });
    }
  }, [alvo]);

  useFrame((state, dt) => {
    const a = ref.current;
    if (a.face !== alvo.face) return;
    const d0 = alvo.u0 - a.u0;
    const d1 = alvo.u1 - a.u1;
    if (Math.abs(d0) < 0.002 && Math.abs(d1) < 0.002) {
      if (a.u0 !== alvo.u0 || a.u1 !== alvo.u1) setAtual(alvo);
      return;
    }
    const k = Math.min(1, Math.min(dt, 1 / 15) * 7);
    setAtual({ ...alvo, u0: a.u0 + d0 * k, u1: a.u1 + d1 * k });
    state.invalidate();
  });

  return atual;
}

const geometriaPlano = new THREE.PlaneGeometry(1, 1);

/** Camada clicável sobre as faces que aceitam a esquadria principal: tocar na face escolhe onde fica o vidro. */
function SeletorFaces({
  config,
  onEscolher,
}: {
  config: Config;
  onEscolher: (face: FaceEsquadria) => void;
}) {
  const [sobre, setSobre] = useState<Face | null>(null);
  const faces: FaceEsquadria[] = ["testada", "ladoA", "ladoB"];
  return (
    <>
      {faces.map((face) => {
        const q = quadroFace(face, config.comprimento);
        const comp = face === "testada" ? LARGURA : config.comprimento;
        const escolhida = config.esquadria.face === face;
        const opacidade = escolhida ? 0.12 : sobre === face ? 0.16 : 0.05;
        return (
          <group key={face} position={q.pos} rotation={[0, q.rotY, 0]}>
            <mesh
              geometry={geometriaPlano}
              position={[0, config.altura / 2, face === "testada" ? MOLDURA.profundidade + 0.03 : 0.08]}
              scale={[comp, config.altura, 1]}
              onClick={(e: ThreeEvent<MouseEvent>) => {
                if (e.delta > 8) return;
                e.stopPropagation();
                onEscolher(face);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setSobre(face);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setSobre(null);
                document.body.style.cursor = "";
              }}
            >
              <meshBasicMaterial color="#22D3EE" transparent opacity={opacidade} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

interface Props {
  config: Config;
  escolhendoFace: boolean;
  onEscolherFace: (face: FaceEsquadria) => void;
}

/** Casca 3x6 paramétrica: o comprimento é variável e tudo (paredes, vãos, ripado, zonas) se recalcula a partir dele. */
export function Casca({ config, escolhendoFace, onEscolherFace }: Props) {
  const { comprimento: L, altura: H } = config;
  const meio = L / 2;

  const alvo = useMemo(() => calcularAberturas(config), [config]);
  const principalAlvo = alvo.find((a) => a.id === "principal")!;
  const principal = useVaoAnimado(principalAlvo);
  const lista = useMemo(() => alvo.map((a) => (a.id === "principal" ? principal : a)), [alvo, principal]);

  const corTextura = tabela.cores.textura[config.fachada.cor].hex;
  const corWpc = tabela.cores.wpc[config.fachada.wpc].hex;
  const matFachada = useMaterialFachada(corTextura);
  const matInterno = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COR.paredeInterna, roughness: 0.9, side: THREE.BackSide }),
    [],
  );

  const tipoFachada = config.fachada.tipo;
  const facePrincipal = principalAlvo.face;
  const facesRipado = useMemo<Face[]>(
    () => (tipoFachada === "ripadoCompleto" ? FACES : tipoFachada === "ripadoFrontal" ? [facePrincipal] : []),
    [tipoFachada, facePrincipal],
  );

  const quadroPrincipal = quadroFace(principal.face, L);
  const [px0, px1] = paraLocal(quadroPrincipal, principal.u0, principal.u1);
  const [faceU0, faceU1] = paraLocal(quadroPrincipal, quadroPrincipal.u[0], quadroPrincipal.u[1]);
  const margemArandela = principal.face === "testada" ? MOLDURA.lado + 0.06 : 0.12;

  return (
    <group>
      {/* Base preta do chassi e soleira saliente da testada. */}
      <Caixa p={[0, (CHASSI - 0.03) / 2, 0]} s={[L + 0.03, CHASSI - 0.03, LARGURA + 0.03]} mat={MAT.laca(COR.base)} />
      <Caixa p={[meio + 0.08, CHASSI - 0.02, 0]} s={[0.16, 0.05, LARGURA - 2 * MOLDURA.lado + 0.02]} mat={MAT.granito()} raio={0.006} />

      {/* Piso em porcelanato, forro e cobertura. */}
      <Caixa p={[0, CHASSI - 0.02, 0]} s={[L - 2 * T, 0.04, LARGURA - 2 * T]} mat={MAT.piso()} />
      <mesh position={[0, TETO, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[L - 2 * T, LARGURA - 2 * T, 1]} geometry={geometriaPlano} material={MAT.pintura(COR.forro)} receiveShadow />
      <Caixa p={[0, (TETO + H) / 2 + 0.005, 0]} s={[L - 2 * T, H - TETO - 0.01, LARGURA - 2 * T]} mat={MAT.pintura("#7A7975")} />

      {/* As quatro faces, com vãos e esquadrias. */}
      {FACES.map((face) => {
        const q = quadroFace(face, L);
        const daFace = lista.filter((a) => a.face === face);
        return (
          <group key={face} position={q.pos} rotation={[0, q.rotY, 0]}>
            <Parede quadro={q} altura={H} aberturas={daFace} materialExterno={matFachada} materialInterno={matInterno} />
            {daFace.map((a) => (
              <Esquadria key={a.id} abertura={a} quadro={q} />
            ))}
          </group>
        );
      })}

      {/* Moldura saliente em textura emoldurando a testada. */}
      <group position={[meio, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {[-1, 1].map((lado) => (
          <Caixa
            key={lado}
            p={[lado * (LARGURA / 2 - MOLDURA.lado / 2), (CHASSI + H) / 2, MOLDURA.profundidade / 2]}
            s={[MOLDURA.lado, H - CHASSI, MOLDURA.profundidade]}
            mat={matFachada}
            raio={0.012}
           
          />
        ))}
        <Caixa
          p={[0, H - MOLDURA.topo / 2, MOLDURA.profundidade / 2]}
          s={[LARGURA, MOLDURA.topo, MOLDURA.profundidade]}
          mat={matFachada}
          raio={0.012}
         
        />
      </group>

      {/* Arandelas dos dois lados da porta principal. */}
      <group position={quadroPrincipal.pos} rotation={[0, quadroPrincipal.rotY, 0]}>
        {px1 - px0 > 0.5 &&
          [px0 - 0.2, px1 + 0.2]
            .filter((x) => x > faceU0 + margemArandela && x < faceU1 - margemArandela)
            .map((x) => <Arandela key={x > 0 ? "d" : "e"} x={x} y={CHASSI + 1.95} />)}
      </group>

      <Ripado
        ativo={config.fachada.tipo !== "textura"}
        faces={facesRipado}
        aberturas={alvo}
        comprimento={L}
        altura={H}
        cor={corWpc}
       
      />

      <Divisorias config={config} />
      <Banheiro config={config} />
      <Cozinha config={config} />
      <Vivencia config={config} />

      {escolhendoFace && <SeletorFaces config={config} onEscolher={onEscolherFace} />}
    </group>
  );
}
