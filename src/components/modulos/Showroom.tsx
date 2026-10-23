import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { CHASSI } from "@/lib/modulos-3x6/regras";
import type { Config, FaceEsquadria } from "@/lib/modulos-3x6/tipos";
import { Casca } from "./Casca";
import { texturaGramado } from "./materiais";
import fotoCazita from "@/assets/modulos/cazita-fachada.webp";

export type ModoVista = "fora" | "dentro";

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

/** Câmera orbital com transição suave entre a vista de fora e a de dentro (corte). */
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
  const { camera, size, invalidate } = useThree();
  const aspecto = size.width / Math.max(1, size.height);
  const faixaAspecto = distancia(aspecto);
  const anim = useRef<{ t: number; de: { pos: THREE.Vector3; alvo: THREE.Vector3 }; para: { pos: THREE.Vector3; alvo: THREE.Vector3 } } | null>(null);

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
    a.t = Math.min(1, a.t + Math.min(dt, 1 / 30) / 0.9);
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
        onInteragir();
      }}
    />
  );
}

/** Corte horizontal (clipping global): na vista de dentro, cobertura e topo das paredes saem para mostrar o interior. */
function Corte({ modo }: { modo: ModoVista }) {
  const { gl } = useThree();
  const plano = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 6), []);
  useEffect(() => {
    gl.clippingPlanes = [plano];
    return () => {
      gl.clippingPlanes = [];
    };
  }, [gl, plano]);
  useFrame((state, dt) => {
    const alvo = modo === "dentro" ? CHASSI + 1.55 : 6;
    const d = alvo - plano.constant;
    if (Math.abs(d) < 0.002) return;
    plano.constant += d * Math.min(1, Math.min(dt, 1 / 30) * 5);
    state.invalidate();
  });
  return null;
}

function Cenario() {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ map: texturaGramado(), roughness: 1 }), []);
  return (
    <>
      <color attach="background" args={["#0D0D0D"]} />
      <fog attach="fog" args={["#0D0D0D", 18, 34]} />
      <hemisphereLight args={["#FFFFFF", "#3A4630", 1.1]} />
      <ambientLight intensity={0.25} />
      {/* Sol de fim de tarde, baixo e quente. */}
      <directionalLight position={[9, 5.5, 7]} intensity={2.0} color="#FFE7CF" />
      <directionalLight position={[-6, 4, -5]} intensity={0.35} color="#A9C4FF" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} material={mat}>
        <circleGeometry args={[16, 64]} />
      </mesh>
      {/* Sombra de contato calculada uma vez (pré-calculada), sem shadow map em tempo real. */}
      <ContactShadows position={[0, 0.003, 0]} scale={14} blur={2.4} far={3.5} opacity={0.6} resolution={512} frames={1} />
    </>
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
        dpr={[1, 1.5]}
        camera={{ fov: 38, near: 0.1, far: 80, position: preset("fora", 1).pos.toArray() }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          // Tone mapping neutro para o off-white e os tons de WPC saírem fiéis à amostra.
          gl.toneMapping = THREE.NeutralToneMapping;
        }}
        style={{ touchAction: "none" }}
      >
        <Cenario />
        <Corte modo={modo} />
        <Casca config={config} escolhendoFace={escolhendoFace} onEscolherFace={onEscolherFace} />
        <Camera modo={modo} foco={foco} girar={girar && modo === "fora"} onInteragir={() => setGirar(false)} />
      </Canvas>
    </LimiteErro>
  );
}
