import { useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { layoutVivencia, type Colocada, type Parede, type TipoPeca } from "@/lib/modulos-3x6/layout";
import { CHASSI, ESPESSURA_PAREDE as T, trechoVivencia } from "@/lib/modulos-3x6/regras";
import type { Config } from "@/lib/modulos-3x6/tipos";
import { Caixa } from "../Caixa";
import { Entrada } from "../Entrada";
import { COR, MAT } from "../materiais";
import { SombraContato, useSombraCasca } from "../sombra";
import { TETO } from "./Divisorias";

const P = CHASSI;
const Z_A = -1.5 + T; // face interna da lateral do banheiro (parede-cabeceira)
const Z_B = 1.5 - T; // face interna da lateral da cozinha

/** Tons de decoração neutros, com acentos quentes (sem competir com o ciano da marca). */
const TOM = {
  lencol: "#F3F1EC",
  edredom: "#D9D3C7",
  manta: "#A8714F",
  almofada: "#8E9A7F",
  estofado: "#9A948A",
  tapete: "#BDB4A5",
  preto: "#1B1B1B",
  folha: "#4F7344",
  folha2: "#6A8B55",
  vaso: "#D8D2C6",
  borracha: "#46484C",
};

/*
 * Cada móvel é desenhado no próprio referencial: largura ao longo de x (centrada), costas na parede em z = 0
 * e frente para +z; y é a altura absoluta (o piso fica em P). O motor de layout (lib/modulos-3x6/layout.ts)
 * decide a parede e a posição de cada um a partir das aberturas da configuração.
 */
interface PropsPeca {
  largura: number;
  profundidade: number;
  parede: Parede | null;
}

/* ------------------------------------------- peças pequenas ------------------------------------------- */

/** Planta em vaso: folhagem em esferas low-poly sobrepostas. */
function Planta({ x = 0, z = 0.22, altura = 1.15 }: { x?: number; z?: number; altura?: number }) {
  const folhas: [number, number, number, number, string][] = [
    [0, altura * 0.62, 0, 0.28, TOM.folha],
    [0.12, altura * 0.78, 0.05, 0.22, TOM.folha2],
    [-0.1, altura * 0.85, -0.06, 0.2, TOM.folha],
    [0.03, altura * 0.98, 0.02, 0.17, TOM.folha2],
    [-0.08, altura * 0.68, 0.12, 0.18, TOM.folha2],
  ];
  return (
    <group position={[x, P, z]}>
      <SombraContato x={0} z={0} w={0.4} d={0.4} y={0} />
      <Caixa p={[0, 0.16, 0]} s={[0.32, 0.32, 0.32]} mat={MAT.laca(TOM.vaso)} cilindro />
      <Caixa p={[0, altura * 0.3, 0]} s={[0.025, altura * 0.5, 0.025]} mat={MAT.madeiraMovel()} cilindro />
      {folhas.map(([fx, fy, fz, r, cor], i) => (
        <mesh key={i} position={[fx, fy, fz]} castShadow receiveShadow material={MAT.laca(cor)}>
          <icosahedronGeometry args={[r, 1]} />
        </mesh>
      ))}
    </group>
  );
}

function Abajur({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <group position={[x, y, z]}>
      <Caixa p={[0, 0.12, 0]} s={[0.12, 0.24, 0.12]} mat={MAT.laca("#2A2826")} cilindro />
      <Caixa p={[0, 0.33, 0]} s={[0.26, 0.2, 0.26]} mat={MAT.led("#FFE4BF", 1.4)} cilindro sombra={false} />
    </group>
  );
}

function Tapete({ x, z, w, d }: { x: number; z: number; w: number; d: number }) {
  return <Caixa p={[x, P + 0.006, z]} s={[w, 0.012, d]} mat={MAT.tecido(TOM.tapete)} raio={0.005} sombra={false} />;
}

function Cadeira({ x, z, cor = TOM.preto }: { x: number; z: number; cor?: string }) {
  return (
    <group>
      <Caixa p={[x, P + 0.46, z]} s={[0.46, 0.07, 0.44]} mat={MAT.tecido(cor)} raio={0.025} />
      <Caixa p={[x, P + 0.8, z + 0.21]} s={[0.44, 0.48, 0.06]} mat={MAT.tecido(cor)} raio={0.025} />
      <Caixa p={[x, P + 0.22, z]} s={[0.05, 0.4, 0.05]} mat={MAT.perfil()} cilindro />
      <Caixa p={[x, P + 0.02, z]} s={[0.5, 0.03, 0.5]} mat={MAT.perfil()} cilindro />
    </group>
  );
}

/** Banqueta alta de assento redondo, com aro de apoio para os pés. */
function Banqueta({ x, z, altura = 0.72 }: { x: number; z: number; altura?: number }) {
  return (
    <group position={[x, P, z]}>
      <Caixa p={[0, altura, 0]} s={[0.36, 0.05, 0.36]} mat={MAT.madeiraMovel()} cilindro />
      <Caixa p={[0, altura / 2, 0]} s={[0.05, altura, 0.05]} mat={MAT.perfil()} cilindro />
      <Caixa p={[0, altura * 0.38, 0]} s={[0.3, 0.015, 0.3]} mat={MAT.perfil()} cilindro />
      <Caixa p={[0, 0.012, 0]} s={[0.38, 0.024, 0.38]} mat={MAT.perfil()} cilindro />
    </group>
  );
}

/** Pendente de forro: cabo, cúpula preta e luz quente. */
function Pendente({ x, z, queda = 0.75 }: { x: number; z: number; queda?: number }) {
  return (
    <group>
      <Caixa p={[x, TETO - queda / 2, z]} s={[0.006, queda, 0.006]} mat={MAT.perfil()} sombra={false} />
      <Caixa p={[x, TETO - queda - 0.06, z]} s={[0.2, 0.13, 0.2]} mat={MAT.perfil()} cilindro />
      <Caixa p={[x, TETO - queda - 0.127, z]} s={[0.16, 0.004, 0.16]} mat={MAT.led("#FFE4BF", 3)} cilindro sombra={false} />
    </group>
  );
}

/** Cor "aleatória" estável a partir de um índice (produtos e livros sem piscar a cada render). */
function sortear<T>(lista: T[], i: number) {
  const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453);
  return lista[Math.floor((r - Math.floor(r)) * lista.length)];
}

/* ------------------------------------------- quarto ------------------------------------------- */

function CamaCasal({ parede }: PropsPeca) {
  const z = 1.06;
  return (
    <>
      <Tapete x={0} z={z + 0.15} w={2.5} d={1.7} />
      {/* Fora da parede amadeirada, a cama ganha cabeceira estofada própria. */}
      {parede !== "cabeceira" && <Caixa p={[0, P + 0.62, 0.04]} s={[1.74, 1.0, 0.08]} mat={MAT.tecido(TOM.estofado)} raio={0.03} />}
      <Caixa p={[0, P + 0.17, z]} s={[1.62, 0.26, 2.04]} mat={MAT.madeiraMovel()} raio={0.015} />
      <Caixa p={[0, P + 0.41, z]} s={[1.58, 0.24, 2.0]} mat={MAT.tecido(TOM.lencol)} raio={0.06} />
      <Caixa p={[0, P + 0.47, z + 0.28]} s={[1.66, 0.16, 1.48]} mat={MAT.tecido(TOM.edredom)} raio={0.07} />
      <Caixa p={[0, P + 0.56, z + 0.72]} s={[1.68, 0.05, 0.42]} mat={MAT.tecido(TOM.manta)} raio={0.02} />
      {[-0.42, 0.42].map((d) => (
        <group key={d}>
          <Caixa p={[d, P + 0.6, 0.27]} s={[0.66, 0.15, 0.38]} mat={MAT.tecido(TOM.lencol)} raio={0.07} />
          <Caixa p={[d * 0.9, P + 0.66, 0.47]} s={[0.42, 0.34, 0.12]} mat={MAT.tecido(TOM.almofada)} raio={0.05} />
        </group>
      ))}
    </>
  );
}

function CriadoMudo() {
  return (
    <group>
      <Caixa p={[0, P + 0.27, 0.22]} s={[0.45, 0.42, 0.4]} mat={MAT.madeiraMovel()} raio={0.01} />
      <Caixa p={[0, P + 0.035, 0.22]} s={[0.4, 0.07, 0.35]} mat={MAT.perfil()} />
      <Caixa p={[0, P + 0.32, 0.421]} s={[0.4, 0.004, 0.002]} mat={MAT.perfil()} sombra={false} />
      <Abajur x={0} y={P + 0.48} z={0.22} />
    </group>
  );
}

/** Cama de solteiro com a lateral encostada na parede (cabeceira para -x). */
function CamaSolteiro() {
  return (
    <>
      <Caixa p={[0, P + 0.16, 0.48]} s={[1.98, 0.24, 0.94]} mat={MAT.madeiraMovel()} raio={0.012} />
      <Caixa p={[0, P + 0.38, 0.48]} s={[1.92, 0.22, 0.9]} mat={MAT.tecido(TOM.lencol)} raio={0.05} />
      <Caixa p={[0.2, P + 0.45, 0.48]} s={[1.5, 0.12, 0.96]} mat={MAT.tecido(TOM.almofada)} raio={0.05} />
      <Caixa p={[-0.75, P + 0.55, 0.48]} s={[0.38, 0.13, 0.62]} mat={MAT.tecido(TOM.lencol)} raio={0.06} />
      <Tapete x={0.35} z={1.3} w={1.6} d={0.7} />
    </>
  );
}

function Escrivaninha() {
  return (
    <>
      <Caixa p={[0, P + 0.745, 0.27]} s={[1.1, 0.03, 0.52]} mat={MAT.madeiraMovel()} raio={0.006} />
      {[-0.52, 0.52].map((d) => (
        <Caixa key={d} p={[d, P + 0.365, 0.27]} s={[0.03, 0.73, 0.48]} mat={MAT.perfil()} />
      ))}
      <Caixa p={[-0.3, P + 0.77, 0.22]} s={[0.32, 0.02, 0.22]} mat={MAT.laca("#3A3F45")} raio={0.006} />
      <Abajur x={0.4} y={P + 0.76} z={0.14} />
      <Cadeira x={0} z={0.78} cor="#5B6670" />
    </>
  );
}

/* ------------------------------------------- estar e gourmet ------------------------------------------- */

/** Sofá de dois lugares, desenhado na largura que o layout pediu. */
function Sofa({ largura }: PropsPeca) {
  const w = largura - 0.1;
  const assento = (w - 0.32) / 2;
  return (
    <>
      <Caixa p={[0, P + 0.12, 0.46]} s={[w, 0.2, 0.88]} mat={MAT.tecido(TOM.estofado)} raio={0.04} />
      {[-1, 1].map((lado) => (
        <group key={lado}>
          <Caixa p={[lado * (assento / 2 + 0.005), P + 0.32, 0.5]} s={[assento, 0.2, 0.74]} mat={MAT.tecido(TOM.estofado)} raio={0.07} />
          <Caixa p={[lado * (assento / 2 + 0.005), P + 0.6, 0.16]} s={[assento, 0.45, 0.22]} mat={MAT.tecido(TOM.estofado)} raio={0.08} />
          <Caixa p={[lado * (w / 2 - 0.08), P + 0.36, 0.46]} s={[0.16, 0.5, 0.88]} mat={MAT.tecido(TOM.estofado)} raio={0.06} />
        </group>
      ))}
      <Tapete x={0} z={1.35} w={Math.min(2.2, largura)} d={1.0} />
      <Caixa p={[-assento / 2, P + 0.62, 0.33]} s={[0.42, 0.36, 0.13]} mat={MAT.tecido(TOM.manta)} raio={0.05} />
      <Caixa p={[assento / 2, P + 0.62, 0.33]} s={[0.42, 0.36, 0.13]} mat={MAT.tecido(TOM.almofada)} raio={0.05} />
    </>
  );
}

function RackTv() {
  return (
    <>
      <Caixa p={[0, P + 0.24, 0.22]} s={[1.6, 0.4, 0.42]} mat={MAT.madeiraMovel()} raio={0.01} />
      <Caixa p={[0, P + 0.24, 0.432]} s={[1.56, 0.004, 0.004]} mat={MAT.perfil()} sombra={false} />
      <Caixa p={[0, P + 1.28, 0.035]} s={[1.3, 0.75, 0.04]} cor="#070707" rugosidade={0.12} raio={0.008} />
      <Caixa p={[0.55, P + 0.52, 0.22]} s={[0.12, 0.16, 0.12]} mat={MAT.louca()} cilindro />
      <Caixa p={[-0.5, P + 0.47, 0.25]} s={[0.26, 0.06, 0.18]} mat={MAT.laca("#B79B74")} raio={0.006} />
    </>
  );
}

/** Mesinha ao lado do sofá, com livro e vela (a mesa de centro fechava a passagem da quitinete). */
function MesaLateralSofa() {
  return (
    <>
      <MesaLateral x={0} z={0.23} />
      <Caixa p={[0.05, P + 0.55, 0.26]} s={[0.18, 0.04, 0.24]} mat={MAT.tecido("#2F3A44")} raio={0.008} />
      <Caixa p={[-0.1, P + 0.58, 0.15]} s={[0.07, 0.1, 0.07]} mat={MAT.louca()} cilindro />
    </>
  );
}

/** Bancada gourmet: armário inferior, tampo de granito, cuba de inox e cooktop de quatro bocas. */
function BancadaGourmet({ largura }: PropsPeca) {
  const w = largura;
  return (
    <>
      <Caixa p={[0, P + 0.05, 0.3]} s={[w - 0.04, 0.1, 0.56]} mat={MAT.perfil()} />
      <Caixa p={[0, P + 0.48, 0.31]} s={[w, 0.76, 0.6]} mat={MAT.laca(COR.armarioVerde)} raio={0.004} />
      {Array.from({ length: 4 }, (_, i) => (
        <Caixa key={i} p={[-w / 2 + (w / 4) * (i + 0.5), P + 0.48, 0.612]} s={[w / 4 - 0.008, 0.74, 0.012]} mat={MAT.laca(COR.armarioVerde)} raio={0.003} />
      ))}
      <Caixa p={[0, P + 0.83, 0.62]} s={[w - 0.02, 0.012, 0.006]} mat={MAT.perfil()} sombra={false} />
      <Caixa p={[0, P + 0.88, 0.33]} s={[w + 0.02, 0.04, 0.66]} mat={MAT.granito()} raio={0.004} />
      <Caixa p={[0, P + 0.95, 0.01]} s={[w + 0.02, 0.1, 0.02]} mat={MAT.granito()} />
      {/* Cuba e torneira. */}
      <Caixa p={[-w / 2 + 0.4, P + 0.886, 0.33]} s={[0.46, 0.035, 0.36]} mat={MAT.inox()} raio={0.02} />
      <Caixa p={[-w / 2 + 0.4, P + 0.896, 0.33]} s={[0.42, 0.02, 0.32]} cor="#8E9194" metal={1} rugosidade={0.3} raio={0.015} sombra={false} />
      <Caixa p={[-w / 2 + 0.4, P + 1.06, 0.08]} s={[0.03, 0.32, 0.03]} mat={MAT.perfil()} raio={0.012} />
      <Caixa p={[-w / 2 + 0.4, P + 1.21, 0.17]} s={[0.025, 0.025, 0.2]} mat={MAT.perfil()} raio={0.01} />
      {/* Cooktop de vidro preto com quatro bocas. */}
      <Caixa p={[w / 2 - 0.42, P + 0.904, 0.33]} s={[0.58, 0.008, 0.5]} cor="#0A0A0A" rugosidade={0.05} raio={0.004} />
      {[-0.13, 0.13].flatMap((dx) =>
        [-0.11, 0.11].map((dz) => (
          <Caixa key={`${dx}${dz}`} p={[w / 2 - 0.42 + dx, P + 0.909, 0.33 + dz]} s={[0.17, 0.002, 0.17]} cor="#2A2A2A" rugosidade={0.3} cilindro sombra={false} />
        )),
      )}
      {/* Tábua, panela e temperos para dar escala. */}
      <Caixa p={[0.05, P + 0.91, 0.36]} s={[0.4, 0.02, 0.26]} mat={MAT.madeiraMovel()} raio={0.006} />
      <Caixa p={[w / 2 - 0.29, P + 0.97, 0.22]} s={[0.22, 0.12, 0.22]} mat={MAT.perfil()} cilindro />
      {[0, 1, 2].map((i) => (
        <Caixa key={i} p={[-0.3 + i * 0.08, P + 0.96, 0.12]} s={[0.05, 0.12, 0.05]} mat={MAT.laca(["#E6E1D6", "#7D3F2A", "#4F6B53"][i])} cilindro />
      ))}
      <Pendente x={-w / 4} z={0.42} queda={0.7} />
      <Pendente x={w / 4} z={0.42} queda={0.7} />
    </>
  );
}

function Frigobar() {
  return (
    <>
      <Caixa p={[0, P + 0.43, 0.3]} s={[0.54, 0.86, 0.58]} cor="#1A1A1B" metal={0.4} rugosidade={0.35} raio={0.012} />
      <Caixa p={[0.2, P + 0.6, 0.6]} s={[0.02, 0.3, 0.02]} mat={MAT.inox()} raio={0.004} />
      <Caixa p={[0, P + 0.89, 0.3]} s={[0.26, 0.06, 0.26]} mat={MAT.louca()} cilindro />
      {[-0.06, 0.05].map((d, i) => (
        <mesh key={d} position={[d, P + 0.95, 0.3 + d]} material={MAT.laca(["#C9A24A", "#B5462E"][i])} castShadow>
          <icosahedronGeometry args={[0.045, 1]} />
        </mesh>
      ))}
    </>
  );
}

/** Mesa alta (bistrô) com banquetas do lado da bancada: quem senta fica de frente para o vidro. */
function MesaAlta({ largura, profundidade }: PropsPeca) {
  const zMesa = profundidade / 2 - 0.29;
  return (
    <>
      <Caixa p={[0, P + 1.0, zMesa]} s={[largura, 0.04, 0.55]} mat={MAT.madeiraMovel()} raio={0.008} />
      {[-largura / 2 + 0.15, largura / 2 - 0.15].map((x) => (
        <group key={x}>
          <Caixa p={[x, P + 0.5, zMesa]} s={[0.05, 0.98, 0.05]} mat={MAT.perfil()} />
          <Caixa p={[x, P + 0.01, zMesa]} s={[0.07, 0.02, 0.45]} mat={MAT.perfil()} />
        </group>
      ))}
      <Caixa p={[0, P + 0.3, zMesa]} s={[largura - 0.3, 0.03, 0.03]} mat={MAT.perfil()} />
      {[-0.42, 0, 0.42].map((x) => (
        <Banqueta key={x} x={x} z={-profundidade / 2 + 0.19} />
      ))}
      <Caixa p={[0.3, P + 1.08, zMesa]} s={[0.1, 0.12, 0.1]} mat={MAT.louca()} cilindro />
      <Caixa p={[-0.25, P + 1.04, zMesa + 0.05]} s={[0.3, 0.04, 0.2]} mat={MAT.laca("#E6E1D6")} raio={0.01} />
      <Pendente x={0} z={zMesa} queda={0.85} />
    </>
  );
}

/* ------------------------------------------- escritório ------------------------------------------- */

function MesasEscritorio() {
  return (
    <>
      {[-0.7, 0.7].map((d) => (
        <group key={d}>
          <Caixa p={[d, P + 0.745, 0.34]} s={[1.25, 0.03, 0.64]} mat={MAT.laca("#EDEBE6")} raio={0.006} />
          <Caixa p={[d - 0.59, P + 0.365, 0.34]} s={[0.04, 0.73, 0.6]} mat={MAT.perfil()} />
          <Caixa p={[d + 0.59, P + 0.365, 0.34]} s={[0.04, 0.73, 0.6]} mat={MAT.perfil()} />
          <Caixa p={[d, P + 1.06, 0.16]} s={[0.62, 0.37, 0.025]} cor="#0A0A0A" rugosidade={0.15} raio={0.006} />
          <Caixa p={[d, P + 0.84, 0.18]} s={[0.06, 0.16, 0.04]} mat={MAT.perfil()} />
          <Caixa p={[d, P + 0.765, 0.45]} s={[0.42, 0.012, 0.14]} mat={MAT.laca("#2B2B2B")} raio={0.004} />
          <Cadeira x={d} z={0.95} cor="#3E4650" />
        </group>
      ))}
    </>
  );
}

/** Estante aberta: laterais, fundo e prateleiras, com livros e objetos dentro (não saltando para fora). */
function Estante({ largura }: PropsPeca) {
  const w = largura;
  const alturas = [0.06, 0.48, 0.9, 1.32, 1.74];
  const cores = ["#2F3A44", "#B79B74", "#7D3F2A", "#E6E1D6", "#4F6B53"];
  return (
    <>
      <Caixa p={[0, P + 0.9, 0.012]} s={[w, 1.8, 0.024]} mat={MAT.madeiraMovel()} />
      {[-w / 2 + 0.015, w / 2 - 0.015].map((x) => (
        <Caixa key={x} p={[x, P + 0.9, 0.18]} s={[0.03, 1.8, 0.34]} mat={MAT.madeiraMovel()} />
      ))}
      {alturas.map((y) => (
        <Caixa key={y} p={[0, P + y, 0.18]} s={[w - 0.04, 0.025, 0.34]} mat={MAT.madeiraMovel()} />
      ))}
      {alturas.slice(0, 4).map((y, i) => (
        <group key={y}>
          {Array.from({ length: 8 }, (_, k) => (
            <Caixa
              key={k}
              p={[-w / 2 + 0.12 + k * 0.055 + (i % 2) * 0.6, P + y + 0.015 + (0.26 - (k % 3) * 0.03) / 2, 0.17]}
              s={[0.045, 0.26 - (k % 3) * 0.03, 0.22]}
              mat={MAT.laca(cores[(k + i) % 5])}
            />
          ))}
          <Caixa p={[w / 2 - 0.3 - (i % 2) * 0.55, P + y + 0.1, 0.17]} s={[0.14, 0.18, 0.14]} mat={MAT.louca()} cilindro />
        </group>
      ))}
    </>
  );
}

/* ------------------------------------------- academia ------------------------------------------- */

/** Espelho de parede com moldura preta (sem moldura ele parecia um vão cinza no painel). */
function Espelho({ largura }: PropsPeca) {
  return (
    <>
      <Caixa p={[0, P + 1.08, 0.02]} s={[largura, 1.76, 0.03]} mat={MAT.perfil()} />
      <Caixa p={[0, P + 1.08, 0.037]} s={[largura - 0.06, 1.7, 0.004]} mat={MAT.espelho()} sombra={false} />
    </>
  );
}

/** Esteira ao longo da parede: base, lona, laterais, colunas e painel do lado +x. */
function Esteira() {
  const z = 0.43;
  return (
    <>
      <Caixa p={[-0.05, P + 0.11, z]} s={[1.6, 0.16, 0.74]} mat={MAT.perfil()} raio={0.03} />
      <Caixa p={[-0.1, P + 0.195, z]} s={[1.4, 0.012, 0.5]} cor="#0E0E0E" rugosidade={0.95} />
      {[-0.31, 0.31].map((dz) => (
        <Caixa key={dz} p={[-0.05, P + 0.2, z + dz]} s={[1.5, 0.03, 0.08]} mat={MAT.laca("#3A3B3E")} raio={0.01} />
      ))}
      <Caixa p={[0.72, P + 0.18, z]} s={[0.2, 0.18, 0.74]} mat={MAT.laca("#2C2C2E")} raio={0.03} />
      {[-0.3, 0.3].map((dz) => (
        <group key={dz}>
          <mesh position={[0.72, P + 0.75, z + dz]} rotation={[0, 0, 0.18]} material={MAT.perfil()} castShadow>
            <boxGeometry args={[0.06, 1.15, 0.06]} />
          </mesh>
          <Caixa p={[0.5, P + 1.08, z + dz]} s={[0.4, 0.04, 0.04]} mat={MAT.perfil()} raio={0.015} />
        </group>
      ))}
      <mesh position={[0.66, P + 1.34, z]} rotation={[0, 0, 0.5]} material={MAT.laca("#1E1F21")} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.66]} />
      </mesh>
      <mesh position={[0.62, P + 1.36, z]} rotation={[0, 0, 0.5]} material={MAT.led("#22D3EE", 1.2)}>
        <boxGeometry args={[0.005, 0.18, 0.3]} />
      </mesh>
    </>
  );
}

/** Bicicleta ergométrica: base, volante, quadro inclinado, selim e guidão. */
function Bike() {
  const z = 0.3;
  return (
    <>
      {[-0.4, 0.38].map((x) => (
        <Caixa key={x} p={[x, P + 0.035, z]} s={[0.08, 0.07, 0.5]} mat={MAT.perfil()} raio={0.02} />
      ))}
      <Caixa p={[0, P + 0.09, z]} s={[0.8, 0.06, 0.07]} mat={MAT.perfil()} raio={0.02} />
      <mesh position={[0.28, P + 0.36, z]} rotation={[Math.PI / 2, 0, 0]} material={MAT.laca("#2C2C2E")} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.08, 28]} />
      </mesh>
      <mesh position={[0.28, P + 0.36, z]} rotation={[Math.PI / 2, 0, 0]} material={MAT.laca("#22D3EE")}>
        <cylinderGeometry args={[0.07, 0.07, 0.09, 16]} />
      </mesh>
      <mesh position={[-0.12, P + 0.48, z]} rotation={[0, 0, -0.55]} material={MAT.perfil()} castShadow>
        <boxGeometry args={[0.07, 0.9, 0.07]} />
      </mesh>
      <Caixa p={[-0.36, P + 0.86, z]} s={[0.26, 0.06, 0.18]} mat={MAT.tecido("#1E1E1E")} raio={0.03} />
      <mesh position={[0.2, P + 0.82, z]} rotation={[0, 0, 0.35]} material={MAT.perfil()} castShadow>
        <boxGeometry args={[0.06, 0.6, 0.06]} />
      </mesh>
      <Caixa p={[0.3, P + 1.1, z]} s={[0.08, 0.04, 0.48]} mat={MAT.perfil()} raio={0.02} />
    </>
  );
}

/** Rack de anilhas: dois montantes com pinos, anilhas de tamanhos variados e uma barra apoiada. */
function RackAnilhas() {
  const anilhas: [number, number][] = [
    [0.3, 0.22],
    [0.62, 0.17],
    [0.92, 0.12],
  ];
  return (
    <>
      <Caixa p={[0, P + 0.03, 0.25]} s={[0.86, 0.06, 0.46]} mat={MAT.perfil()} raio={0.01} />
      {[-0.22, 0.22].map((x) => (
        <Caixa key={x} p={[x, P + 0.6, 0.25]} s={[0.06, 1.14, 0.06]} mat={MAT.perfil()} />
      ))}
      {[-1, 1].map((lado) =>
        anilhas.map(([y, r], i) => (
          <group key={`${lado}${y}`}>
            <mesh position={[lado * 0.3, P + y, 0.25]} rotation={[0, 0, Math.PI / 2]} material={MAT.perfil()}>
              <cylinderGeometry args={[0.022, 0.022, 0.16, 10]} />
            </mesh>
            {[0, 1].map((k) => (
              <mesh key={k} position={[lado * (0.3 + k * 0.045), P + y, 0.25]} rotation={[0, 0, Math.PI / 2]} material={MAT.laca(i === 0 ? "#151516" : "#202022")} castShadow>
                <cylinderGeometry args={[r, r, 0.035, 28]} />
              </mesh>
            ))}
          </group>
        )),
      )}
      <mesh position={[0, P + 1.2, 0.25]} rotation={[0, 0, Math.PI / 2]} material={MAT.inox()} castShadow>
        <cylinderGeometry args={[0.016, 0.016, 1.5, 12]} />
      </mesh>
    </>
  );
}

/** Suporte de halteres em dois níveis. */
function Halteres() {
  return (
    <>
      {[-0.26, 0.26].map((x) => (
        <Caixa key={x} p={[x, P + 0.38, 0.18]} s={[0.04, 0.76, 0.3]} mat={MAT.perfil()} />
      ))}
      {[0.38, 0.72].map((y) => (
        <group key={y}>
          <Caixa p={[0, P + y - 0.05, 0.18]} s={[0.56, 0.02, 0.3]} mat={MAT.perfil()} />
          {[-0.15, 0.0, 0.15].map((x, i) => (
            <group key={x}>
              {[-0.07, 0.07].map((dz) => (
                <Caixa key={dz} p={[x, P + y + 0.02, 0.18 + dz]} s={[0.1, 0.1, 0.05]} mat={MAT.laca(i === 1 ? "#22D3EE" : "#1B1B1C")} raio={0.012} />
              ))}
              <Caixa p={[x, P + y + 0.02, 0.18]} s={[0.025, 0.025, 0.12]} mat={MAT.inox()} cilindro />
            </group>
          ))}
        </group>
      ))}
    </>
  );
}

function BancoSupino({ largura, profundidade, parede }: PropsPeca) {
  // Encostado na parede, a origem é a parede: o banco fica centrado na própria profundidade.
  const z = parede ? profundidade / 2 : 0;
  return (
    <group position={[0, 0, z]}>
      <Caixa p={[0, P + 0.45, 0]} s={[largura - 0.05, 0.1, 0.3]} mat={MAT.tecido("#2B2B2B")} raio={0.04} />
      {[-0.42, 0.42].map((x) => (
        <group key={x}>
          <Caixa p={[x, P + 0.22, 0]} s={[0.06, 0.42, 0.06]} mat={MAT.perfil()} />
          <Caixa p={[x, P + 0.02, 0]} s={[0.08, 0.04, 0.4]} mat={MAT.perfil()} raio={0.01} />
        </group>
      ))}
    </group>
  );
}

/** Piso emborrachado aparente: placas de 1 m com junta, em dois tons de grafite. */
function PisoEmborrachado({ a, b }: { a: number; b: number }) {
  const placas: [number, number, number, number][] = [];
  const nx = Math.ceil((b - a) / 1);
  const nz = Math.ceil((Z_B - Z_A) / 1);
  for (let i = 0; i < nx; i++)
    for (let k = 0; k < nz; k++) {
      const x0 = a + i;
      const z0 = Z_A + k;
      placas.push([x0, Math.min(x0 + 1, b), z0, Math.min(z0 + 1, Z_B)]);
    }
  return (
    <>
      {placas.map(([x0, x1, z0, z1], i) => (
        <Caixa
          key={i}
          p={[(x0 + x1) / 2, P + 0.008, (z0 + z1) / 2]}
          s={[x1 - x0 - 0.008, 0.016, z1 - z0 - 0.008]}
          mat={MAT.pintura(i % 3 === 1 ? "#404246" : TOM.borracha)}
          sombra={false}
          contato={false}
        />
      ))}
    </>
  );
}

/* ------------------------------------------- brinquedoteca ------------------------------------------- */

let tecidoListrado: THREE.MeshStandardMaterial | null = null;
/** Lona listrada colorida da cabaninha (listras de ~15 cm descendo do cume). */
function materialListrado() {
  if (!tecidoListrado) {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 8;
    const ctx = canvas.getContext("2d")!;
    ["#F2C14E", "#FBF8F2", "#7CC6D6", "#FBF8F2", "#EE8C77", "#FBF8F2", "#9CCB8E", "#FBF8F2"].forEach((cor, i) => {
      ctx.fillStyle = cor;
      ctx.fillRect(i * 16, 0, 16, 8);
    });
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    tecidoListrado = new THREE.MeshStandardMaterial({ map, roughness: 0.9, side: THREE.DoubleSide });
  }
  return tecidoListrado;
}

/** Cabaninha em A: lona listrada, varetas cruzadas no cume e abertura frontal voltada para o ambiente. */
function Cabaninha() {
  const a = 0.55; // meia largura
  const h = 1.25; // altura do cume (abaixo do corte da vista por dentro)
  const comprimento = 1.2;
  const inclinada = Math.hypot(a, h);
  const theta = Math.atan2(a, h);
  const lona = materialListrado();
  const madeira = MAT.madeiraMovel();
  const fundo = new THREE.Shape([new THREE.Vector2(-a, 0), new THREE.Vector2(a, 0), new THREE.Vector2(0, h)]);
  const aba = (lado: 1 | -1) =>
    new THREE.Shape([new THREE.Vector2(lado * a, 0), new THREE.Vector2(lado * 0.28, 0), new THREE.Vector2(0, 0.85), new THREE.Vector2(0, h)]);
  return (
    <group position={[0, P, 0.6]}>
      {[1, -1].map((lado) => (
        <mesh key={lado} position={[0, h / 2, (lado * a) / 2]} rotation={[-lado * theta, 0, 0]} material={lona} castShadow receiveShadow>
          <boxGeometry args={[comprimento, inclinada, 0.012]} />
        </mesh>
      ))}
      <mesh position={[-comprimento / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={lona} castShadow>
        <shapeGeometry args={[fundo]} />
      </mesh>
      {([1, -1] as const).map((lado) => (
        <mesh key={`aba${lado}`} position={[comprimento / 2 + 0.01, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={lona} castShadow>
          <shapeGeometry args={[aba(lado)]} />
        </mesh>
      ))}
      {[-comprimento / 2 - 0.03, comprimento / 2 + 0.03].map((px) =>
        [1, -1].map((lado) => (
          <mesh key={`${px}${lado}`} position={[px, h * 0.56, lado * a * 0.44]} rotation={[-lado * theta, 0, 0]} material={madeira} castShadow>
            <cylinderGeometry args={[0.014, 0.014, inclinada * 1.14, 8]} />
          </mesh>
        )),
      )}
      <Caixa p={[0.05, 0.05, 0]} s={[1.0, 0.08, 0.9]} mat={MAT.tecido("#7CC6D6")} raio={0.03} contato={false} />
      <Caixa p={[-0.3, 0.17, 0.15]} s={[0.32, 0.16, 0.3]} mat={MAT.tecido("#F2C14E")} raio={0.06} contato={false} />
      <Caixa p={[-0.32, 0.17, -0.18]} s={[0.3, 0.15, 0.28]} mat={MAT.tecido("#EE8C77")} raio={0.06} contato={false} />
      <SombraContato x={0} z={0} w={comprimento + 0.1} d={2 * a + 0.1} y={0} />
    </group>
  );
}

const CORES_INFANTIS = ["#F2C14E", "#7CC6D6", "#EE8C77", "#9CCB8E"];

function EstanteBaixa({ largura }: PropsPeca) {
  const nichos = Math.round(largura / 0.5);
  const passo = largura / nichos;
  return (
    <>
      <Caixa p={[0, P + 0.45, 0.18]} s={[largura, 0.9, 0.34]} mat={MAT.laca("#F7F5F0")} raio={0.01} />
      {Array.from({ length: nichos }, (_, i) =>
        [0.25, 0.65].map((y, k) => (
          <Caixa
            key={`${i}${y}`}
            p={[-largura / 2 + passo * (i + 0.5), P + y, 0.3]}
            s={[passo - 0.07, 0.3, 0.12]}
            mat={MAT.tecido(CORES_INFANTIS[(i + k) % 4])}
            raio={0.03}
          />
        )),
      )}
      {CORES_INFANTIS.map((cor, i) => (
        <Caixa key={cor} p={[-largura / 2 + 0.25 + i * 0.5, P + 1.03, 0.16]} s={[0.26, 0.26, 0.26]} mat={MAT.laca(cor)} raio={0.04} />
      ))}
    </>
  );
}

/** Mesinha redonda com quatro banquinhos, sobre o tatame de EVA. */
function MesinhaInfantil() {
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => (
        <Caixa
          key={i}
          p={[-0.62 + (i % 3) * 0.62, P + 0.012, -0.62 + Math.floor(i / 3) * 0.62]}
          s={[0.61, 0.022, 0.61]}
          mat={MAT.laca(CORES_INFANTIS[(i + Math.floor(i / 3)) % 4])}
          raio={0.006}
          sombra={false}
          contato={false}
        />
      ))}
      <Caixa p={[0, P + 0.48, 0]} s={[0.7, 0.035, 0.7]} mat={MAT.laca("#FFFFFF")} cilindro />
      <Caixa p={[0, P + 0.23, 0]} s={[0.06, 0.46, 0.06]} mat={MAT.laca("#FFFFFF")} cilindro />
      {[[-0.48, 0], [0.48, 0], [0, -0.48], [0, 0.48]].map(([dx, dz], i) => (
        <Caixa key={i} p={[dx, P + 0.15, dz]} s={[0.28, 0.3, 0.28]} mat={MAT.laca(CORES_INFANTIS[i])} cilindro />
      ))}
    </>
  );
}

/* ------------------------------------------- loja ------------------------------------------- */

const CORES_PRODUTOS = ["#22D3EE", "#E8B04B", "#D9583B", "#3E6FB0", "#7BAF6A", "#F2EDE4", "#2B2D31", "#C47AA3"];

/** Fileira de produtos: caixas e potes de tamanhos e cores variados, distribuídos ao longo de uma prateleira. */
function Produtos({ x0, x1, y, z, semente, fundo = 0.26 }: { x0: number; x1: number; y: number; z: number; semente: number; fundo?: number }) {
  const itens: ReactNode[] = [];
  let x = x0 + 0.03;
  let i = 0;
  while (x < x1 - 0.1) {
    const k = semente * 31 + i;
    const w = 0.08 + sortear([0, 0.04, 0.08, 0.12], k);
    const h = 0.1 + sortear([0, 0.06, 0.12, 0.18], k + 7);
    if (x + w > x1 - 0.02) break;
    const pote = sortear([false, false, true], k + 3);
    itens.push(
      <Caixa
        key={i}
        p={[x + w / 2, y + h / 2, z]}
        s={[w, h, Math.min(fundo, pote ? w : fundo - 0.04)]}
        mat={MAT.laca(sortear(CORES_PRODUTOS, k + 11))}
        cilindro={pote}
        raio={pote ? 0 : 0.006}
      />,
    );
    x += w + 0.025;
    i++;
  }
  return <>{itens}</>;
}

/** Prateleira de parede: painel branco, prateleiras pretas com LED e produtos coloridos. */
function PrateleiraLoja({ largura }: PropsPeca) {
  const niveis = [0.45, 0.85, 1.25, 1.65];
  return (
    <>
      <Caixa p={[0, P + 1.05, 0.01]} s={[largura, 2.0, 0.02]} mat={MAT.laca("#F2F0EC")} />
      <Caixa p={[0, P + 0.18, 0.2]} s={[largura, 0.36, 0.4]} mat={MAT.laca("#F2F0EC")} raio={0.006} />
      {niveis.map((y, i) => (
        <group key={y}>
          <Caixa p={[0, P + y, 0.17]} s={[largura - 0.02, 0.025, 0.32]} mat={MAT.perfil()} />
          <Caixa p={[0, P + y - 0.02, 0.3]} s={[largura - 0.06, 0.006, 0.006]} mat={MAT.led()} sombra={false} />
          <Produtos x0={-largura / 2} x1={largura / 2} y={P + y + 0.013} z={0.17} semente={i + 1} />
        </group>
      ))}
      <Produtos x0={-largura / 2} x1={largura / 2} y={P + 0.36} z={0.2} semente={9} fundo={0.3} />
    </>
  );
}

/** Vitrine perto da entrada: base fechada, caixa de vidro com produtos iluminados. */
function Vitrine({ largura }: PropsPeca) {
  return (
    <>
      <Caixa p={[0, P + 0.25, 0.25]} s={[largura, 0.5, 0.48]} mat={MAT.laca("#1E1E1E")} raio={0.006} />
      <Caixa p={[0, P + 0.505, 0.25]} s={[largura - 0.02, 0.01, 0.46]} mat={MAT.laca("#F2F0EC")} />
      <mesh position={[0, P + 0.78, 0.25]} material={MAT.vidro()}>
        <boxGeometry args={[largura - 0.02, 0.55, 0.46]} />
      </mesh>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <Caixa key={`${sx}${sz}`} p={[sx * (largura / 2 - 0.015), P + 0.78, 0.25 + sz * 0.225]} s={[0.012, 0.55, 0.012]} mat={MAT.perfil()} sombra={false} />
        )),
      )}
      <Caixa p={[0, P + 1.05, 0.25]} s={[largura - 0.04, 0.006, 0.006]} mat={MAT.led()} sombra={false} />
      <Produtos x0={-largura / 2 + 0.06} x1={largura / 2 - 0.06} y={P + 0.51} z={0.25} semente={21} fundo={0.2} />
    </>
  );
}

/** Balcão de atendimento com caixa: frente amadeirada, tampo de granito, tela do caixa e maquininha. */
function BalcaoCaixa({ largura }: PropsPeca) {
  return (
    <>
      <Caixa p={[0, P + 0.52, 0.31]} s={[largura, 1.04, 0.6]} mat={MAT.madeira()} raio={0.008} />
      <Caixa p={[0, P + 0.05, 0.32]} s={[largura - 0.06, 0.1, 0.56]} mat={MAT.perfil()} />
      <Caixa p={[0, P + 1.06, 0.31]} s={[largura + 0.04, 0.04, 0.66]} mat={MAT.granito()} raio={0.005} />
      {/* Tela do caixa virada para o atendente (de costas para a parede), maquininha e sacola. */}
      <Caixa p={[-0.25, P + 1.14, 0.2]} s={[0.12, 0.12, 0.1]} mat={MAT.perfil()} />
      <mesh position={[-0.25, P + 1.33, 0.22]} rotation={[-0.25, 0, 0]} material={MAT.laca("#0B0B0C")} castShadow>
        <boxGeometry args={[0.36, 0.24, 0.025]} />
      </mesh>
      <Caixa p={[0.1, P + 1.095, 0.48]} s={[0.08, 0.03, 0.14]} mat={MAT.laca("#2B2D31")} raio={0.008} />
      <Caixa p={[0.35, P + 1.2, 0.32]} s={[0.24, 0.24, 0.1]} mat={MAT.laca("#E8B04B")} raio={0.006} />
      <Pendente x={-largura / 4} z={0.35} queda={0.8} />
      <Pendente x={largura / 4} z={0.35} queda={0.8} />
    </>
  );
}

/** Mesa expositora baixa no meio da loja, com produtos dobrados e caixas. */
function MesaExpositora({ largura, profundidade }: PropsPeca) {
  return (
    <>
      <Caixa p={[0, P + 0.72, 0]} s={[largura, 0.04, profundidade]} mat={MAT.madeiraMovel()} raio={0.006} />
      {[-1, 1].map((sx) => (
        <Caixa key={sx} p={[sx * (largura / 2 - 0.05), P + 0.35, 0]} s={[0.04, 0.7, profundidade - 0.1]} mat={MAT.perfil()} />
      ))}
      {[-0.3, 0, 0.3].map((x, i) => (
        <group key={x}>
          {[0, 1, 2].map((k) => (
            <Caixa key={k} p={[x, P + 0.755 + k * 0.035, -0.12]} s={[0.24, 0.03, 0.2]} mat={MAT.tecido(sortear(CORES_PRODUTOS, i * 3 + k + 40))} raio={0.008} />
          ))}
        </group>
      ))}
      <Produtos x0={-largura / 2 + 0.05} x1={largura / 2 - 0.05} y={P + 0.74} z={0.17} semente={33} fundo={0.18} />
    </>
  );
}


/* ------------------------------------------- zonas de apoio (projeto de interiores) ------------------------------------------- */

/** Poltrona de tecido com pés de madeira, de frente para +z. */
function Poltrona({ x, z, cor = "#B9A58C" }: { x: number; z: number; cor?: string }) {
  return (
    <group position={[x, P, z]}>
      {[-0.3, 0.3].flatMap((dx) =>
        [-0.28, 0.24].map((dz) => <Caixa key={`${dx}${dz}`} p={[dx, 0.07, dz]} s={[0.035, 0.14, 0.035]} mat={MAT.madeiraMovel()} cilindro contato={false} />),
      )}
      <Caixa p={[0, 0.24, 0]} s={[0.76, 0.2, 0.72]} mat={MAT.tecido(cor)} raio={0.05} />
      <Caixa p={[0, 0.38, 0.04]} s={[0.56, 0.1, 0.56]} mat={MAT.tecido(cor)} raio={0.05} />
      <Caixa p={[0, 0.6, -0.29]} s={[0.76, 0.56, 0.16]} mat={MAT.tecido(cor)} raio={0.07} />
      {[-0.33, 0.33].map((dx) => (
        <Caixa key={dx} p={[dx, 0.45, 0.0]} s={[0.12, 0.24, 0.66]} mat={MAT.tecido(cor)} raio={0.05} />
      ))}
      <Caixa p={[0.08, 0.5, -0.17]} s={[0.36, 0.28, 0.1]} mat={MAT.tecido(TOM.manta)} raio={0.05} />
    </group>
  );
}

function MesaLateral({ x, z, altura = 0.52 }: { x: number; z: number; altura?: number }) {
  return (
    <group position={[x, P, z]}>
      <Caixa p={[0, altura, 0]} s={[0.42, 0.03, 0.42]} mat={MAT.madeiraMovel()} cilindro />
      <Caixa p={[0, altura / 2, 0]} s={[0.04, altura, 0.04]} mat={MAT.perfil()} cilindro />
      <Caixa p={[0, 0.012, 0]} s={[0.3, 0.024, 0.3]} mat={MAT.perfil()} cilindro />
    </group>
  );
}

/** Luminária de piso: base, haste fina e cúpula de tecido acesa. */
function LuminariaPiso({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, P, z]}>
      <Caixa p={[0, 0.015, 0]} s={[0.28, 0.03, 0.28]} mat={MAT.perfil()} cilindro />
      <Caixa p={[0, 0.75, 0]} s={[0.022, 1.45, 0.022]} mat={MAT.perfil()} cilindro />
      <Caixa p={[0, 1.52, 0]} s={[0.36, 0.26, 0.36]} mat={MAT.led("#FFE4BF", 1.3)} cilindro sombra={false} />
    </group>
  );
}

/** Canto de descanso do escritório: poltrona, mesinha com café e livro, luminária de piso e tapete. */
function CantoDescanso() {
  return (
    <>
      <Tapete x={0} z={0.45} w={1.3} d={0.85} />
      <Poltrona x={-0.18} z={0.42} />
      <MesaLateral x={0.42} z={0.3} />
      <Caixa p={[0.42, P + 0.57, 0.3]} s={[0.08, 0.09, 0.08]} mat={MAT.louca()} cilindro />
      <Caixa p={[0.36, P + 0.545, 0.36]} s={[0.16, 0.025, 0.22]} mat={MAT.laca("#7D3F2A")} raio={0.004} />
      <LuminariaPiso x={-0.52} z={0.12} />
    </>
  );
}

/** Aparador com portas, impressora e organizadores (apoio do escritório). */
function Aparador({ largura }: PropsPeca) {
  return (
    <>
      <Caixa p={[0, P + 0.4, 0.22]} s={[largura, 0.66, 0.42]} mat={MAT.madeiraMovel()} raio={0.008} />
      {[-0.17, 0.17].map((x) => (
        <Caixa key={x} p={[x * (largura / 0.68), P + 0.04, 0.22]} s={[0.04, 0.08, 0.36]} mat={MAT.perfil()} />
      ))}
      <Caixa p={[0, P + 0.4, 0.432]} s={[0.004, 0.62, 0.004]} mat={MAT.perfil()} sombra={false} />
      <Caixa p={[-largura / 4, P + 0.85, 0.22]} s={[0.42, 0.24, 0.34]} mat={MAT.laca("#E8E6E1")} raio={0.02} />
      <Caixa p={[-largura / 4, P + 0.975, 0.25]} s={[0.3, 0.01, 0.2]} mat={MAT.laca("#2B2B2B")} sombra={false} />
      {[0, 1, 2].map((i) => (
        <Caixa key={i} p={[largura / 4 - 0.1 + i * 0.09, P + 0.86, 0.2]} s={[0.07, 0.26, 0.26]} mat={MAT.laca(["#2F3A44", "#B79B74", "#4F6B53"][i])} raio={0.006} />
      ))}
    </>
  );
}

/** Cadeira de jantar de madeira, de frente para +z. */
function CadeiraJantar({ x, z, giro }: { x: number; z: number; giro: number }) {
  return (
    <group position={[x, P, z]} rotation={[0, giro, 0]}>
      {[-0.18, 0.18].flatMap((dx) =>
        [-0.18, 0.18].map((dz) => <Caixa key={`${dx}${dz}`} p={[dx, 0.22, dz]} s={[0.03, 0.44, 0.03]} mat={MAT.madeiraMovel()} contato={false} />),
      )}
      <Caixa p={[0, 0.46, 0]} s={[0.42, 0.04, 0.42]} mat={MAT.madeiraMovel()} raio={0.01} />
      <Caixa p={[0, 0.48, 0.01]} s={[0.36, 0.03, 0.36]} mat={MAT.tecido("#8E9A7F")} raio={0.01} />
      <Caixa p={[0, 0.72, -0.19]} s={[0.4, 0.3, 0.03]} mat={MAT.madeiraMovel()} raio={0.01} />
    </group>
  );
}

/** Mesa para dois encostada na parede, com uma cadeira de cada lado (kitnet). */
function MesaJantar({ largura }: PropsPeca) {
  return (
    <>
      <Caixa p={[0, P + 0.74, 0.36]} s={[0.6, 0.03, 0.7]} mat={MAT.madeiraMovel()} raio={0.006} />
      {[-0.26, 0.26].flatMap((dx) =>
        [0.06, 0.66].map((dz) => <Caixa key={`${dx}${dz}`} p={[dx, P + 0.365, dz]} s={[0.035, 0.73, 0.035]} mat={MAT.perfil()} contato={false} />),
      )}
      <Caixa p={[0, P + 0.8, 0.36]} s={[0.14, 0.1, 0.14]} mat={MAT.louca()} cilindro />
      <Caixa p={[0.12, P + 0.765, 0.5]} s={[0.24, 0.015, 0.24]} mat={MAT.louca()} cilindro />
      <Caixa p={[-0.12, P + 0.765, 0.22]} s={[0.24, 0.015, 0.24]} mat={MAT.louca()} cilindro />
      <CadeiraJantar x={-largura / 2 + 0.2} z={0.36} giro={Math.PI / 2} />
      <CadeiraJantar x={largura / 2 - 0.2} z={0.36} giro={-Math.PI / 2} />
      <Pendente x={0} z={0.36} queda={0.95} />
    </>
  );
}

/** Adega climatizada e cervejeira: porta de vidro escuro com garrafas, nicho de vinhos em cima. */
function Adega() {
  return (
    <>
      <Caixa p={[0, P + 0.43, 0.24]} s={[0.58, 0.86, 0.48]} mat={MAT.laca("#151516")} raio={0.01} />
      <mesh position={[0, P + 0.45, 0.485]} material={MAT.vidro()}>
        <boxGeometry args={[0.5, 0.72, 0.01]} />
      </mesh>
      {[0.22, 0.46, 0.7].map((y) =>
        [-0.16, -0.05, 0.06, 0.17].map((x, i) => (
          <Caixa key={`${y}${x}`} p={[x, P + y, 0.38]} s={[0.07, 0.18, 0.07]} mat={MAT.laca(["#3B5B33", "#7A2430", "#C9A24A", "#3B5B33"][i])} cilindro sombra={false} />
        )),
      )}
      <Caixa p={[0, P + 0.45, 0.47]} s={[0.46, 0.006, 0.006]} mat={MAT.led("#FFE4BF", 2)} sombra={false} />
      <Caixa p={[0.24, P + 0.45, 0.5]} s={[0.02, 0.3, 0.02]} mat={MAT.inox()} />
      {[-0.15, 0.0, 0.15].map((x) => (
        <mesh key={x} position={[x, P + 0.94, 0.2]} rotation={[Math.PI / 2, 0, 0]} material={MAT.laca("#7A2430")} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.3, 12]} />
        </mesh>
      ))}
    </>
  );
}

/** Espaldar de madeira (barras de alongamento) preso na parede. */
function Espaldar({ largura }: PropsPeca) {
  return (
    <>
      {[-largura / 2 + 0.03, largura / 2 - 0.03].map((x) => (
        <Caixa key={x} p={[x, P + 1.1, 0.07]} s={[0.05, 2.2, 0.1]} mat={MAT.madeiraMovel()} />
      ))}
      {Array.from({ length: 13 }, (_, i) => (
        <mesh key={i} position={[0, P + 0.15 + i * 0.16, 0.07]} rotation={[0, 0, Math.PI / 2]} material={MAT.madeiraMovel()} castShadow>
          <cylinderGeometry args={[0.016, 0.016, largura - 0.08, 10]} />
        </mesh>
      ))}
    </>
  );
}

/** Zona de alongamento: colchonete aberto, colchonete enrolado, rolo de liberação e bola suíça. */
function Colchonetes({ largura }: PropsPeca) {
  return (
    <>
      <Caixa p={[-0.05, P + 0.024, 0.05]} s={[largura - 0.15, 0.012, 0.6]} mat={MAT.laca("#5E8C7A")} raio={0.004} sombra={false} contato={false} />
      <mesh position={[largura / 2 - 0.1, P + 0.07, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={MAT.laca("#C47A5A")} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.6, 18]} />
      </mesh>
      <mesh position={[-largura / 2 + 0.25, P + 0.075, -0.3]} rotation={[0, 0, Math.PI / 2]} material={MAT.laca("#2B2D31")} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.45, 18]} />
      </mesh>
      <mesh position={[0.35, P + 0.3, -0.22]} material={MAT.laca("#7CC6D6")} castShadow receiveShadow>
        <sphereGeometry args={[0.28, 28, 18]} />
      </mesh>
    </>
  );
}

/** Kettlebells numa base baixa, ao lado dos halteres (zona de peso livre). */
function Kettlebells() {
  return (
    <>
      <Caixa p={[0, P + 0.1, 0.15]} s={[0.6, 0.2, 0.3]} mat={MAT.perfil()} raio={0.01} />
      {[-0.2, -0.065, 0.07, 0.205].map((x, i) => {
        const r = 0.055 + i * 0.008;
        return (
          <group key={x} position={[x, P + 0.2 + r, 0.15]}>
            <mesh material={MAT.laca(i % 2 ? "#1B1B1C" : "#22D3EE")} castShadow>
              <sphereGeometry args={[r, 18, 12]} />
            </mesh>
            <mesh position={[0, r * 1.05, 0]} material={MAT.perfil()} castShadow>
              <torusGeometry args={[r * 0.6, 0.012, 8, 18, Math.PI]} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

/** Cantinho de leitura: livros de capa para a frente numa estante baixa, tapete redondo, pufes e almofadões. */
function CantinhoLeitura({ largura }: PropsPeca) {
  return (
    <>
      <Caixa p={[0, P + 0.4, 0.09]} s={[largura, 0.8, 0.16]} mat={MAT.laca("#F7F5F0")} raio={0.008} />
      {[0.22, 0.5, 0.78].map((y, i) => (
        <group key={y}>
          <Caixa p={[0, P + y - 0.02, 0.2]} s={[largura - 0.04, 0.03, 0.08]} mat={MAT.madeiraMovel()} />
          {Array.from({ length: 4 }, (_, k) => (
            <mesh key={k} position={[-largura / 2 + 0.17 + k * ((largura - 0.34) / 3), P + y + 0.1, 0.19]} rotation={[-0.12, 0, 0]} material={MAT.laca(CORES_INFANTIS[(k + i) % 4])} castShadow>
              <boxGeometry args={[0.2, 0.24, 0.015]} />
            </mesh>
          ))}
        </group>
      ))}
      <Caixa p={[0, P + 0.006, 0.55]} s={[1.1, 0.012, 0.7]} mat={MAT.tecido("#E9DCC6")} cilindro sombra={false} contato={false} />
      <Caixa p={[-0.32, P + 0.17, 0.55]} s={[0.4, 0.34, 0.4]} mat={MAT.tecido("#EE8C77")} cilindro />
      <Caixa p={[0.3, P + 0.14, 0.62]} s={[0.36, 0.28, 0.36]} mat={MAT.tecido("#7CC6D6")} cilindro />
      <Caixa p={[0.02, P + 0.09, 0.32]} s={[0.4, 0.16, 0.34]} mat={MAT.tecido("#F2C14E")} raio={0.07} />
    </>
  );
}

/** Espera da loja ou do consultório: duas poltronas e mesinha com revistas. */
function Espera() {
  return (
    <>
      <Tapete x={0} z={0.42} w={1.5} d={0.8} />
      <Poltrona x={-0.42} z={0.4} cor="#8E9A7F" />
      <Poltrona x={0.42} z={0.4} cor="#8E9A7F" />
      <MesaLateral x={0} z={0.2} altura={0.45} />
      <Caixa p={[0, P + 0.475, 0.2]} s={[0.22, 0.02, 0.28]} mat={MAT.laca("#E8B04B")} raio={0.004} />
    </>
  );
}

/** Espelho de corpo inteiro com moldura de madeira. */
function EspelhoCorpo({ largura }: PropsPeca) {
  return (
    <>
      <Caixa p={[0, P + 0.98, 0.02]} s={[largura, 1.72, 0.03]} mat={MAT.madeiraMovel()} raio={0.006} />
      <Caixa p={[0, P + 0.98, 0.037]} s={[largura - 0.08, 1.64, 0.004]} mat={MAT.espelho()} sombra={false} />
    </>
  );
}


/* ------------------------------------------- versões compactas das zonas ------------------------------------------- */

/** Descanso compacto: uma poltrona com luminária de piso. */
function PoltronaLeitura() {
  return (
    <>
      <Poltrona x={0.08} z={0.42} />
      <LuminariaPiso x={-0.36} z={0.14} />
    </>
  );
}

/** Espera compacta: uma poltrona e uma mesinha com revistas. */
function EsperaCompacta() {
  return (
    <>
      <Poltrona x={-0.18} z={0.4} cor="#8E9A7F" />
      <MesaLateral x={0.3} z={0.24} altura={0.45} />
      <Caixa p={[0.3, P + 0.475, 0.24]} s={[0.22, 0.02, 0.28]} mat={MAT.laca("#E8B04B")} raio={0.004} />
    </>
  );
}

/** Leitura compacta: estante baixa de capa para a frente e um pufe. */
function LeituraCompacta({ largura }: PropsPeca) {
  return (
    <>
      <Caixa p={[0, P + 0.3, 0.08]} s={[largura, 0.6, 0.14]} mat={MAT.laca("#F7F5F0")} raio={0.008} />
      {[0.2, 0.46].map((y, i) => (
        <group key={y}>
          <Caixa p={[0, P + y - 0.02, 0.18]} s={[largura - 0.04, 0.03, 0.08]} mat={MAT.madeiraMovel()} />
          {[-0.22, 0, 0.22].map((x, k) => (
            <mesh key={x} position={[x, P + y + 0.09, 0.17]} rotation={[-0.12, 0, 0]} material={MAT.laca(CORES_INFANTIS[(k + i) % 4])} castShadow>
              <boxGeometry args={[0.18, 0.22, 0.015]} />
            </mesh>
          ))}
        </group>
      ))}
      <Caixa p={[0.12, P + 0.15, 0.52]} s={[0.36, 0.3, 0.36]} mat={MAT.tecido("#EE8C77")} cilindro />
    </>
  );
}

/** Alongamento compacto: cesto com colchonetes enrolados, rolo de liberação e bola suíça ao lado. */
function KitAlongamento() {
  return (
    <>
      <Caixa p={[-0.15, P + 0.2, 0.2]} s={[0.36, 0.4, 0.34]} mat={MAT.tecido("#C9B79C")} raio={0.03} />
      {[[-0.22, "#5E8C7A"], [-0.08, "#C47A5A"]].map(([x, cor]) => (
        <mesh key={x as number} position={[x as number, P + 0.5, 0.2]} material={MAT.laca(cor as string)} castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.5, 16]} />
        </mesh>
      ))}
      <mesh position={[0.2, P + 0.25, 0.22]} material={MAT.laca("#7CC6D6")} castShadow receiveShadow>
        <sphereGeometry args={[0.25, 28, 18]} />
      </mesh>
    </>
  );
}

/** Bancada de parede (jantar compacto): tampo preso na parede e duas banquetas. */
function BarParede({ largura }: PropsPeca) {
  return (
    <>
      <Caixa p={[0, P + 1.0, 0.18]} s={[largura, 0.04, 0.36]} mat={MAT.madeiraMovel()} raio={0.006} />
      {[-largura / 2 + 0.12, largura / 2 - 0.12].map((x) => (
        <Caixa key={x} p={[x, P + 0.85, 0.04]} s={[0.04, 0.26, 0.06]} mat={MAT.perfil()} />
      ))}
      {[-0.22, 0.22].map((x) => (
        <Banqueta key={x} x={x} z={0.45} />
      ))}
      <Caixa p={[0.1, P + 1.06, 0.16]} s={[0.1, 0.08, 0.1]} mat={MAT.louca()} cilindro />
    </>
  );
}

/* ------------------------------------------- montagem ------------------------------------------- */

const PECAS: Record<TipoPeca, (p: PropsPeca) => JSX.Element> = {
  "cama-casal": CamaCasal,
  "cama-solteiro": CamaSolteiro,
  "criado-mudo": CriadoMudo,
  escrivaninha: Escrivaninha,
  sofa: Sofa,
  "rack-tv": RackTv,
  "mesa-lateral": MesaLateralSofa,
  "bancada-gourmet": BancadaGourmet,
  frigobar: Frigobar,
  "mesa-alta": MesaAlta,
  "mesas-escritorio": MesasEscritorio,
  estante: Estante,
  espelho: Espelho,
  esteira: Esteira,
  bike: Bike,
  "rack-anilhas": RackAnilhas,
  halteres: Halteres,
  "banco-supino": BancoSupino,
  cabaninha: Cabaninha,
  "estante-baixa": EstanteBaixa,
  "mesinha-infantil": MesinhaInfantil,
  vitrine: Vitrine,
  "balcao-caixa": BalcaoCaixa,
  "prateleira-loja": PrateleiraLoja,
  "mesa-expositora": MesaExpositora,
  "canto-descanso": CantoDescanso,
  aparador: Aparador,
  "mesa-jantar": MesaJantar,
  adega: Adega,
  espaldar: Espaldar,
  colchonetes: Colchonetes,
  kettlebells: Kettlebells,
  "cantinho-leitura": CantinhoLeitura,
  espera: Espera,
  "espelho-corpo": EspelhoCorpo,
  "espera-compacta": EsperaCompacta,
  "poltrona-leitura": PoltronaLeitura,
  "leitura-compacta": LeituraCompacta,
  "kit-alongamento": KitAlongamento,
  "bar-parede": BarParede,
  planta: () => <Planta />,
};

function Peca({ peca }: { peca: Colocada }) {
  const Componente = PECAS[peca.tipo];
  return (
    <group position={[peca.x, 0, peca.z]} rotation={[0, peca.rotY, 0]}>
      <Componente largura={peca.largura} profundidade={peca.profundidade} parede={peca.parede} />
    </group>
  );
}

/**
 * Vivência: parede-cabeceira em painel amadeirado, sanca com LED junto à fachada, plafon quadrado e split.
 * Os móveis vêm do motor de layout, que respeita portas, vidros e janelas; "começar do zero" fica vazio.
 */
export function Vivencia({ config }: { config: Config }) {
  const sombra = useSombraCasca();
  const [x0] = trechoVivencia(config);
  const layout = useMemo(() => layoutVivencia(config), [config]);
  const { a, b } = layout.sala;
  const face = config.esquadria.face;
  const ladoSplit = face === "ladoB" ? Z_A + 0.11 : Z_B - 0.11;
  const forro = MAT.pintura(COR.forro);
  const chave = `${layout.ambiente}-${x0}-${face}-${config.esquadria.tamanho}`;

  return (
    <>
      {face !== "ladoA" && (
        <Entrada modo="subir" key={`cabeceira-${x0}`}>
          <Caixa p={[(a + b - 0.35) / 2, (P + TETO) / 2, Z_A + 0.012]} s={[b - 0.35 - a, TETO - P, 0.024]} mat={MAT.madeira()} sombra={sombra} />
          <Caixa p={[(a + b - 0.35) / 2, P + 0.025, Z_A + 0.026]} s={[b - 0.35 - a, 0.05, 0.004]} mat={MAT.perfil()} sombra={false} />
          {/* Tomadas e interruptor sobre o painel, como nas fotos. */}
          {[a + 0.9, b - 1.3].map((x) => (
            <Caixa key={x} p={[x, P + 0.65, Z_A + 0.03]} s={[0.07, 0.11, 0.008]} mat={MAT.laca("#F5F5F2")} raio={0.003} sombra={false} />
          ))}
        </Entrada>
      )}

      {/* Sanca com fita de LED junto à fachada da testada. */}
      <Caixa p={[b - 0.17, TETO - 0.06, 0]} s={[0.34, 0.12, Z_B - Z_A]} mat={forro} />
      <Caixa p={[b - 0.345, TETO - 0.11, 0]} s={[0.01, 0.02, Z_B - Z_A - 0.1]} mat={MAT.led(COR.led, 3)} sombra={false} />

      {/* Plafon quadrado de borda amadeirada e split. */}
      <Caixa p={[(a + b) / 2, TETO - 0.012, 0]} s={[0.46, 0.02, 0.46]} mat={MAT.madeira()} sombra={false} />
      <Caixa p={[(a + b) / 2, TETO - 0.014, 0]} s={[0.42, 0.02, 0.42]} mat={MAT.led("#FFF1DC", 2)} sombra={false} />
      <group>
        <Caixa p={[b - 0.8, P + 2.3, ladoSplit]} s={[0.85, 0.28, 0.2]} mat={MAT.louca()} raio={0.04} />
        <Caixa p={[b - 0.8, P + 2.2, ladoSplit + (ladoSplit > 0 ? -0.1 : 0.1)]} s={[0.78, 0.015, 0.02]} mat={MAT.laca("#2A2A2A")} sombra={false} />
      </group>

      <Entrada key={chave}>
        {layout.ambiente === "academia" && <PisoEmborrachado a={a} b={b} />}
        {layout.pecas.map((p) => (
          <Peca key={p.id} peca={p} />
        ))}
      </Entrada>
    </>
  );
}
