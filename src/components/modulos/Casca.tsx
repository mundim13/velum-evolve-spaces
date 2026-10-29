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
import type { Ambiente } from "@/lib/modulos-3x6/layout";
import { tabela, type Config, type Face, type FaceEsquadria } from "@/lib/modulos-3x6/tipos";
import { Caixa } from "./Caixa";
import { Arandela, Esquadria } from "./Esquadria";
import { FACES, paraLocal, quadroFace } from "./faces";
import { MOLDURA, PLATIBANDA, Ripado, useMaterialFachada } from "./Fachada";
import { COR, MAT } from "./materiais";
import { Parede } from "./Parede";
import { SombraContato, useSombraCasca } from "./sombra";
import { Banheiro } from "./zonas/Banheiro";
import { Cozinha } from "./zonas/Cozinha";
import { Divisorias, TETO } from "./zonas/Divisorias";
import { Externos } from "./zonas/Externos";
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

/** Contorno retangular de uma face (quatro réguas finas), em ciano. */
function Contorno({ largura, altura, espessura, opacidade }: { largura: number; altura: number; espessura: number; opacidade: number }) {
  const reguas: [number, number, number, number][] = [
    [0, altura - espessura / 2, largura, espessura],
    [0, espessura / 2, largura, espessura],
    [-largura / 2 + espessura / 2, altura / 2, espessura, altura],
    [largura / 2 - espessura / 2, altura / 2, espessura, altura],
  ];
  return (
    <>
      {reguas.map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0]} scale={[w, h, 1]} geometry={geometriaPlano} renderOrder={10}>
          <meshBasicMaterial color="#22D3EE" transparent opacity={opacidade} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

/**
 * Camada clicável sobre as faces que aceitam a esquadria principal: tocar na face escolhe onde fica o vidro.
 * A face fica marcada só pelo contorno ciano (sem véu por cima), para o vidro continuar transparente.
 */
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
        const destaque = escolhida || sobre === face;
        const afastamento = face === "testada" ? MOLDURA.profundidade + 0.03 : 0.08;
        return (
          <group key={face} position={q.pos} rotation={[0, q.rotY, 0]}>
            {/* Plano de toque invisível (não pinta nada, só recebe o clique). */}
            <mesh
              geometry={geometriaPlano}
              position={[0, config.altura / 2, afastamento]}
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
              <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
            </mesh>
            <group position={[0, 0, afastamento + 0.005]}>
              <Contorno largura={comp + 0.06} altura={config.altura + 0.04} espessura={destaque ? 0.05 : 0.025} opacidade={escolhida ? 1 : sobre === face ? 0.85 : 0.45} />
            </group>
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
  /** Força o ambiente da vivência (a página da franquia usa a loja Teslink). */
  ambiente?: Ambiente;
}

/** Casca 3x6 paramétrica: o comprimento é variável e tudo (paredes, vãos, ripado, zonas) se recalcula a partir dele. */
export function Casca({ config, escolhendoFace, onEscolherFace, ambiente }: Props) {
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
  const sombra = useSombraCasca();
  // Com o ripado completo, a moldura é a única parte de textura que sobraria: vira arremate preto,
  // como as quinas e o rufo, para não deixar uma faixa na cor da textura em volta do ripado.
  const matMoldura = tipoFachada === "ripadoCompleto" ? MAT.perfil() : matFachada;
  // Nas faces com ripado, a platibanda fica sob as ripas e o rufo; no ripado completo, preta como os arremates.
  const matPlatibanda = tipoFachada === "ripadoCompleto" ? MAT.perfil() : matFachada;

  return (
    <group>
      {/* Base preta do chassi e soleira saliente da testada. */}
      <Caixa p={[0, (CHASSI - 0.03) / 2, 0]} s={[L + 0.03, CHASSI - 0.03, LARGURA + 0.03]} mat={MAT.laca(COR.base)} sombra={sombra} contato={false} />
      <Caixa p={[meio + 0.08, CHASSI - 0.02, 0]} s={[0.16, 0.05, LARGURA - 2 * MOLDURA.lado + 0.02]} mat={MAT.granito()} raio={0.006} sombra={sombra} contato={false} />

      {/* Piso em porcelanato, forro e cobertura. */}
      <Caixa p={[0, CHASSI - 0.02, 0]} s={[L - 2 * T, 0.04, LARGURA - 2 * T]} mat={MAT.piso()} contato={false} />
      <mesh position={[0, TETO, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[L - 2 * T, LARGURA - 2 * T, 1]} geometry={geometriaPlano} material={MAT.pintura(COR.forro)} receiveShadow />
      {/* Laje com manta escura, rebaixada dentro da platibanda. */}
      <Caixa p={[0, (TETO + H) / 2 + 0.005, 0]} s={[L - 2 * T, H - TETO - 0.01, LARGURA - 2 * T]} mat={MAT.manta()} sombra={sombra} contato={false} />
      {/* Platibanda: laterais e fundo sobem acima da laje (a testada sobe com a moldura), com a manta virando por dentro. */}
      {[-1, 1].map((lado) => (
        <group key={`plat-${lado}`}>
          <Caixa p={[0, H + PLATIBANDA / 2, lado * (LARGURA / 2 - T / 2)]} s={[L - 2 * T, PLATIBANDA, T]} mat={matPlatibanda} sombra={sombra} contato={false} />
          <Caixa p={[0, H + PLATIBANDA / 2 - 0.01, lado * (LARGURA / 2 - T - 0.004)]} s={[L - 2 * T, PLATIBANDA, 0.008]} mat={MAT.manta()} sombra={false} contato={false} />
        </group>
      ))}
      <Caixa p={[-meio + T / 2, H + PLATIBANDA / 2, 0]} s={[T, PLATIBANDA, LARGURA]} mat={matPlatibanda} sombra={sombra} contato={false} />
      <Caixa p={[-meio + T + 0.004, H + PLATIBANDA / 2 - 0.01, 0]} s={[0.008, PLATIBANDA, LARGURA - 2 * T]} mat={MAT.manta()} sombra={false} contato={false} />

      {/* Sombra pré-calculada na junta das paredes com o piso, para nada parecer flutuar. */}
      <SombraContato x={0} z={-LARGURA / 2 + T} w={L - 2 * T} d={0.3} />
      <SombraContato x={0} z={LARGURA / 2 - T} w={L - 2 * T} d={0.3} />
      <SombraContato x={-meio + T} z={0} w={0.3} d={LARGURA - 2 * T} />
      <SombraContato x={meio - T} z={0} w={0.3} d={LARGURA - 2 * T} />

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

      {/* Moldura saliente em textura (requadro de ~15 cm) emoldurando a testada e a porta, como na foto da fachada. */}
      <group position={[meio, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {[-1, 1].map((lado) => (
          <Caixa
            key={lado}
            p={[lado * (LARGURA / 2 - MOLDURA.lado / 2), (CHASSI + H + PLATIBANDA) / 2, MOLDURA.profundidade / 2]}
            s={[MOLDURA.lado, H + PLATIBANDA - CHASSI, MOLDURA.profundidade]}
            mat={matMoldura}
            raio={0.01}
            sombra={sombra}
            contato={false}
          />
        ))}
        {/* A peça de cima também cobre o topo da parede (5 mm acima, para não disputar o plano com ela). */}
        <Caixa
          p={[0, H + PLATIBANDA - MOLDURA.topo / 2, (MOLDURA.profundidade - T) / 2]}
          s={[LARGURA, MOLDURA.topo, MOLDURA.profundidade + T]}
          mat={matMoldura}
          raio={0.01}
          sombra={sombra}
          contato={false}
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
        altura={H + PLATIBANDA}
        cor={corWpc}
      />

      <Divisorias config={config} />
      <Banheiro config={config} />
      <Cozinha config={config} />
      <Vivencia config={config} ambiente={ambiente} />
      <Externos config={config} />

      {escolhendoFace && <SeletorFaces config={config} onEscolher={onEscolherFace} />}
    </group>
  );
}
