import { CHASSI, ESPESSURA_PAREDE as T, trechoVivencia } from "@/lib/modulos-3x6/regras";
import type { Config, Vivencia as TipoVivencia } from "@/lib/modulos-3x6/tipos";
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
};

interface Area {
  /** Início e fim úteis da vivência ao longo de x. */
  a: number;
  b: number;
  /** Centro da área de móveis, deixando passagem livre junto à testada. */
  c: number;
}

/** Planta em vaso: folhagem em esferas low-poly sobrepostas. */
function Planta({ x, z, altura = 1.1, escala = 1 }: { x: number; z: number; altura?: number; escala?: number }) {
  const folhas: [number, number, number, number, string][] = [
    [0, altura * 0.62, 0, 0.28, TOM.folha],
    [0.12, altura * 0.78, 0.05, 0.22, TOM.folha2],
    [-0.1, altura * 0.85, -0.06, 0.2, TOM.folha],
    [0.03, altura * 0.98, 0.02, 0.17, TOM.folha2],
    [-0.08, altura * 0.68, 0.12, 0.18, TOM.folha2],
  ];
  return (
    <group position={[x, P, z]} scale={escala}>
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

function CriadoMudo({ x, z }: { x: number; z: number }) {
  return (
    <group>
      <Caixa p={[x, P + 0.27, z]} s={[0.45, 0.42, 0.4]} mat={MAT.madeiraMovel()} raio={0.01} />
      <Caixa p={[x, P + 0.035, z]} s={[0.4, 0.07, 0.35]} mat={MAT.perfil()} />
      <Caixa p={[x, P + 0.32, z + 0.201]} s={[0.4, 0.004, 0.002]} mat={MAT.perfil()} sombra={false} />
    </group>
  );
}

function Casal({ c }: Area) {
  const z = Z_A + 1.05;
  return (
    <>
      <Tapete x={c} z={z + 0.15} w={2.5} d={1.7} />
      {/* Base, colchão, edredom com caimento, manta nos pés e travesseiros. */}
      <Caixa p={[c, P + 0.17, z]} s={[1.62, 0.26, 2.04]} mat={MAT.madeiraMovel()} raio={0.015} />
      <Caixa p={[c, P + 0.41, z]} s={[1.58, 0.24, 2.0]} mat={MAT.tecido(TOM.lencol)} raio={0.06} />
      <Caixa p={[c, P + 0.47, z + 0.28]} s={[1.66, 0.16, 1.48]} mat={MAT.tecido(TOM.edredom)} raio={0.07} />
      <Caixa p={[c, P + 0.56, z + 0.72]} s={[1.68, 0.05, 0.42]} mat={MAT.tecido(TOM.manta)} raio={0.02} />
      {[-0.42, 0.42].map((d) => (
        <group key={d}>
          <Caixa p={[c + d, P + 0.6, Z_A + 0.27]} s={[0.66, 0.15, 0.38]} mat={MAT.tecido(TOM.lencol)} raio={0.07} />
          <Caixa p={[c + d * 0.9, P + 0.66, Z_A + 0.47]} s={[0.42, 0.34, 0.12]} mat={MAT.tecido(TOM.almofada)} raio={0.05} />
        </group>
      ))}
      {[-1.12, 1.12].map((d) => (
        <group key={d}>
          <CriadoMudo x={c + d} z={Z_A + 0.24} />
          <Abajur x={c + d} y={P + 0.48} z={Z_A + 0.24} />
        </group>
      ))}
      <Planta x={c + 1.75} z={Z_B - 0.3} altura={1.25} />
    </>
  );
}

function Cadeira({ x, z, cor = TOM.preto, virada = false }: { x: number; z: number; cor?: string; virada?: boolean }) {
  const dz = virada ? -0.21 : 0.21;
  return (
    <group>
      <Caixa p={[x, P + 0.46, z]} s={[0.46, 0.07, 0.44]} mat={MAT.tecido(cor)} raio={0.025} />
      <Caixa p={[x, P + 0.8, z + dz]} s={[0.44, 0.48, 0.06]} mat={MAT.tecido(cor)} raio={0.025} />
      <Caixa p={[x, P + 0.22, z]} s={[0.05, 0.4, 0.05]} mat={MAT.perfil()} cilindro />
      <Caixa p={[x, P + 0.02, z]} s={[0.5, 0.03, 0.5]} mat={MAT.perfil()} cilindro />
    </group>
  );
}

function Solteiro({ a, c }: Area) {
  return (
    <>
      <Caixa p={[a + 1.05, P + 0.16, Z_A + 0.48]} s={[1.98, 0.24, 0.94]} mat={MAT.madeiraMovel()} raio={0.012} />
      <Caixa p={[a + 1.05, P + 0.38, Z_A + 0.48]} s={[1.92, 0.22, 0.9]} mat={MAT.tecido(TOM.lencol)} raio={0.05} />
      <Caixa p={[a + 1.25, P + 0.45, Z_A + 0.48]} s={[1.5, 0.12, 0.96]} mat={MAT.tecido(TOM.almofada)} raio={0.05} />
      <Caixa p={[a + 0.3, P + 0.55, Z_A + 0.48]} s={[0.38, 0.13, 0.62]} mat={MAT.tecido(TOM.lencol)} raio={0.06} />
      <CriadoMudo x={a + 2.33} z={Z_A + 0.24} />
      <Abajur x={a + 2.33} y={P + 0.48} z={Z_A + 0.24} />
      {/* Escrivaninha e cadeira. */}
      <Caixa p={[c + 0.6, P + 0.745, Z_B - 0.27]} s={[1.1, 0.03, 0.52]} mat={MAT.madeiraMovel()} raio={0.006} />
      {[-0.52, 0.52].map((d) => (
        <Caixa key={d} p={[c + 0.6 + d, P + 0.365, Z_B - 0.27]} s={[0.03, 0.73, 0.48]} mat={MAT.perfil()} />
      ))}
      <Cadeira x={c + 0.6} z={Z_B - 0.78} cor="#5B6670" />
      <Tapete x={a + 1.4} z={0.35} w={1.6} d={1.0} />
    </>
  );
}

function Estar({ c }: Area) {
  return (
    <>
      <Tapete x={c} z={-0.05} w={2.5} d={1.8} />
      {/* Sofá com assentos e encosto separados. */}
      <Caixa p={[c, P + 0.12, Z_A + 0.46]} s={[2.2, 0.2, 0.88]} mat={MAT.tecido(TOM.estofado)} raio={0.04} />
      {[-0.52, 0.52].map((d) => (
        <group key={d}>
          <Caixa p={[c + d, P + 0.32, Z_A + 0.5]} s={[1.02, 0.2, 0.74]} mat={MAT.tecido(TOM.estofado)} raio={0.07} />
          <Caixa p={[c + d, P + 0.6, Z_A + 0.16]} s={[1.02, 0.45, 0.22]} mat={MAT.tecido(TOM.estofado)} raio={0.08} />
        </group>
      ))}
      {[-1.06, 1.06].map((d) => (
        <Caixa key={d} p={[c + d, P + 0.36, Z_A + 0.46]} s={[0.16, 0.5, 0.88]} mat={MAT.tecido(TOM.estofado)} raio={0.06} />
      ))}
      <Caixa p={[c - 0.6, P + 0.62, Z_A + 0.33]} s={[0.42, 0.36, 0.13]} mat={MAT.tecido(TOM.manta)} raio={0.05} />
      <Caixa p={[c + 0.62, P + 0.62, Z_A + 0.33]} s={[0.42, 0.36, 0.13]} mat={MAT.tecido(TOM.almofada)} raio={0.05} />
      {/* Mesa de centro redonda e rack com TV. */}
      <Caixa p={[c, P + 0.36, 0.1]} s={[0.8, 0.04, 0.8]} mat={MAT.madeiraMovel()} cilindro />
      <Caixa p={[c, P + 0.18, 0.1]} s={[0.08, 0.34, 0.08]} mat={MAT.perfil()} cilindro />
      <Caixa p={[c + 0.1, P + 0.42, 0.15]} s={[0.18, 0.06, 0.24]} mat={MAT.tecido("#2F3A44")} raio={0.008} />
      <Caixa p={[c, P + 0.24, Z_B - 0.22]} s={[1.8, 0.4, 0.42]} mat={MAT.madeiraMovel()} raio={0.01} />
      <Caixa p={[c, P + 1.28, Z_B - 0.035]} s={[1.3, 0.75, 0.04]} cor="#070707" rugosidade={0.12} raio={0.008} />
      <Planta x={c - 1.15} z={Z_B - 0.28} altura={1.2} />
    </>
  );
}

function Escritorio({ c }: Area) {
  return (
    <>
      {[-0.7, 0.7].map((d) => (
        <group key={d}>
          <Caixa p={[c + d, P + 0.745, Z_A + 0.34]} s={[1.25, 0.03, 0.64]} mat={MAT.laca("#EDEBE6")} raio={0.006} />
          <Caixa p={[c + d - 0.59, P + 0.365, Z_A + 0.34]} s={[0.04, 0.73, 0.6]} mat={MAT.perfil()} />
          <Caixa p={[c + d + 0.59, P + 0.365, Z_A + 0.34]} s={[0.04, 0.73, 0.6]} mat={MAT.perfil()} />
          <Caixa p={[c + d, P + 1.06, Z_A + 0.16]} s={[0.62, 0.37, 0.025]} cor="#0A0A0A" rugosidade={0.15} raio={0.006} />
          <Caixa p={[c + d, P + 0.84, Z_A + 0.18]} s={[0.06, 0.16, 0.04]} mat={MAT.perfil()} />
          <Caixa p={[c + d, P + 0.765, Z_A + 0.45]} s={[0.42, 0.012, 0.14]} mat={MAT.laca("#2B2B2B")} raio={0.004} />
          <Cadeira x={c + d} z={Z_A + 0.95} cor="#3E4650" />
        </group>
      ))}
      {/* Estante com livros. */}
      <Caixa p={[c, P + 0.9, Z_B - 0.18]} s={[1.6, 1.8, 0.34]} mat={MAT.madeiraMovel()} raio={0.006} />
      {[0.45, 0.9, 1.35].map((y, i) => (
        <group key={y}>
          {Array.from({ length: 9 }, (_, k) => (
            <Caixa
              key={k}
              p={[c - 0.65 + k * 0.08 + (i % 2) * 0.5, P + y + 0.13, Z_B - 0.37]}
              s={[0.05, 0.24 - (k % 3) * 0.03, 0.2]}
              mat={MAT.laca(["#2F3A44", "#B79B74", "#7D3F2A", "#E6E1D6", "#4F6B53"][(k + i) % 5])}
            />
          ))}
        </group>
      ))}
      <Planta x={c + 1.2} z={Z_B - 0.3} altura={1.0} />
    </>
  );
}

function Academia({ a, b, c }: Area) {
  return (
    <>
      <Caixa p={[(a + b) / 2, P + 0.008, 0]} s={[b - a, 0.014, Z_B - Z_A]} mat={MAT.tecido("#3A3A3A")} sombra={false} />
      {/* Espelho na parede-cabeceira. */}
      <Caixa p={[c, P + 1.15, Z_A + 0.05]} s={[2.4, 1.7, 0.02]} mat={MAT.espelho()} />
      {/* Esteira. */}
      <Caixa p={[c - 0.6, P + 0.12, Z_B - 0.48]} s={[1.75, 0.18, 0.74]} mat={MAT.perfil()} raio={0.03} />
      <Caixa p={[c - 0.65, P + 0.215, Z_B - 0.48]} s={[1.45, 0.01, 0.5]} cor="#111111" rugosidade={0.9} />
      <Caixa p={[c + 0.2, P + 0.75, Z_B - 0.2]} s={[0.06, 1.1, 0.06]} mat={MAT.perfil()} raio={0.02} />
      <Caixa p={[c + 0.2, P + 0.75, Z_B - 0.76]} s={[0.06, 1.1, 0.06]} mat={MAT.perfil()} raio={0.02} />
      <Caixa p={[c + 0.15, P + 1.32, Z_B - 0.48]} s={[0.22, 0.1, 0.62]} mat={MAT.laca("#2C2C2C")} raio={0.03} />
      {/* Banco e suporte de halteres. */}
      <Caixa p={[c + 0.3, P + 0.45, Z_A + 0.95]} s={[1.2, 0.1, 0.32]} mat={MAT.tecido("#2B2B2B")} raio={0.04} />
      <Caixa p={[c + 0.3, P + 0.22, Z_A + 0.95]} s={[0.08, 0.42, 0.25]} mat={MAT.perfil()} />
      <Caixa p={[c + 1.35, P + 0.45, Z_A + 0.22]} s={[0.42, 0.9, 0.3]} mat={MAT.perfil()} raio={0.01} />
      {[0.25, 0.5, 0.75].map((y) =>
        [-0.1, 0.1].map((dx) => (
          <Caixa key={`${y}${dx}`} p={[c + 1.35 + dx, P + y + 0.06, Z_A + 0.36]} s={[0.09, 0.09, 0.2]} mat={MAT.laca("#22D3EE")} cilindro />
        )),
      )}
      <Planta x={c - 1.5} z={Z_A + 0.35} altura={0.9} />
    </>
  );
}

function Brinquedoteca({ c }: Area) {
  const cores = ["#F2C14E", "#7CC6D6", "#EE8C77", "#9CCB8E"];
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => (
        <Caixa
          key={i}
          p={[c - 1.0 + (i % 4) * 0.62, P + 0.012, -0.62 + Math.floor(i / 4) * 0.62]}
          s={[0.61, 0.022, 0.61]}
          mat={MAT.laca(cores[(i + Math.floor(i / 4)) % 4])}
          raio={0.006}
          sombra={false}
        />
      ))}
      <Caixa p={[c + 0.2, P + 0.48, 0.0]} s={[0.8, 0.035, 0.6]} mat={MAT.laca("#FFFFFF")} raio={0.015} />
      <Caixa p={[c + 0.2, P + 0.23, 0.0]} s={[0.06, 0.46, 0.06]} mat={MAT.laca("#FFFFFF")} cilindro />
      {[[-0.25, -0.45], [0.65, -0.45], [-0.25, 0.45], [0.65, 0.45]].map(([dx, dz], i) => (
        <Caixa key={i} p={[c + dx, P + 0.15, dz]} s={[0.3, 0.3, 0.3]} mat={MAT.laca(cores[i])} cilindro />
      ))}
      <Caixa p={[c - 0.2, P + 0.45, Z_B - 0.18]} s={[2.0, 0.9, 0.34]} mat={MAT.laca("#F7F5F0")} raio={0.01} />
      {cores.map((cor, i) => (
        <Caixa key={cor} p={[c - 0.95 + i * 0.5, P + 1.03, Z_B - 0.2]} s={[0.26, 0.26, 0.26]} mat={MAT.laca(cor)} raio={0.04} />
      ))}
      {/* Tenda fechada e mais baixa que o corte da vista por dentro (aberta, virava um triângulo solto). */}
      <mesh position={[c - 1.35, P + 0.65, Z_A + 0.75]} castShadow receiveShadow material={MAT.tecido("#EFE6D6")}>
        <coneGeometry args={[0.6, 1.3, 6]} />
      </mesh>
      <SombraContato x={c - 1.35} z={Z_A + 0.75} w={1.1} d={1.1} />
    </>
  );
}

function Loja({ a, b, c }: Area) {
  return (
    <>
      {/* Balcão junto à divisória. */}
      <Caixa p={[a + 0.45, P + 0.52, 0.25]} s={[0.6, 1.04, 1.7]} mat={MAT.madeira()} raio={0.008} />
      <Caixa p={[a + 0.45, P + 1.06, 0.25]} s={[0.66, 0.04, 1.76]} mat={MAT.granito()} raio={0.005} />
      <Caixa p={[a + 0.5, P + 1.16, 0.6]} s={[0.3, 0.16, 0.22]} cor="#121212" rugosidade={0.3} raio={0.01} />
      {/* Vitrines nas duas laterais. */}
      {[Z_A + 0.2, Z_B - 0.2].map((z) => (
        <group key={z}>
          <Caixa p={[c + 0.3, P + 1.1, z]} s={[2.6, 2.2, 0.38]} mat={MAT.laca("#EDEBE6")} raio={0.006} />
          {[0.5, 1.0, 1.5].map((y) => (
            <group key={y}>
              <Caixa p={[c + 0.3, P + y, z]} s={[2.5, 0.02, 0.4]} mat={MAT.perfil()} />
              <Caixa p={[c + 0.3, P + y + 0.36, z + (z < 0 ? 0.19 : -0.19)]} s={[2.5, 0.006, 0.006]} mat={MAT.led()} sombra={false} />
              {[-0.9, -0.3, 0.3, 0.9].map((dx, i) => (
                <Caixa
                  key={dx}
                  p={[c + 0.3 + dx, P + y + 0.12, z]}
                  s={[0.22, 0.22, 0.2]}
                  mat={MAT.laca(["#22D3EE", "#C8B79C", "#3B3D40", "#E8E3D8"][(i + Math.round(y * 2)) % 4])}
                  raio={0.02}
                />
              ))}
            </group>
          ))}
        </group>
      ))}
      <Caixa p={[Math.min(c + 1.2, b - 1.2), P + 0.4, 0]} s={[0.9, 0.8, 0.9]} mat={MAT.laca(TOM.preto)} raio={0.01} />
      <Caixa p={[Math.min(c + 1.2, b - 1.2), P + 0.86, 0]} s={[0.3, 0.12, 0.3]} mat={MAT.laca("#C8B79C")} raio={0.02} />
      {/* Pendentes sobre o balcão. */}
      {[0, 0.5].map((dz) => (
        <group key={dz}>
          <Caixa p={[a + 0.45, TETO - 0.4, dz]} s={[0.006, 0.8, 0.006]} mat={MAT.perfil()} sombra={false} />
          <Caixa p={[a + 0.45, TETO - 0.85, dz]} s={[0.18, 0.12, 0.18]} mat={MAT.perfil()} cilindro />
          <Caixa p={[a + 0.45, TETO - 0.912, dz]} s={[0.14, 0.004, 0.14]} mat={MAT.led("#FFE4BF", 3)} cilindro sombra={false} />
        </group>
      ))}
    </>
  );
}

const MOVEIS: Record<TipoVivencia, (area: Area) => JSX.Element> = {
  casal: Casal,
  solteiro: Solteiro,
  estar: Estar,
  escritorio: Escritorio,
  academia: Academia,
  brinquedoteca: Brinquedoteca,
  loja: Loja,
};

/**
 * Vivência: parede-cabeceira em painel amadeirado, sanca com LED junto à fachada, plafon quadrado e split.
 * O módulo aparece sempre mobiliado; o mobiliário muda com a aplicação e entra animado.
 */
export function Vivencia({ config }: { config: Config }) {
  const sombra = useSombraCasca();
  const [x0, x1] = trechoVivencia(config);
  const a = x0 + 0.06;
  const b = x1 - T;
  const c = (a + b - 0.6) / 2;
  const area: Area = { a, b, c };
  const face = config.esquadria.face;
  const Moveis = MOVEIS[config.vivencia];
  const ladoSplit = face === "ladoB" ? Z_A + 0.11 : Z_B - 0.11;
  const forro = MAT.pintura(COR.forro);

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

      <Entrada key={`${config.vivencia}-${x0}`}>
        <Moveis {...area} />
      </Entrada>
    </>
  );
}
