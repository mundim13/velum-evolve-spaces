import { Component, lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { CHASSI, LARGURA } from "@/lib/modulos-3x6/regras";
import type { Config, FaceEsquadria } from "@/lib/modulos-3x6/tipos";
import { Casca } from "./Casca";
import { MAT, registrarRedesenho, texturaDegradeChao, uvEmMetros } from "./materiais";
import fotoCazita from "@/assets/modulos/cazita-fachada.webp";

export type ModoVista = "fora" | "dentro";

import { MOVEL } from "./dispositivo";

// Oclusão de ambiente, bloom e tone mapping chegam num pedaço separado, depois do primeiro quadro.
const Efeitos = lazy(() => import("./Efeitos"));
const DPR_MOVENDO = MOVEL ? 1 : 1.25;
const DPR_PARADO = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

const ALVO_FORA = new THREE.Vector3(0, 1.3, 0);
const ALVO_DENTRO = new THREE.Vector3(0, 0.5, 0);
/** Direção da câmera por fora, virada para a face em foco (a da esquadria principal). */
const DIRECAO_FORA: Record<FaceEsquadria, THREE.Vector3> = {
  testada: new THREE.Vector3(0.85, 0.42, 1).normalize(),
  ladoA: new THREE.Vector3(0.75, 0.42, -1.1).normalize(),
  ladoB: new THREE.Vector3(0.3, 0.42, 1.2).normalize(),
};
const DIRECAO_DENTRO = new THREE.Vector3(0.3, 1.55, 0.85).normalize();

function distancia(aspecto: number) {
  if (aspecto < 0.8) return 15;
  if (aspecto < 1.1) return 13.5;
  if (aspecto < 1.5) return 12.5;
  return 11.5;
}

function preset(modo: ModoVista, aspecto: number, foco: FaceEsquadria = "testada") {
  const d = distancia(aspecto);
  return modo === "fora"
    ? { alvo: ALVO_FORA.clone(), pos: ALVO_FORA.clone().addScaledVector(DIRECAO_FORA[foco], d) }
    : { alvo: ALVO_DENTRO.clone(), pos: ALVO_DENTRO.clone().addScaledVector(DIRECAO_DENTRO, d * 0.95) };
}

/**
 * Câmera orbital com transição suave entre a vista de fora e a de dentro (corte).
 * Enquanto a pessoa gira, a resolução cai; quando a câmera para, o quadro é refeito em alta resolução.
 */
function Camera({
  modo,
  foco,
  girar,
  onInteragir,
}: {
  modo: ModoVista;
  foco: FaceEsquadria;
  girar: boolean;
  onInteragir: () => void;
}) {
  const controles = useRef<OrbitControlsImpl>(null);
  const { camera, size, invalidate, setDpr } = useThree();
  const aspecto = size.width / Math.max(1, size.height);
  const faixaAspecto = distancia(aspecto);
  const [movendo, setMovendo] = useState(false);
  const espera = useRef<number>();
  const anim = useRef<{ t: number; de: { pos: THREE.Vector3; alvo: THREE.Vector3 }; para: { pos: THREE.Vector3; alvo: THREE.Vector3 } } | null>(null);

  useEffect(() => {
    setDpr(movendo || girar ? DPR_MOVENDO : DPR_PARADO);
    invalidate();
  }, [movendo, girar, setDpr, invalidate]);

  useEffect(() => {
    const c = controles.current;
    if (!c) return;
    anim.current = {
      t: 0,
      de: { pos: camera.position.clone(), alvo: c.target.clone() },
      para: preset(modo, aspecto, foco),
    };
    invalidate();
    // A transição só reinicia quando muda a vista, a face em foco ou a faixa de proporção da tela.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo, foco, faixaAspecto]);

  useFrame((state, dt) => {
    const a = anim.current;
    const c = controles.current;
    if (!a || !c) return;
    a.t = Math.min(1, a.t + Math.min(dt, 1 / 15) / 0.9);
    const e = 1 - Math.pow(1 - a.t, 3);
    camera.position.lerpVectors(a.de.pos, a.para.pos, e);
    c.target.lerpVectors(a.de.alvo, a.para.alvo, e);
    c.update();
    if (a.t >= 1) anim.current = null;
    state.invalidate();
  });

  // Com frameloop "demand", o giro automático precisa pedir quadros.
  useEffect(() => {
    if (!girar) return;
    let id = 0;
    const laco = () => {
      invalidate();
      id = requestAnimationFrame(laco);
    };
    laco();
    return () => cancelAnimationFrame(id);
  }, [girar, invalidate]);

  return (
    <OrbitControls
      ref={controles}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={5}
      maxDistance={22}
      maxPolarAngle={1.42}
      autoRotate={girar}
      autoRotateSpeed={0.5}
      onStart={() => {
        anim.current = null;
        window.clearTimeout(espera.current);
        setMovendo(true);
        onInteragir();
      }}
      onEnd={() => {
        window.clearTimeout(espera.current);
        espera.current = window.setTimeout(() => setMovendo(false), 350);
      }}
    />
  );
}

/**
 * Corte horizontal: na vista de dentro, cobertura e topo das paredes saem para mostrar o interior.
 * O plano vai em cada material (com clipShadows), e não no renderer, porque o corte global
 * do three.js não vale para as sombras: as paredes cortadas continuariam sombreando o interior.
 */
function Corte({ modo, chave }: { modo: ModoVista; chave: string }) {
  const { gl, scene, invalidate } = useThree();
  const plano = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 6), []);
  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);
  // Materiais novos entram na cena a cada troca; todos recebem o mesmo plano.
  useEffect(() => {
    const t = window.setTimeout(() => {
      scene.traverse((o) => {
        const m = (o as THREE.Mesh).material;
        if (!m) return;
        for (const mat of Array.isArray(m) ? m : [m]) {
          if (mat.clippingPlanes?.[0] === plano) continue;
          mat.clippingPlanes = [plano];
          mat.clipShadows = true;
          mat.needsUpdate = true;
        }
      });
      invalidate();
    }, 0);
    return () => window.clearTimeout(t);
  }, [chave, scene, plano, invalidate]);
  useFrame((state, dt) => {
    const alvo = modo === "dentro" ? CHASSI + 1.55 : 6;
    const d = alvo - plano.constant;
    if (Math.abs(d) < 0.002) return;
    plano.constant += d * Math.min(1, Math.min(dt, 1 / 15) * 5);
    // A sombra acompanha o corte enquanto ele se move.
    state.gl.shadowMap.needsUpdate = true;
    state.invalidate();
  });
  return null;
}

/**
 * Sombra do sol "pré-calculada": o shadow map só é refeito durante as trocas (móveis entrando,
 * ripas crescendo, vão abrindo). Girando a câmera, a sombra não é recalculada.
 */
function SombraSobDemanda({ chave }: { chave: string }) {
  const { gl, invalidate } = useThree();
  useEffect(() => {
    gl.shadowMap.autoUpdate = true;
    invalidate();
    const t = window.setTimeout(() => {
      gl.shadowMap.autoUpdate = false;
      gl.shadowMap.needsUpdate = true;
      invalidate();
    }, 2600);
    return () => window.clearTimeout(t);
  }, [chave, gl, invalidate]);
  return null;
}

function Redesenho() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => registrarRedesenho(invalidate), [invalidate]);
  return null;
}

/** Luz de ambiente de fim de tarde montada com painéis de luz (sem baixar HDRI). */
function Ambiente() {
  return (
    <Environment resolution={256} frames={1} environmentIntensity={0.85}>
      <color attach="background" args={["#2B2622"]} />
      {/* Céu: domo claro e levemente azulado em cima. */}
      <Lightformer form="rect" intensity={1.6} color="#E9EEF5" position={[0, 12, 0]} rotation-x={Math.PI / 2} scale={[40, 40, 1]} />
      {/* Sol baixo e quente, do lado da testada. */}
      <Lightformer form="circle" intensity={14} color="#FFD7A8" position={[14, 6, 9]} scale={[4, 4, 1]} target={[0, 0, 0]} />
      {/* Horizonte quente e preenchimento frio do lado oposto. */}
      <Lightformer form="rect" intensity={1.4} color="#FFC79A" position={[12, 1.5, 0]} rotation-y={-Math.PI / 2} scale={[40, 3, 1]} />
      <Lightformer form="rect" intensity={0.7} color="#AFC3E6" position={[-12, 3, -4]} rotation-y={Math.PI / 2} scale={[30, 6, 1]} />
      {/* Rebatimento verde do gramado. */}
      <Lightformer form="rect" intensity={0.45} color="#6F8A4A" position={[0, -1, 0]} rotation-x={-Math.PI / 2} scale={[40, 40, 1]} />
    </Environment>
  );
}

function Sol() {
  const tamanho = MOVEL ? 1024 : 2048;
  return (
    <directionalLight
      position={[9, 6.5, 5]}
      intensity={2.6}
      color="#FFE3C4"
      castShadow
      shadow-mapSize={[tamanho, tamanho]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.025}
      shadow-camera-left={-9}
      shadow-camera-right={9}
      shadow-camera-top={9}
      shadow-camera-bottom={-9}
      shadow-camera-near={1}
      shadow-camera-far={30}
    />
  );
}

/** Gramado com brita em volta do módulo (como no lote das fotos) e bordas que somem no preto. */
function Terreno({ comprimento }: { comprimento: number }) {
  const gramado = useMemo(() => uvEmMetros(new THREE.CircleGeometry(18, 72)), []);
  const brita = useMemo(() => {
    const w = comprimento + 2.6;
    const d = LARGURA + 2.6;
    const r = 0.6;
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -d / 2);
    s.lineTo(w / 2 - r, -d / 2);
    s.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
    s.lineTo(w / 2, d / 2 - r);
    s.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
    s.lineTo(-w / 2 + r, d / 2);
    s.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
    s.lineTo(-w / 2, -d / 2 + r);
    s.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
    return new THREE.ShapeGeometry(s, 8);
  }, [comprimento]);
  const degrade = useMemo(
    () => new THREE.MeshBasicMaterial({ map: texturaDegradeChao(), transparent: true, depthWrite: false, fog: false }),
    [],
  );
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} geometry={gramado} material={MAT.grama()} receiveShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} geometry={brita} material={MAT.brita()} receiveShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} material={degrade} renderOrder={2}>
        <planeGeometry args={[36.5, 36.5]} />
      </mesh>
    </group>
  );
}

export function temWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

export function FallbackSemWebGL() {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#0D0D0D" }}>
      <img src={fotoCazita} alt="Fachada do módulo Cazita 3x6 com porta de vidro" className="w-full h-full object-cover opacity-80" />
      <p
        className="absolute bottom-3 left-3 right-3 font-dm"
        style={{ fontSize: 12, color: "rgba(249,250,251,0.8)", background: "rgba(13,13,13,0.7)", padding: "8px 10px", borderRadius: 6 }}
      >
        Seu aparelho não abriu o 3D. As escolhas e o preço continuam funcionando aqui embaixo.
      </p>
    </div>
  );
}

class LimiteErro extends Component<{ children: ReactNode }, { erro: boolean }> {
  state = { erro: false };
  static getDerivedStateFromError() {
    return { erro: true };
  }
  render() {
    return this.state.erro ? <FallbackSemWebGL /> : this.props.children;
  }
}

interface Props {
  config: Config;
  modo: ModoVista;
  /** Face para onde a câmera vira por fora. */
  foco: FaceEsquadria;
  escolhendoFace: boolean;
  onEscolherFace: (face: FaceEsquadria) => void;
}

export default function Showroom({ config, modo, foco, escolhendoFace, onEscolherFace }: Props) {
  const [suportado] = useState(temWebGL);
  const [girar, setGirar] = useState(true);
  const primeiraConfig = useRef(config);
  useEffect(() => {
    if (config !== primeiraConfig.current) setGirar(false);
  }, [config]);

  if (!suportado) return <FallbackSemWebGL />;

  return (
    <LimiteErro>
      <Canvas
        frameloop="demand"
        shadows="soft"
        dpr={DPR_MOVENDO}
        camera={{ fov: 38, near: 0.1, far: 80, position: preset("fora", 1).pos.toArray() }}
        gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
        onCreated={({ gl }) => {
          // Tone mapping neutro, para as cores saírem fiéis às amostras. Quando o pós-processamento
          // carrega, ele assume essa etapa (ver Efeitos.tsx).
          gl.toneMapping = THREE.NeutralToneMapping;
        }}
        style={{ touchAction: "none" }}
      >
        <color attach="background" args={["#0D0D0D"]} />
        <fog attach="fog" args={["#0D0D0D", 18, 34]} />
        <Redesenho />
        <Ambiente />
        <Sol />
        <SombraSobDemanda chave={`${JSON.stringify(config)}|${modo}`} />
        <Terreno comprimento={config.comprimento} />
        <Corte modo={modo} chave={JSON.stringify(config)} />
        <Casca config={config} escolhendoFace={escolhendoFace} onEscolherFace={onEscolherFace} />
        <Camera modo={modo} foco={foco} girar={girar && modo === "fora"} onInteragir={() => setGirar(false)} />
        <Suspense fallback={null}>
          <Efeitos />
        </Suspense>
      </Canvas>
    </LimiteErro>
  );
}
