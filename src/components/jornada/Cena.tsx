import { lazy, Suspense, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Casca } from "@/components/modulos/Casca";
import { registrarAnisotropia, registrarRedesenho } from "@/components/modulos/materiais";
import { SEM_CORTE } from "@/components/modulos/sombra";
import { CHASSI, LARGURA } from "@/lib/modulos-3x6/regras";
import { CONFIG_VENDIDA, ETAPAS, T, configEm, etapaEm, suave, trecho, type IdEtapa } from "./roteiro";

const Efeitos = lazy(() => import("@/components/modulos/Efeitos"));

/*
 * Cena da jornada: fábrica (em volta da origem), estrada ao longo de x e o terreno do cliente em x ≈ 70.
 * Tudo é função do relógio `tempo` (segundos): a mesma cena serve para assistir e para gravar quadro a quadro.
 */

type Vec3 = [number, number, number];
type Tempo = MutableRefObject<number>;

const L = CONFIG_VENDIDA.comprimento;
const H = CONFIG_VENDIDA.altura;
const TOPO_MODULO = H + 0.12;
const CAMINHAO_Z = 6;
const TOPO_CARRETA = 1.25;
const LOTE_X = 75;
const FINAL = { x: 75.5, y: 0.15, z: -3.5, rot: -Math.PI / 2 };
const CIANO = "#22D3EE";
/** Instante em que o caminhão vazio deixa o terreno. */
const SAIDA = T.guindaste[1] + 0.6;

const lerp = THREE.MathUtils.lerp;

/* ----------------------------------------------------------------------------------------------
 * Movimentos
 * -------------------------------------------------------------------------------------------- */

/** Posição do caminhão (x da carreta) ao longo do tempo. */
function xCaminhao(t: number) {
  if (t < 28.5) return -60;
  if (t < 31) return lerp(-30, 0, 1 - Math.pow(1 - trecho(t, 28.5, 31), 3));
  if (t < T.viagem[0]) return 0;
  if (t < SAIDA) return lerp(0, LOTE_X, suave(trecho(t, T.viagem[0], T.viagem[1])));
  // Depois do içamento, o caminhão segue viagem e libera a vista da entrega.
  return LOTE_X + 40 * Math.pow(trecho(t, SAIDA, SAIDA + 3), 2);
}

interface Pose {
  x: number;
  y: number;
  z: number;
  rot: number;
}

function poseModulo(t: number): Pose {
  if (t < T.icar[0]) return { x: 0, y: 0, z: 0, rot: 0 };
  if (t < T.guindaste[0]) {
    if (t >= T.icar[1]) return { x: xCaminhao(t), y: TOPO_CARRETA, z: CAMINHAO_Z, rot: 0 };
    const a = trecho(t, T.icar[0], T.icar[1]);
    const sobe = suave(a / 0.3);
    const vai = suave((a - 0.3) / 0.4);
    const desce = suave((a - 0.7) / 0.3);
    return { x: 0, y: a < 0.7 ? lerp(0, 4.6, sobe) : lerp(4.6, TOPO_CARRETA, desce), z: lerp(0, CAMINHAO_Z, vai), rot: 0 };
  }
  const a = trecho(t, T.guindaste[0], T.guindaste[1]);
  const sobe = suave(a / 0.28);
  const vai = suave((a - 0.28) / 0.47);
  const desce = suave((a - 0.75) / 0.25);
  return {
    x: lerp(LOTE_X, FINAL.x, vai),
    y: a < 0.75 ? lerp(TOPO_CARRETA, 5.8, sobe) : lerp(5.8, FINAL.y, desce),
    z: lerp(CAMINHAO_Z, FINAL.z, vai),
    rot: lerp(0, FINAL.rot, vai),
  };
}

/** Altura (relativa ao piso do módulo) até onde a casca aparece: as paredes sobem e a cobertura fecha. */
function corteLocal(t: number) {
  if (t < T.paredes[0]) return CHASSI;
  if (t < T.paredes[1]) return lerp(CHASSI, 1.75, suave(trecho(t, T.paredes[0], T.paredes[1])));
  if (t < T.cobertura[0]) return 1.75;
  if (t < T.cobertura[1]) return lerp(1.75, 3.4, suave(trecho(t, T.cobertura[0], T.cobertura[1])));
  return 50;
}

/** Pontos de içamento (cantos do topo) no referencial do mundo. */
function cantosTopo(p: Pose): THREE.Vector3[] {
  const c = Math.cos(p.rot);
  const s = Math.sin(p.rot);
  return [
    [L / 2 - 0.4, LARGURA / 2 - 0.25],
    [L / 2 - 0.4, -LARGURA / 2 + 0.25],
    [-L / 2 + 0.4, LARGURA / 2 - 0.25],
    [-L / 2 + 0.4, -LARGURA / 2 + 0.25],
  ].map(([x, z]) => new THREE.Vector3(p.x + x * c + z * s, p.y + TOPO_MODULO, p.z - x * s + z * c));
}

/* ----------------------------------------------------------------------------------------------
 * Câmera: um enquadramento por etapa, com transição suave na virada.
 * -------------------------------------------------------------------------------------------- */

interface Quadro {
  alvo: Vec3;
  pos: Vec3;
}

function orbita(alvo: Vec3, angulo: number, raio: number, altura: number): Quadro {
  return { alvo, pos: [alvo[0] + Math.cos(angulo) * raio, alvo[1] + altura, alvo[2] + Math.sin(angulo) * raio] };
}

const ENQUADRAMENTO: Record<IdEtapa | "entrega", (u: number, t: number) => Quadro> = {
  projeto: (u) => orbita([0, 0.4, 0], lerp(0.75, 0.95, u), 8.5, lerp(10.5, 9, u)),
  estrutura: (u) => orbita([0, 1.3, 0], lerp(0.55, 1.15, u), 11.5, 5.8),
  fechamento: (u) => orbita([0, 1.2, 0], lerp(1.15, 1.8, u), 11.5, 6.2),
  interior: (u) => orbita([0.2, 0.5, 0], lerp(1.25, 1.05, u), 4.2, lerp(9.2, 8.2, u)),
  acabamento: (u) => orbita([0, 1.5, 0], lerp(0.25, 0.75, u), 11.5, 2.6),
  qualidade: (u) => orbita([0, 1.5, 0], lerp(-0.35, 0.15, u), 12, 3.4),
  carregamento: (u) => orbita([0, 2.4, 3], lerp(2.05, 2.35, u), 17, 7.5),
  transporte: (_u, t) => {
    const x = xCaminhao(t);
    return { alvo: [x, 2, CAMINHAO_Z - 1], pos: [x - 8, 6.5, CAMINHAO_Z + 14] };
  },
  instalacao: (u) => orbita([74.5, 2.6, -2], lerp(1.95, 1.75, u), 21, lerp(14, 12, u)),
  entrega: (u) => orbita([71.5, 1.4, -4], lerp(1.75, 1.2, u), 21, lerp(10, 6.5, u)),
};

function quadroEm(t: number): Quadro {
  const { etapa, u, entregue } = etapaEm(t);
  if (entregue) {
    const u2 = trecho(t, etapa.t1, etapa.t1 + 6);
    const fim = ENQUADRAMENTO.instalacao(1, etapa.t1);
    const q = ENQUADRAMENTO.entrega(u2, t);
    return misturar(fim, q, suave(u2 * 2.5));
  }
  const atual = ENQUADRAMENTO[etapa.id](u, t);
  const { indice } = etapaEm(t);
  if (indice === 0) return atual;
  const anterior = ETAPAS[indice - 1];
  const transicao = suave((t - etapa.t0) / 1.6);
  if (transicao >= 1) return atual;
  return misturar(ENQUADRAMENTO[anterior.id](1, etapa.t0), atual, transicao);
}


function misturar(a: Quadro, b: Quadro, k: number): Quadro {
  return {
    alvo: a.alvo.map((v, i) => lerp(v, b.alvo[i], k)) as Vec3,
    pos: a.pos.map((v, i) => lerp(v, b.pos[i], k)) as Vec3,
  };
}

function Camera({ tempo, afastar }: { tempo: Tempo; afastar: number }) {
  const alvo = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }) => {
    const q = quadroEm(tempo.current);
    alvo.set(...q.alvo);
    camera.position.set(
      q.alvo[0] + (q.pos[0] - q.alvo[0]) * afastar,
      q.alvo[1] + (q.pos[1] - q.alvo[1]) * afastar,
      q.alvo[2] + (q.pos[2] - q.alvo[2]) * afastar,
    );
    camera.lookAt(alvo);
  });
  return null;
}

/* ----------------------------------------------------------------------------------------------
 * Materiais e peças simples do cenário (fora do cache do configurador, para não pegar o corte).
 * -------------------------------------------------------------------------------------------- */

const materiais = new Map<string, THREE.MeshStandardMaterial>();
function mat(cor: string, rugosidade = 0.8, metal = 0, emissivo = 0) {
  const chave = `${cor}|${rugosidade}|${metal}|${emissivo}`;
  let m = materiais.get(chave);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color: cor, roughness: rugosidade, metalness: metal });
    if (emissivo) {
      m.emissive.set(cor);
      m.emissiveIntensity = emissivo;
    }
    m.userData[SEM_CORTE] = true;
    materiais.set(chave, m);
  }
  return m;
}

const caixa = new THREE.BoxGeometry(1, 1, 1);
const cilindro = new THREE.CylinderGeometry(0.5, 0.5, 1, 24);
const esfera = new THREE.IcosahedronGeometry(0.5, 1);

function B({ p, s, cor, r = 0.8, m = 0, rot, sombra = true, children }: { p: Vec3; s: Vec3; cor: string; r?: number; m?: number; rot?: Vec3; sombra?: boolean; children?: ReactNode }) {
  return (
    <mesh position={p} scale={s} rotation={rot} geometry={caixa} material={mat(cor, r, m)} castShadow={sombra} receiveShadow>
      {children}
    </mesh>
  );
}

function Cil({ p, s, cor, r = 0.7, m = 0, rot }: { p: Vec3; s: Vec3; cor: string; r?: number; m?: number; rot?: Vec3 }) {
  return <mesh position={p} scale={s} rotation={rot} geometry={cilindro} material={mat(cor, r, m)} castShadow receiveShadow />;
}

/** Peça que surge entre t0 e t1 (cresce ao longo do eixo indicado). */
function Peca({ tempo, p, s, t0, t1, eixo = 1, cor = "#1C1C1C" }: { tempo: Tempo; p: Vec3; s: Vec3; t0: number; t1: number; eixo?: 0 | 1 | 2; cor?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const k = suave(trecho(tempo.current, t0, t1));
    m.visible = k > 0.001;
    const escala: Vec3 = [...s];
    escala[eixo] = Math.max(0.001, s[eixo] * k);
    m.scale.set(...escala);
    // Cresce a partir da base (pilares) ou da ponta (vigas).
    const pos: Vec3 = [...p];
    pos[eixo] = p[eixo] - (s[eixo] * (1 - k)) / 2;
    m.position.set(...pos);
  });
  return <mesh ref={ref} geometry={caixa} material={mat(cor, 0.45, 0.6)} castShadow receiveShadow />;
}

/* ----------------------------------------------------------------------------------------------
 * Fábrica
 * -------------------------------------------------------------------------------------------- */

function Palete({ p, children }: { p: Vec3; children?: ReactNode }) {
  return (
    <group position={p}>
      <B p={[0, 0.07, 0]} s={[1.2, 0.14, 1.0]} cor="#C9A27A" />
      {children}
    </group>
  );
}

function Empilhadeira({ p, rotY = 0 }: { p: Vec3; rotY?: number }) {
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <B p={[0, 0.65, 0]} s={[1.6, 0.8, 1.1]} cor="#F2A93B" r={0.5} />
      <B p={[-0.55, 1.2, 0]} s={[0.5, 0.5, 1.0]} cor="#2B2B2B" />
      {[-0.5, 0.5].map((z) => (
        <B key={z} p={[-0.1, 2.0, z]} s={[0.06, 1.1, 0.06]} cor="#2B2B2B" />
      ))}
      <B p={[-0.1, 2.55, 0]} s={[1.1, 0.06, 1.06]} cor="#2B2B2B" />
      <B p={[1.0, 1.4, 0]} s={[0.1, 2.6, 0.9]} cor="#3A3A3A" m={0.4} />
      <B p={[1.45, 0.12, 0.25]} s={[0.9, 0.05, 0.12]} cor="#3A3A3A" m={0.4} />
      <B p={[1.45, 0.12, -0.25]} s={[0.9, 0.05, 0.12]} cor="#3A3A3A" m={0.4} />
      {[
        [0.5, 0.55],
        [0.5, -0.55],
        [-0.5, 0.55],
        [-0.5, -0.55],
      ].map(([x, z]) => (
        <Cil key={`${x}${z}`} p={[x, 0.28, z]} s={[0.56, 0.22, 0.56]} rot={[Math.PI / 2, 0, 0]} cor="#1A1A1A" />
      ))}
    </group>
  );
}

function Fabrica() {
  const linhas: { p: Vec3; s: Vec3 }[] = [
    // Área de montagem (8 x 5 m) e vaga do caminhão, em faixa amarela no piso.
    { p: [0, 0.012, -2.6], s: [8.4, 0.004, 0.08] },
    { p: [0, 0.012, 2.6], s: [8.4, 0.004, 0.08] },
    { p: [-4.2, 0.012, 0], s: [0.08, 0.004, 5.2] },
    { p: [4.2, 0.012, 0], s: [0.08, 0.004, 5.2] },
  ];
  return (
    <group>
      {/* Piso de concreto da fábrica. */}
      <B p={[0, 0.005, -1]} s={[34, 0.01, 18]} cor="#EFEDE8" r={0.95} sombra={false} />
      {linhas.map((l, i) => (
        <mesh key={i} position={l.p} scale={l.s} geometry={caixa} material={mat("#F2B33D", 0.7)} />
      ))}

      {/* Parede do fundo em painel metálico, com portões escuros e pilares. */}
      <B p={[0, 4, -10]} s={[34, 8, 0.3]} cor="#F4F3F0" r={0.9} />
      {Array.from({ length: 34 }, (_, i) => (
        <B key={i} p={[-16.5 + i, 4, -9.82]} s={[0.04, 8, 0.06]} cor="#E4E1DB" sombra={false} />
      ))}
      {[-8, 0, 8].map((x) => (
        <group key={x}>
          <B p={[x, 2.2, -9.8]} s={[4, 4.4, 0.1]} cor="#2D3036" r={0.5} m={0.3} />
          <B p={[x, 4.55, -9.7]} s={[4.4, 0.3, 0.3]} cor="#1E1E1E" />
        </group>
      ))}
      {[-12, -4, 4, 12].map((x) => (
        <B key={x} p={[x, 4, -9.55]} s={[0.4, 8, 0.4]} cor="#1E1E1E" m={0.4} r={0.5} />
      ))}
      {/* Parede lateral. */}
      <B p={[-17, 4, -1]} s={[0.3, 8, 18]} cor="#F1F0EC" r={0.9} />

      {/* Estoque: perfis de aço, painéis de parede e caixas de acabamento. */}
      <group position={[-11, 0, -6.5]}>
        {Array.from({ length: 4 }, (_, n) =>
          Array.from({ length: 6 - n }, (_, i) => (
            <B key={`${n}${i}`} p={[0, 0.12 + n * 0.16, -1 + i * 0.2 + n * 0.1]} s={[6, 0.14, 0.14]} cor="#26282C" r={0.4} m={0.6} />
          )),
        )}
        {[-2.5, 0, 2.5].map((x) => (
          <B key={x} p={[x, 0.05, 0]} s={[0.2, 0.1, 1.8]} cor="#B48C64" />
        ))}
      </group>
      <group position={[-11, 0, -1.5]}>
        {[0, 1].map((n) => (
          <Palete key={n} p={[n * 2.6, 0, 0]}>
            {Array.from({ length: 6 }, (_, i) => (
              <B key={i} p={[0, 0.2 + i * 0.13, 0]} s={[2.4, 0.12, 1.2]} cor={i % 2 ? "#E9E6E0" : "#F6F5F2"} r={0.9} />
            ))}
          </Palete>
        ))}
      </group>
      <group position={[9, 0, -6.5]}>
        <Palete p={[0, 0, 0]}>
          {[
            [-0.3, 0.38, -0.25, "#D8B48A"],
            [0.3, 0.38, -0.25, "#D8B48A"],
            [-0.3, 0.38, 0.25, "#E2C29C"],
            [0.3, 0.38, 0.25, "#D8B48A"],
            [-0.3, 0.84, 0, "#E2C29C"],
            [0.3, 0.84, 0, CIANO],
          ].map(([x, y, z, c], i) => (
            <B key={i} p={[x as number, y as number, z as number]} s={[0.56, 0.46, 0.46]} cor={c as string} r={0.85} />
          ))}
        </Palete>
        <Palete p={[1.6, 0, 0.2]}>
          {[0, 1, 2].map((i) => (
            <B key={i} p={[0, 0.35 + i * 0.42, 0]} s={[1.1, 0.4, 0.9]} cor={i === 1 ? "#F07A3E" : "#D8B48A"} r={0.85} />
          ))}
        </Palete>
        <Palete p={[3.2, 0, 0]}>
          {[-0.28, 0.28].map((x) =>
            [-0.22, 0.22].map((z) => <Cil key={`${x}${z}`} p={[x, 0.55, z]} s={[0.42, 0.8, 0.42]} cor="#1F4E8C" r={0.4} m={0.3} />),
          )}
        </Palete>
      </group>
      <Empilhadeira p={[10.5, 0, -2.5]} rotY={Math.PI} />

      {/* Bancada e frades amarelos na doca. */}
      <B p={[-6.8, 0.45, 1.5]} s={[1.2, 0.9, 2.6]} cor="#2A2C30" r={0.5} />
      <B p={[-6.8, 0.92, 1.5]} s={[1.3, 0.05, 2.7]} cor="#C9A27A" />
      {[-5, -1.5, 2, 5.5].map((x) => (
        <Cil key={x} p={[x, 0.5, 3.4]} s={[0.18, 1, 0.18]} cor="#F2B33D" r={0.5} />
      ))}
    </group>
  );
}

/** Pórtico rolante da fábrica: corre em z para levar o módulo até a carreta. */
function Portico({ tempo }: { tempo: Tempo }) {
  const grupo = useRef<THREE.Group>(null);
  const cabos = useRef<(THREE.Mesh | null)[]>([]);
  const gancho = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const t = tempo.current;
    const p = poseModulo(t);
    let z = -4.6;
    if (t >= 30.8 && t < T.icar[0]) z = lerp(-4.6, 0, suave(trecho(t, 30.8, T.icar[0])));
    else if (t >= T.icar[0] && t < 36.5) z = p.z;
    else if (t >= 36.5) z = lerp(CAMINHAO_Z, -4.6, suave(trecho(t, 36.5, 38.5)));
    grupo.current?.position.set(0, 0, z);

    const preso = t >= T.icar[0] - 0.1 && t <= T.icar[1] + 0.25;
    const yGancho = preso ? p.y + TOPO_MODULO + 1.3 : 5.2;
    const g = gancho.current;
    if (g) g.position.set(0, yGancho, 0);
    const cantos = cantosTopo(p);
    const topoGancho = new THREE.Vector3(0, yGancho, z);
    cabos.current.forEach((c, i) => {
      if (!c) return;
      if (i === 0) {
        ligar(c, new THREE.Vector3(0, 6.6, z), topoGancho);
        return;
      }
      c.visible = preso;
      if (preso) ligar(c, topoGancho, cantos[i - 1]);
    });
  });

  return (
    <>
      <group ref={grupo}>
        {[-4.8, 4.8].map((x) => (
          <group key={x}>
            <B p={[x, 3.4, 0]} s={[0.35, 6.8, 0.35]} cor="#F2B33D" r={0.5} m={0.2} />
            <B p={[x, 0.25, 0]} s={[0.5, 0.5, 1.6]} cor="#2B2B2B" />
          </group>
        ))}
        <B p={[0, 6.95, 0]} s={[10, 0.5, 0.5]} cor="#F2B33D" r={0.5} m={0.2} />
        <B p={[0, 6.6, 0]} s={[0.8, 0.3, 0.7]} cor="#2B2B2B" />
        <mesh ref={gancho} geometry={caixa} scale={[0.3, 0.3, 0.3]} material={mat("#2B2B2B", 0.5, 0.5)} />
      </group>
      {/* Trilhos no piso. */}
      {[-4.8, 4.8].map((x) => (
        <B key={x} p={[x, 0.03, -1]} s={[0.18, 0.06, 15]} cor="#8C8C8C" m={0.6} r={0.4} sombra={false} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} ref={(m) => (cabos.current[i] = m)} geometry={cilindro} material={mat("#1A1A1A", 0.6, 0.4)} castShadow />
      ))}
    </>
  );
}

const CIMA = new THREE.Vector3(0, 1, 0);
/** Posiciona um cilindro de raio fixo entre dois pontos (cabo de aço). */
function ligar(m: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3, raio = 0.025) {
  const d = new THREE.Vector3().subVectors(b, a);
  const comprimento = d.length();
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(CIMA, d.normalize());
  m.scale.set(raio * 2, Math.max(0.001, comprimento), raio * 2);
}

/** Planta desenhada no piso antes da montagem. */
function Planta({ tempo }: { tempo: Tempo }) {
  const ref = useRef<THREE.Group>(null);
  const linhas: { p: Vec3; s: Vec3; t0: number; eixo: 0 | 2 }[] = [
    { p: [0, 0.02, -1.5], s: [L, 0.01, 0.04], t0: 0.3, eixo: 0 },
    { p: [L / 2, 0.02, 0], s: [0.04, 0.01, 3], t0: 0.9, eixo: 2 },
    { p: [0, 0.02, 1.5], s: [L, 0.01, 0.04], t0: 1.3, eixo: 0 },
    { p: [-L / 2, 0.02, 0], s: [0.04, 0.01, 3], t0: 1.9, eixo: 2 },
    // Cotas.
    { p: [0, 0.02, 2.2], s: [L, 0.01, 0.02], t0: 2.4, eixo: 0 },
    { p: [-3.7, 0.02, 0], s: [0.02, 0.01, 3], t0: 2.6, eixo: 2 },
    // Porta na testada e grade de 1 m.
    { p: [L / 2 + 0.05, 0.025, 0], s: [0.1, 0.01, 1.6], t0: 2.8, eixo: 2 },
    ...[-2, -1, 0, 1, 2].map((x) => ({ p: [x, 0.018, 0] as Vec3, s: [0.012, 0.01, 3] as Vec3, t0: 3 + (x + 2) * 0.12, eixo: 2 as const })),
  ];
  useFrame(() => {
    if (ref.current) ref.current.visible = tempo.current < T.paredes[0] + 0.4;
  });
  return (
    <group ref={ref}>
      {linhas.map((l, i) => (
        <PecaLinha key={i} tempo={tempo} {...l} />
      ))}
      <Rotulo tempo={tempo} />
    </group>
  );
}

function PecaLinha({ tempo, p, s, t0, eixo }: { tempo: Tempo; p: Vec3; s: Vec3; t0: number; eixo: 0 | 2 }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const k = suave(trecho(tempo.current, t0, t0 + 0.7));
    m.visible = k > 0.001;
    const e: Vec3 = [...s];
    e[eixo] = Math.max(0.001, s[eixo] * k);
    m.scale.set(...e);
  });
  return <mesh ref={ref} position={p} geometry={caixa} material={mat(CIANO, 0.4, 0, 1.4)} />;
}

/** Plaquinha "3,00 × 6,00 m" no piso, feita em canvas. */
function Rotulo({ tempo }: { tempo: Tempo }) {
  const textura = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#0E7490";
    ctx.font = "600 64px 'DM Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("6,00 m  ·  18 m²", 256, 64);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const k = suave(trecho(tempo.current, 2.6, 3.4));
    (m.material as THREE.MeshBasicMaterial).opacity = k;
  });
  return (
    <mesh ref={ref} position={[0, 0.03, 2.6]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2.6, 0.65]} />
      <meshBasicMaterial map={textura} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

/** Estrutura metálica: chassi, pilares e vigas surgindo em sequência. */
function Estrutura({ tempo }: { tempo: Tempo }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const t = tempo.current;
    if (ref.current) ref.current.visible = t < T.cobertura[1] && t >= T.estruturaChassi[0];
  });
  const [c0, c1] = T.estruturaChassi;
  const [p0, p1] = T.estruturaPilares;
  const [v0, v1] = T.estruturaVigas;
  const meioL = L / 2 - 0.08;
  const meioW = LARGURA / 2 - 0.08;
  const travessas = [-2, -1, 0, 1, 2];
  const pilares: [number, number][] = [
    [meioL, meioW],
    [meioL, -meioW],
    [-meioL, meioW],
    [-meioL, -meioW],
    [0, meioW],
    [0, -meioW],
  ];
  const hp = H - CHASSI - 0.12;
  return (
    <group ref={ref}>
      <Peca tempo={tempo} p={[0, 0.1, meioW]} s={[L, 0.2, 0.14]} t0={c0} t1={c0 + 0.8} eixo={0} />
      <Peca tempo={tempo} p={[0, 0.1, -meioW]} s={[L, 0.2, 0.14]} t0={c0 + 0.2} t1={c0 + 1} eixo={0} />
      {[meioL, -meioL].map((x, i) => (
        <Peca key={x} tempo={tempo} p={[x, 0.1, 0]} s={[0.14, 0.2, LARGURA - 0.16]} t0={c0 + 0.5 + i * 0.2} t1={c0 + 1.1 + i * 0.2} eixo={2} />
      ))}
      {travessas.map((x, i) => (
        <Peca key={x} tempo={tempo} p={[x, 0.1, 0]} s={[0.08, 0.16, LARGURA - 0.3]} t0={c0 + 0.7 + i * 0.12} t1={c1} eixo={2} cor="#2A2A2A" />
      ))}
      {pilares.map(([x, z], i) => (
        <Peca key={`${x}${z}`} tempo={tempo} p={[x, CHASSI + hp / 2, z]} s={[0.12, hp, 0.12]} t0={p0 + i * 0.22} t1={p0 + i * 0.22 + 0.8} />
      ))}
      <Peca tempo={tempo} p={[0, H - 0.06, meioW]} s={[L, 0.14, 0.12]} t0={v0} t1={v0 + 0.9} eixo={0} />
      <Peca tempo={tempo} p={[0, H - 0.06, -meioW]} s={[L, 0.14, 0.12]} t0={v0 + 0.25} t1={v0 + 1.15} eixo={0} />
      {[meioL, 0, -meioL].map((x, i) => (
        <Peca key={x} tempo={tempo} p={[x, H - 0.06, 0]} s={[0.1, 0.12, LARGURA - 0.16]} t0={v0 + 0.8 + i * 0.25} t1={v1} eixo={2} />
      ))}
      {/* Contraventamento em X nas laterais. */}
      {[-1, 1].map((lado) =>
        [-1.5, 1.5].map((x) => (
          <Diagonal key={`${lado}${x}`} tempo={tempo} x={x} z={lado * meioW} t0={v0 + 1.2} />
        )),
      )}
    </group>
  );
}

function Diagonal({ tempo, x, z, t0 }: { tempo: Tempo; x: number; z: number; t0: number }) {
  const ref = useRef<THREE.Group>(null);
  const largura = 2.8;
  const altura = H - CHASSI - 0.2;
  const angulo = Math.atan2(altura, largura);
  const comprimento = Math.hypot(largura, altura);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const k = suave(trecho(tempo.current, t0, t0 + 0.8));
    g.visible = k > 0.001;
    g.scale.setScalar(Math.max(0.001, k));
  });
  return (
    <group ref={ref} position={[x, CHASSI + altura / 2 + 0.05, z]}>
      {[angulo, -angulo].map((a) => (
        <mesh key={a} rotation={[0, 0, a]} scale={[comprimento, 0.04, 0.04]} geometry={caixa} material={mat("#3A3A3A", 0.45, 0.6)} castShadow />
      ))}
    </group>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Módulo: a casca do configurador, revelada por um plano de corte que sobe e acompanha o içamento.
 * -------------------------------------------------------------------------------------------- */

/** `marco` muda quando o relógio cruza uma troca de configuração e faz o módulo renderizar de novo. */
function Modulo({ tempo, marco }: { tempo: Tempo; marco: string }) {
  const grupo = useRef<THREE.Group>(null);
  const plano = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), CHASSI), []);
  const { gl } = useThree();
  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  const t = tempo.current;
  const montada = t >= T.paredes[0];
  const config = configEm(t);
  const mobiliado = t >= T.academia;

  useFrame(() => {
    const g = grupo.current;
    if (!g) return;
    const p = poseModulo(tempo.current);
    g.position.set(p.x, p.y, p.z);
    g.rotation.y = p.rot;
    plano.constant = p.y + corteLocal(tempo.current);
    // Materiais novos entram a cada troca (móveis, ripado, deck): todos recebem o mesmo plano.
    g.traverse((o) => {
      const m = (o as THREE.Mesh).material;
      if (!m) return;
      for (const material of Array.isArray(m) ? m : [m]) {
        if (material.userData[SEM_CORTE] || material.clippingPlanes?.[0] === plano) continue;
        material.clippingPlanes = [plano];
        material.clipShadows = true;
        material.needsUpdate = true;
      }
    });
  });

  return (
    <group ref={grupo}>
      {montada && <Casca config={config} escolhendoFace={false} onEscolherFace={() => {}} mobiliado={mobiliado} />}
      <Estrutura tempo={tempo} />
    </group>
  );
}

/** Varredura ciano da vistoria. */
function Varredura({ tempo }: { tempo: Tempo }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const [a, b] = T.scan;
    const t = tempo.current;
    g.visible = t >= a && t <= b;
    const u = trecho(t, a, b);
    const ida = u < 0.5 ? suave(u * 2) : 1 - suave((u - 0.5) * 2);
    g.position.x = lerp(-L / 2 - 0.3, L / 2 + 0.3, ida);
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 1.65, 0]} scale={[0.02, 3.5, LARGURA + 0.6]} geometry={caixa}>
        <meshBasicMaterial color={CIANO} transparent opacity={0.25} depthWrite={false} />
      </mesh>
      {[0.02, 3.4].map((y) => (
        <mesh key={y} position={[0, y, 0]} scale={[0.05, 0.05, LARGURA + 0.6]} geometry={caixa} material={mat(CIANO, 0.3, 0, 2)} />
      ))}
      {[-1, 1].map((lado) => (
        <mesh key={lado} position={[0, 1.7, lado * (LARGURA / 2 + 0.3)]} scale={[0.05, 3.4, 0.05]} geometry={caixa} material={mat(CIANO, 0.3, 0, 2)} />
      ))}
    </group>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Caminhão com carreta (low-poly, como no vídeo de referência)
 * -------------------------------------------------------------------------------------------- */

function Roda({ p }: { p: Vec3 }) {
  return (
    <group position={p}>
      <Cil p={[0, 0, 0]} s={[1.0, 0.42, 1.0]} rot={[Math.PI / 2, 0, 0]} cor="#151515" r={0.9} />
      <Cil p={[0, 0, p[2] > 0 ? 0.22 : -0.22]} s={[0.5, 0.02, 0.5]} rot={[Math.PI / 2, 0, 0]} cor="#BFC3C7" r={0.3} m={0.8} />
    </group>
  );
}

function Caminhao({ tempo }: { tempo: Tempo }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const x = xCaminhao(tempo.current);
    g.visible = x > -50;
    g.position.set(x, 0, CAMINHAO_Z);
  });
  const cab = "#2A2D33";
  return (
    <group ref={ref}>
      {/* Carreta: longarinas, assoalho em madeira e para-choque. */}
      <B p={[-0.2, 0.85, 0]} s={[7.6, 0.3, 0.9]} cor="#1E1E1E" />
      <B p={[-0.2, TOPO_CARRETA - 0.12, 0]} s={[7.6, 0.18, 2.5]} cor="#2B2E33" />
      <B p={[-0.2, TOPO_CARRETA - 0.015, 0]} s={[7.5, 0.03, 2.42]} cor="#C49468" r={0.85} />
      {[-1, 1].map((lado) => (
        <B key={lado} p={[-0.2, TOPO_CARRETA - 0.12, lado * 1.26]} s={[7.6, 0.2, 0.04]} cor="#F2B33D" r={0.5} />
      ))}
      {/* Cabine. */}
      <group position={[4.75, 0, 0]}>
        <B p={[0, 1.15, 0]} s={[2.3, 1.1, 2.45]} cor={cab} r={0.45} m={0.2} />
        <B p={[-0.15, 2.3, 0]} s={[2.0, 1.3, 2.45]} cor={cab} r={0.45} m={0.2} />
        <B p={[0.86, 2.35, 0]} s={[0.04, 0.85, 2.1]} cor="#9FB7C2" r={0.1} m={0.4} />
        {[-1, 1].map((lado) => (
          <B key={lado} p={[0.1, 2.35, lado * 1.23]} s={[1.0, 0.7, 0.02]} cor="#9FB7C2" r={0.1} m={0.4} />
        ))}
        <B p={[1.17, 0.95, 0]} s={[0.06, 0.6, 2.2]} cor="#111111" />
        {[-0.85, 0.85].map((z) => (
          <B key={z} p={[1.18, 1.35, z]} s={[0.04, 0.16, 0.36]} cor="#FFF4DA" sombra={false} />
        ))}
        <B p={[-0.15, 3.03, 0]} s={[1.6, 0.18, 2.2]} cor="#1A1C20" />
        <B p={[-0.9, 2.6, 0]} s={[0.12, 1.8, 0.12]} cor="#C9CDD1" m={0.8} r={0.3} />
      </group>
      {[
        [5.1, 1.1],
        [5.1, -1.1],
        [-2.2, 1.1],
        [-2.2, -1.1],
        [-3.3, 1.1],
        [-3.3, -1.1],
      ].map(([x, z]) => (
        <Roda key={`${x}${z}`} p={[x, 0.5, z]} />
      ))}
    </group>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Terreno do cliente: casa existente, piscina, sapatas e guindaste.
 * -------------------------------------------------------------------------------------------- */

function Arvore({ p, escala = 1 }: { p: Vec3; escala?: number }) {
  return (
    <group position={p} scale={escala}>
      <Cil p={[0, 0.9, 0]} s={[0.18, 1.8, 0.18]} cor="#6B5340" />
      <mesh position={[0, 2.4, 0]} scale={[2.0, 1.8, 2.0]} geometry={esfera} material={mat("#7E9A68", 0.9)} castShadow />
      <mesh position={[0.5, 2.9, 0.3]} scale={[1.3, 1.2, 1.3]} geometry={esfera} material={mat("#90AC77", 0.9)} castShadow />
    </group>
  );
}

function Casa() {
  const branco = "#F3F1EC";
  const vidro = "#33414A";
  return (
    <group>
      {/* Gramado do lote e calçada. */}
      <B p={[73, 0.008, -5.5]} s={[34, 0.016, 17]} cor="#B4C196" r={1} sombra={false} />
      <B p={[73, 0.012, 2.4]} s={[34, 0.02, 1.2]} cor="#DEDAD2" r={1} sombra={false} />

      {/* Volume principal térreo, em reboco branco, com panos de vidro voltados para o jardim. */}
      <B p={[66, 1.6, -7]} s={[10, 3.2, 8]} cor={branco} r={0.9} />
      <B p={[66, 3.25, -7]} s={[10.2, 0.14, 8.2]} cor="#1E1E1E" />
      <B p={[66.5, 1.4, -2.98]} s={[6.5, 2.4, 0.06]} cor={vidro} r={0.15} m={0.3} />
      {[63.25, 65.4, 67.6, 69.75].map((x) => (
        <B key={x} p={[x, 1.4, -2.94]} s={[0.06, 2.4, 0.06]} cor="#1E1E1E" />
      ))}
      {/* Volume alto revestido em madeira. */}
      <B p={[60.5, 2.1, -8]} s={[4, 4.2, 6]} cor="#A9825E" r={0.8} />
      <B p={[60.5, 4.25, -8]} s={[4.2, 0.14, 6.2]} cor="#1E1E1E" />
      <B p={[60.5, 2.6, -4.97]} s={[2.2, 2.2, 0.06]} cor={vidro} r={0.15} m={0.3} />
      {/* Varanda com laje em balanço. */}
      <B p={[66.5, 3.0, -1.6]} s={[7, 0.16, 2.8]} cor={branco} r={0.9} />
      {[63.2, 69.8].map((x) => (
        <B key={x} p={[x, 1.5, -0.4]} s={[0.12, 3, 0.12]} cor="#1E1E1E" />
      ))}
      <B p={[66.5, 0.06, -1.6]} s={[7, 0.12, 2.8]} cor="#D9D2C5" r={0.9} />
      {/* Piscina. */}
      <B p={[63.5, 0.05, 0.5]} s={[5.4, 0.1, 2.4]} cor="#E9E4DA" r={0.9} />
      <B p={[63.5, 0.07, 0.5]} s={[5, 0.08, 2]} cor="#7CC6D6" r={0.15} m={0.1} />

      {/* Muro baixo no fundo e árvores. */}
      <B p={[73, 0.6, -13.9]} s={[34, 1.2, 0.2]} cor="#E6E1D8" r={0.9} />
      <Arvore p={[58, 0, -12]} escala={1.2} />
      <Arvore p={[79.5, 0, -11.5]} />
      <Arvore p={[85, 0, -6]} escala={1.1} />
      <Arvore p={[57.5, 0, 0.5]} escala={0.9} />
    </group>
  );
}

function Sapatas({ tempo }: { tempo: Tempo }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.visible = tempo.current >= T.viagem[0];
    if (marcacao.current) marcacao.current.visible = tempo.current < T.guindaste[1] + 0.8;
  });
  const marcacao = useRef<THREE.Group>(null);
  const pontos: [number, number][] = [-L / 2 + 0.35, 0, L / 2 - 0.35].flatMap((x) => [
    [x, -LARGURA / 2 + 0.35] as [number, number],
    [x, LARGURA / 2 - 0.35] as [number, number],
  ]);
  return (
    <group ref={ref} position={[FINAL.x, 0, FINAL.z]} rotation={[0, FINAL.rot, 0]}>
      {pontos.map(([x, z]) => (
        <B key={`${x}${z}`} p={[x, FINAL.y / 2, z]} s={[0.55, FINAL.y, 0.55]} cor="#A4A09A" r={0.95} />
      ))}
      {/* Marcação do local na grama (some depois que o módulo assenta). */}
      <group ref={marcacao}>
      {[
        { p: [0, 0.03, -LARGURA / 2] as Vec3, s: [L, 0.01, 0.05] as Vec3 },
        { p: [0, 0.03, LARGURA / 2] as Vec3, s: [L, 0.01, 0.05] as Vec3 },
        { p: [L / 2, 0.03, 0] as Vec3, s: [0.05, 0.01, LARGURA] as Vec3 },
        { p: [-L / 2, 0.03, 0] as Vec3, s: [0.05, 0.01, LARGURA] as Vec3 },
      ].map((l, i) => (
        <mesh key={i} position={l.p} scale={l.s} geometry={caixa} material={mat(CIANO, 0.4, 0, 1)} />
      ))}
      </group>
    </group>
  );
}

const GUINDASTE = { x: 82.5, z: 1.5, pivo: 2.4, lanca: 13 };

function Guindaste({ tempo }: { tempo: Tempo }) {
  const giro = useRef<THREE.Group>(null);
  const lanca = useRef<THREE.Group>(null);
  const cabo = useRef<THREE.Mesh>(null);
  const lingas = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const t = tempo.current;
    const p = poseModulo(t);
    const alvo = t >= T.viagem[1] ? p : { x: LOTE_X, y: TOPO_CARRETA, z: CAMINHAO_Z, rot: 0 };
    const dx = alvo.x - GUINDASTE.x;
    const dz = alvo.z - GUINDASTE.z;
    const d = Math.min(GUINDASTE.lanca - 0.5, Math.hypot(dx, dz));
    // Terminado o içamento, a lança gira para fora do lote e desce.
    const recolher = suave(trecho(t, T.guindaste[1] + 0.4, T.guindaste[1] + 2.6));
    const yaw = lerp(Math.atan2(-dz, dx), 0, recolher);
    const pitch = lerp(Math.acos(d / GUINDASTE.lanca), 0.2, recolher);
    if (giro.current) giro.current.rotation.y = yaw;
    if (lanca.current) lanca.current.rotation.z = pitch;

    const alcance = Math.cos(pitch) * GUINDASTE.lanca;
    const ponta = new THREE.Vector3(GUINDASTE.x + Math.cos(yaw) * alcance, GUINDASTE.pivo + Math.sin(pitch) * GUINDASTE.lanca, GUINDASTE.z - Math.sin(yaw) * alcance);
    const preso = t >= T.guindaste[0] - 0.4 && t <= T.guindaste[1] + 0.3;
    const gancho = new THREE.Vector3(ponta.x, preso ? alvo.y + TOPO_MODULO + 1.6 : Math.max(1, ponta.y - 2.5), ponta.z);
    if (cabo.current) ligar(cabo.current, ponta, gancho, 0.03);
    const cantos = cantosTopo(p);
    lingas.current.forEach((m, i) => {
      if (!m) return;
      m.visible = preso;
      if (preso) ligar(m, gancho, cantos[i]);
    });
  });

  const amarelo = "#F2B33D";
  return (
    <>
      <group position={[GUINDASTE.x, 0, GUINDASTE.z]}>
        {/* Chassi com patolas abertas. */}
        <B p={[0, 0.9, 0]} s={[6.5, 0.9, 2.6]} cor={amarelo} r={0.5} />
        <B p={[2.6, 1.9, 0]} s={[1.3, 1.2, 2.4]} cor="#2A2D33" r={0.45} />
        {[-2.2, 2.2].map((x) =>
          [-1, 1].map((lado) => (
            <group key={`${x}${lado}`}>
              <B p={[x, 0.7, lado * 2.0]} s={[0.3, 0.25, 1.6]} cor="#2B2B2B" />
              <B p={[x, 0.08, lado * 2.8]} s={[0.6, 0.16, 0.6]} cor="#2B2B2B" />
            </group>
          )),
        )}
        {[-2, 0, 2].map((x) =>
          [-1.15, 1.15].map((z) => <Roda key={`${x}${z}`} p={[x, 0.5, z]} />),
        )}
        <group ref={giro} position={[-0.8, GUINDASTE.pivo - 0.6, 0]}>
          <B p={[0, 0.3, 0]} s={[2.4, 0.9, 2.2]} cor={amarelo} r={0.5} />
          <B p={[-1.4, 0.3, 0]} s={[0.8, 1.0, 2.0]} cor="#2B2B2B" />
          <group ref={lanca} position={[0.4, 0.6, 0]}>
            <B p={[GUINDASTE.lanca / 2, 0, 0]} s={[GUINDASTE.lanca, 0.45, 0.45]} cor={amarelo} r={0.5} />
          </group>
        </group>
      </group>
      <mesh ref={cabo} geometry={cilindro} material={mat("#1A1A1A", 0.6, 0.4)} castShadow />
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={(m) => (lingas.current[i] = m)} geometry={cilindro} material={mat("#1A1A1A", 0.6, 0.4)} castShadow />
      ))}
    </>
  );
}

/* ----------------------------------------------------------------------------------------------
 * Estrada, chão, luz e fundo
 * -------------------------------------------------------------------------------------------- */

function Estrada() {
  return (
    <group>
      <B p={[45, 0.006, CAMINHAO_Z]} s={[150, 0.012, 6]} cor="#D2CEC6" r={1} sombra={false} />
      {Array.from({ length: 30 }, (_, i) => (
        <B key={i} p={[-25 + i * 5, 0.014, CAMINHAO_Z]} s={[2.2, 0.004, 0.12]} cor="#FAFAF7" sombra={false} />
      ))}
      {/* Árvores e postes do lado de lá da estrada (a câmera acompanha o caminhão do lado de cá). */}
      {Array.from({ length: 8 }, (_, i) => (
        <group key={i}>
          <Arvore p={[18 + i * 5.5, 0, -1.5 - (i % 3) * 1.5]} escala={0.8 + (i % 3) * 0.12} />
          <B p={[16 + i * 6, 2.5, 2.4]} s={[0.12, 5, 0.12]} cor="#3A3A3A" />
          <B p={[16 + i * 6, 4.95, 2.8]} s={[0.1, 0.1, 0.9]} cor="#3A3A3A" />
        </group>
      ))}
    </group>
  );
}

const CEU = { topo: "#F6F4F0", horizonte: "#E6E1D9" };

function Fundo() {
  const m = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { topo: { value: new THREE.Color(CEU.topo) }, horizonte: { value: new THREE.Color(CEU.horizonte) } },
        vertexShader: `varying vec3 vPos; void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform vec3 topo; uniform vec3 horizonte; varying vec3 vPos;
          void main() { float t = clamp(normalize(vPos).y * 1.6, 0.0, 1.0); gl_FragColor = vec4(mix(horizonte, topo, t), 1.0);
          #include <colorspace_fragment>
          }`,
      }),
    [],
  );
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ camera }) => ref.current?.position.copy(camera.position));
  return (
    <mesh ref={ref} material={m} renderOrder={-1}>
      <sphereGeometry args={[150, 32, 16]} />
    </mesh>
  );
}

function Ambiente() {
  return (
    <Environment resolution={256} frames={1} environmentIntensity={1}>
      <color attach="background" args={["#DCD6CC"]} />
      <Lightformer form="rect" intensity={1.8} color="#F2F4F7" position={[0, 12, 0]} rotation-x={Math.PI / 2} scale={[40, 40, 1]} />
      <Lightformer form="circle" intensity={10} color="#FFE0BC" position={[14, 6, 9]} scale={[4, 4, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.2} color="#FFD9B5" position={[12, 1.5, 0]} rotation-y={-Math.PI / 2} scale={[40, 3, 1]} />
      <Lightformer form="rect" intensity={0.8} color="#C9D6EA" position={[-12, 3, -4]} rotation-y={Math.PI / 2} scale={[30, 6, 1]} />
      <Lightformer form="rect" intensity={0.6} color="#EDE7DD" position={[0, -1, 0]} rotation-x={-Math.PI / 2} scale={[40, 40, 1]} />
    </Environment>
  );
}

/** Sol com sombra que acompanha o ponto para onde a câmera olha. */
function Sol({ tempo }: { tempo: Tempo }) {
  const luz = useRef<THREE.DirectionalLight>(null);
  const { scene } = useThree();
  useEffect(() => {
    const l = luz.current;
    if (l) scene.add(l.target);
  }, [scene]);
  useFrame(() => {
    const l = luz.current;
    if (!l) return;
    const q = quadroEm(tempo.current);
    l.target.position.set(q.alvo[0], 0, q.alvo[2]);
    l.position.set(q.alvo[0] + 9, 12, q.alvo[2] + 7);
    l.target.updateMatrixWorld();
  });
  return (
    <directionalLight
      ref={luz}
      intensity={2.3}
      color="#FFEEDD"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.03}
      shadow-camera-left={-16}
      shadow-camera-right={16}
      shadow-camera-top={16}
      shadow-camera-bottom={-16}
      shadow-camera-near={1}
      shadow-camera-far={45}
    />
  );
}

function Chao() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[40, -0.002, 0]} receiveShadow material={mat("#E9E5DE", 1)}>
      <planeGeometry args={[400, 300]} />
    </mesh>
  );
}

function Redesenho() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => registrarRedesenho(invalidate), [invalidate]);
  return null;
}

/** Expõe o avanço manual para a gravação quadro a quadro. */
function Gravador({ ativo }: { ativo: boolean }) {
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    if (!ativo) return;
    (window as unknown as { __avancar?: (t: number) => void }).__avancar = (t: number) => advance(t);
  }, [ativo, advance]);
  return null;
}

interface Props {
  tempo: Tempo;
  /** Muda quando o relógio cruza uma troca de configuração do módulo. */
  marco: string;
  gravando: boolean;
  /** Afasta a câmera em telas estreitas (vertical). */
  afastar?: number;
  efeitos?: boolean;
}

export default function Cena({ tempo, marco, gravando, afastar = 1, efeitos = true }: Props) {
  return (
    <Canvas
      frameloop={gravando ? "never" : "always"}
      shadows="soft"
      dpr={gravando ? 1 : [1, 1.75]}
      camera={{ fov: 36, near: 0.1, far: 300, position: [10, 10, 10] }}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false, preserveDrawingBuffer: gravando }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        registrarAnisotropia(gl.capabilities.getMaxAnisotropy());
      }}
    >
      <color attach="background" args={[CEU.horizonte]} />
      <fog attach="fog" args={[CEU.horizonte, 34, 95]} />
      <Gravador ativo={gravando} />
      <Fundo />
      <Redesenho />
      <Ambiente />
      <Sol tempo={tempo} />
      <Chao />
      <Camera tempo={tempo} afastar={afastar} />
      <Fabrica />
      <Portico tempo={tempo} />
      <Planta tempo={tempo} />
      <Varredura tempo={tempo} />
      <Modulo tempo={tempo} marco={marco} />
      <Caminhao tempo={tempo} />
      <Estrada />
      <Casa />
      <Sapatas tempo={tempo} />
      <Guindaste tempo={tempo} />
      {efeitos && (
        <Suspense fallback={null}>
          <Efeitos />
        </Suspense>
      )}
    </Canvas>
  );
}
