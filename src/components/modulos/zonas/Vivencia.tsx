import { CHASSI, ESPESSURA_PAREDE as T, trechoVivencia } from "@/lib/modulos-3x6/regras";
import type { Config, Vivencia as TipoVivencia } from "@/lib/modulos-3x6/tipos";
import { Caixa } from "../Caixa";
import { Entrada } from "../Entrada";
import { COR, materialMadeira } from "../materiais";
import { TETO } from "./Divisorias";

const P = CHASSI;
const Z_A = -1.5 + T; // face interna da lateral do banheiro (parede-cabeceira)
const Z_B = 1.5 - T; // face interna da lateral da cozinha

const TECIDO = "#D9D5CC";
const ESTOFADO = "#8D8880";
const MADEIRA_MOVEL = "#8A6340";
const PRETO = "#1A1A1A";

interface Area {
  /** Início e fim úteis da vivência ao longo de x. */
  a: number;
  b: number;
  /** Centro da área de móveis, deixando passagem livre junto à testada. */
  c: number;
}

function Casal({ c }: Area) {
  return (
    <>
      <Caixa p={[c, P + 0.15, Z_A + 1.03]} s={[1.6, 0.3, 2.05]} cor={MADEIRA_MOVEL} />
      <Caixa p={[c, P + 0.42, Z_A + 1.03]} s={[1.56, 0.24, 2.0]} cor="#F2F1EE" rugosidade={0.95} />
      <Caixa p={[c, P + 0.55, Z_A + 1.3]} s={[1.62, 0.04, 1.4]} cor={TECIDO} rugosidade={0.95} />
      <Caixa p={[c - 0.4, P + 0.62, Z_A + 0.25]} s={[0.62, 0.14, 0.36]} cor="#FAFAF8" rugosidade={0.95} />
      <Caixa p={[c + 0.4, P + 0.62, Z_A + 0.25]} s={[0.62, 0.14, 0.36]} cor="#FAFAF8" rugosidade={0.95} />
      {[-1.08, 1.08].map((d) => (
        <Caixa key={d} p={[c + d, P + 0.25, Z_A + 0.24]} s={[0.45, 0.5, 0.42]} cor={MADEIRA_MOVEL} />
      ))}
      <Caixa p={[c, P + 0.006, Z_A + 1.2]} s={[2.6, 0.01, 1.9]} cor="#B9B3A7" rugosidade={1} />
    </>
  );
}

function Solteiro({ a, c }: Area) {
  return (
    <>
      <Caixa p={[a + 1.05, P + 0.15, Z_A + 0.47]} s={[1.95, 0.3, 0.92]} cor={MADEIRA_MOVEL} />
      <Caixa p={[a + 1.05, P + 0.4, Z_A + 0.47]} s={[1.9, 0.22, 0.88]} cor="#F2F1EE" rugosidade={0.95} />
      <Caixa p={[a + 1.3, P + 0.52, Z_A + 0.47]} s={[1.3, 0.04, 0.94]} cor="#7E8B78" rugosidade={0.95} />
      <Caixa p={[a + 0.28, P + 0.57, Z_A + 0.47]} s={[0.36, 0.13, 0.6]} cor="#FAFAF8" rugosidade={0.95} />
      <Caixa p={[a + 2.3, P + 0.25, Z_A + 0.24]} s={[0.42, 0.5, 0.42]} cor={MADEIRA_MOVEL} />
      <Caixa p={[c + 0.6, P + 0.74, Z_B - 0.27]} s={[1.1, 0.04, 0.5]} cor={MADEIRA_MOVEL} />
      <Caixa p={[c + 0.6, P + 0.36, Z_B - 0.27]} s={[1.06, 0.72, 0.03]} cor={MADEIRA_MOVEL} />
      <Cadeira x={c + 0.6} z={Z_B - 0.75} />
    </>
  );
}

function Cadeira({ x, z, cor = PRETO, virada = false }: { x: number; z: number; cor?: string; virada?: boolean }) {
  const dz = virada ? -0.2 : 0.2;
  return (
    <>
      <Caixa p={[x, P + 0.45, z]} s={[0.46, 0.06, 0.44]} cor={cor} />
      <Caixa p={[x, P + 0.78, z + dz]} s={[0.44, 0.5, 0.05]} cor={cor} />
      <Caixa p={[x, P + 0.21, z]} s={[0.05, 0.42, 0.05]} cor={PRETO} cilindro />
    </>
  );
}

function Estar({ c }: Area) {
  return (
    <>
      <Caixa p={[c, P + 0.22, Z_A + 0.45]} s={[2.1, 0.44, 0.88]} cor={ESTOFADO} rugosidade={1} />
      <Caixa p={[c, P + 0.62, Z_A + 0.12]} s={[2.1, 0.4, 0.22]} cor={ESTOFADO} rugosidade={1} />
      {[-1.0, 1.0].map((d) => (
        <Caixa key={d} p={[c + d, P + 0.34, Z_A + 0.45]} s={[0.16, 0.66, 0.88]} cor={ESTOFADO} rugosidade={1} />
      ))}
      <Caixa p={[c, P + 0.2, 0.1]} s={[0.8, 0.4, 0.8]} cor={MADEIRA_MOVEL} cilindro />
      <Caixa p={[c, P + 0.006, 0.0]} s={[2.4, 0.01, 1.8]} cor="#B9B3A7" rugosidade={1} />
      <Caixa p={[c, P + 0.22, Z_B - 0.22]} s={[1.7, 0.36, 0.42]} cor={MADEIRA_MOVEL} />
      <Caixa p={[c, P + 1.25, Z_B - 0.03]} s={[1.25, 0.72, 0.04]} cor="#0B0B0B" rugosidade={0.2} />
    </>
  );
}

function Escritorio({ c }: Area) {
  return (
    <>
      {[-0.7, 0.7].map((d) => (
        <group key={d}>
          <Caixa p={[c + d, P + 0.74, Z_A + 0.33]} s={[1.25, 0.04, 0.62]} cor="#EDEBE6" />
          <Caixa p={[c + d - 0.6, P + 0.36, Z_A + 0.33]} s={[0.04, 0.72, 0.6]} cor={PRETO} />
          <Caixa p={[c + d + 0.6, P + 0.36, Z_A + 0.33]} s={[0.04, 0.72, 0.6]} cor={PRETO} />
          <Caixa p={[c + d, P + 1.03, Z_A + 0.16]} s={[0.6, 0.36, 0.03]} cor="#0B0B0B" rugosidade={0.2} />
          <Cadeira x={c + d} z={Z_A + 0.95} virada={false} />
        </group>
      ))}
      <Caixa p={[c, P + 0.9, Z_B - 0.18]} s={[1.6, 1.8, 0.34]} cor={MADEIRA_MOVEL} />
      {[0.45, 0.9, 1.35].map((y) => (
        <Caixa key={y} p={[c, P + y, Z_B - 0.36]} s={[1.5, 0.02, 0.02]} cor="#6E4D30" />
      ))}
    </>
  );
}

function Academia({ a, b, c }: Area) {
  return (
    <>
      <Caixa p={[(a + b) / 2, P + 0.008, 0]} s={[b - a, 0.014, Z_B - Z_A]} cor="#3C3C3C" rugosidade={1} />
      {/* Espelho na parede-cabeceira. */}
      <Caixa p={[c, P + 1.15, Z_A + 0.05]} s={[2.4, 1.7, 0.02]} cor="#D7DDE0" metal={0.9} rugosidade={0.08} />
      {/* Esteira. */}
      <Caixa p={[c - 0.6, P + 0.12, Z_B - 0.48]} s={[1.75, 0.2, 0.72]} cor={PRETO} />
      <Caixa p={[c + 0.2, P + 0.75, Z_B - 0.48]} s={[0.1, 1.1, 0.7]} cor="#2C2C2C" />
      <Caixa p={[c + 0.15, P + 1.3, Z_B - 0.48]} s={[0.25, 0.08, 0.75]} cor="#2C2C2C" />
      {/* Banco e anilhas. */}
      <Caixa p={[c + 0.3, P + 0.45, Z_A + 0.95]} s={[1.2, 0.1, 0.32]} cor="#3A3A3A" />
      <Caixa p={[c + 0.3, P + 0.22, Z_A + 0.95]} s={[0.08, 0.42, 0.25]} cor={PRETO} />
      <Caixa p={[c + 1.35, P + 0.45, Z_A + 0.22]} s={[0.4, 0.9, 0.3]} cor={PRETO} />
      {[0.2, 0.45, 0.7].map((y) => (
        <Caixa key={y} p={[c + 1.35, P + y, Z_A + 0.4]} s={[0.36, 0.1, 0.1]} cor="#22D3EE" cilindro />
      ))}
    </>
  );
}

function Brinquedoteca({ c }: Area) {
  const cores = ["#F4B740", "#22D3EE", "#F27C6B", "#8FD18B"];
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => (
        <Caixa
          key={i}
          p={[c - 1.0 + (i % 4) * 0.62, P + 0.01, -0.62 + Math.floor(i / 4) * 0.62]}
          s={[0.6, 0.02, 0.6]}
          cor={cores[(i + Math.floor(i / 4)) % 4]}
          rugosidade={1}
        />
      ))}
      <Caixa p={[c + 0.2, P + 0.48, 0.0]} s={[0.8, 0.04, 0.6]} cor="#FFFFFF" />
      <Caixa p={[c + 0.2, P + 0.23, 0.0]} s={[0.06, 0.46, 0.06]} cor="#FFFFFF" cilindro />
      {[[-0.25, -0.45], [0.65, -0.45], [-0.25, 0.45], [0.65, 0.45]].map(([dx, dz], i) => (
        <Caixa key={i} p={[c + dx, P + 0.15, dz]} s={[0.3, 0.3, 0.3]} cor={cores[i]} cilindro />
      ))}
      <Caixa p={[c - 0.2, P + 0.45, Z_B - 0.18]} s={[2.0, 0.9, 0.34]} cor="#F7F5F0" />
      {cores.map((cor, i) => (
        <Caixa key={cor} p={[c - 0.95 + i * 0.5, P + 1.02, Z_B - 0.2]} s={[0.26, 0.26, 0.26]} cor={cor} />
      ))}
      <mesh position={[c - 1.35, P + 0.8, Z_A + 0.75]}>
        <coneGeometry args={[0.6, 1.6, 6, 1, true]} />
        <meshStandardMaterial color="#EFE6D6" side={2} roughness={1} />
      </mesh>
    </>
  );
}

function Loja({ a, b, c }: Area) {
  return (
    <>
      {/* Balcão junto à divisória. */}
      <Caixa p={[a + 0.45, P + 0.52, 0.25]} s={[0.6, 1.04, 1.7]} mat={materialMadeira()} />
      <Caixa p={[a + 0.45, P + 1.06, 0.25]} s={[0.66, 0.04, 1.76]} cor={COR.granitoPreto} rugosidade={0.3} />
      {/* Vitrines nas duas laterais. */}
      {[Z_A + 0.2, Z_B - 0.2].map((z) => (
        <group key={z}>
          <Caixa p={[c + 0.3, P + 1.1, z]} s={[2.6, 2.2, 0.38]} cor="#EDEBE6" />
          {[0.5, 1.0, 1.5].map((y) => (
            <group key={y}>
              <Caixa p={[c + 0.3, P + y, z]} s={[2.5, 0.02, 0.4]} cor="#1A1A1A" />
              {[-0.9, -0.3, 0.3, 0.9].map((dx, i) => (
                <Caixa
                  key={dx}
                  p={[c + 0.3 + dx, P + y + 0.12, z]}
                  s={[0.22, 0.22, 0.2]}
                  cor={["#22D3EE", "#C8B79C", "#3B3D40", "#E8E3D8"][(i + Math.round(y * 2)) % 4]}
                />
              ))}
            </group>
          ))}
        </group>
      ))}
      <Caixa p={[Math.min(c + 1.2, b - 1.2), P + 0.4, 0]} s={[0.9, 0.8, 0.9]} cor={PRETO} />
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
  const [x0, x1] = trechoVivencia(config);
  const a = x0 + 0.06;
  const b = x1 - T;
  const c = (a + b - 0.6) / 2;
  const area: Area = { a, b, c };
  const face = config.esquadria.face;
  const Moveis = MOVEIS[config.vivencia];
  const ladoSplit = face === "ladoB" ? Z_A + 0.11 : Z_B - 0.11;

  return (
    <>
      {face !== "ladoA" && (
        <Entrada modo="subir" key={`cabeceira-${x0}`}>
          <Caixa p={[(a + b - 0.35) / 2, (P + TETO) / 2, Z_A + 0.012]} s={[b - 0.35 - a, TETO - P, 0.024]} mat={materialMadeira()} />
        </Entrada>
      )}

      {/* Sanca com fita de LED junto à fachada da testada. */}
      <Caixa p={[b - 0.17, TETO - 0.06, 0]} s={[0.34, 0.12, Z_B - Z_A]} cor={COR.forro} />
      <Caixa p={[b - 0.345, TETO - 0.11, 0]} s={[0.01, 0.02, Z_B - Z_A - 0.1]} cor={COR.led} emissivo />

      {/* Plafon quadrado e split. */}
      <Caixa p={[(a + b) / 2, TETO - 0.015, 0]} s={[0.42, 0.025, 0.42]} cor={COR.led} emissivo />
      <Caixa p={[b - 0.8, P + 2.3, ladoSplit]} s={[0.85, 0.28, 0.2]} cor="#F7F7F5" rugosidade={0.3} />

      <Entrada key={`${config.vivencia}-${x0}`}>
        <Moveis {...area} />
      </Entrada>
    </>
  );
}
