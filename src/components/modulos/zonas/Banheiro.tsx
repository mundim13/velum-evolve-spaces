import { CHASSI, ESPESSURA_PAREDE as T, FAIXA, aberturas } from "@/lib/modulos-3x6/regras";
import type { Config } from "@/lib/modulos-3x6/tipos";
import { Caixa } from "../Caixa";
import { Entrada } from "../Entrada";
import { COR, materialVidro } from "../materiais";
import { PainelComFuro, TETO } from "./Divisorias";

/**
 * Banheiro no fundo, lado do banheiro (z < 0): box com piso de seixo junto ao basculante,
 * bancada flutuante de granito preto com cuba quadrada e bacia ao lado da porta (fotos do Cazita).
 */
export function Banheiro({ config }: { config: Config }) {
  if (config.banheiro === "nenhum") return null;
  const completo = config.banheiro === "completo";
  const meio = config.comprimento / 2;
  const xFundo = -meio + T;
  const xF = -meio + FAIXA - 0.03;
  const zLat = -1.5 + T;
  const piso = CHASSI;
  const xBox = xFundo + 0.85;
  const xMeio = (xBox + xF) / 2;
  const bascula = aberturas(config).find((a) => a.id === "basculante")!;

  return (
    <Entrada key={config.banheiro}>
      {/* Porcelanato grande nas paredes do fundo e da lateral, recortado no basculante. */}
      <PainelComFuro
        eixo="z"
        plano={xFundo + 0.008}
        de={zLat}
        ate={-0.04}
        y0={piso}
        y1={TETO}
        furo={{ de: bascula.u0, ate: bascula.u1, y0: bascula.y0, y1: bascula.y1 }}
        cor={COR.porcelanatoBanheiro}
      />
      <PainelComFuro eixo="x" plano={zLat + 0.008} de={xFundo} ate={xF} y0={piso} y1={TETO} cor={COR.porcelanatoBanheiro} />

      {completo && (
        <>
          <Caixa p={[(xFundo + xBox) / 2, piso + 0.006, (zLat - 0.04) / 2]} s={[xBox - xFundo, 0.012, -0.04 - zLat]} cor={COR.seixo} rugosidade={0.9} />
          <Caixa p={[xFundo + 0.42, piso + (TETO - piso) / 2, -0.052]} s={[0.16, TETO - piso, 0.01]} cor={COR.seixo} rugosidade={0.9} />
          <mesh position={[xBox, piso + 1.0, -0.42]} material={materialVidro}>
            <boxGeometry args={[0.01, 2.0, 0.76]} />
          </mesh>
          <Caixa p={[xBox, piso + 1.0, -0.8]} s={[0.02, 2.0, 0.02]} cor={COR.perfil} />
          <Caixa p={[xFundo + 0.42, piso + 2.05, -0.16]} s={[0.22, 0.03, 0.22]} cor={COR.perfil} />
          <Caixa p={[xFundo + 0.42, piso + 1.6, -0.065]} s={[0.025, 0.9, 0.025]} cor={COR.perfil} />
        </>
      )}

      {/* Bancada flutuante e cuba quadrada, presas na lateral. */}
      <Caixa p={[xMeio, piso + 0.78, zLat + 0.24]} s={[0.55, 0.14, 0.46]} cor={COR.granitoPreto} rugosidade={0.35} />
      <Caixa p={[xMeio, piso + 0.91, zLat + 0.24]} s={[0.32, 0.12, 0.32]} cor={COR.louca} rugosidade={0.2} />
      <Caixa p={[xMeio, piso + 1.02, zLat + 0.06]} s={[0.025, 0.14, 0.025]} cor={COR.inox} metal={0.8} rugosidade={0.25} />

      {/* Bacia com caixa acoplada, encostada na parede da cozinha. */}
      <Caixa p={[xMeio, piso + 0.2, -0.38]} s={[0.36, 0.4, 0.5]} cor={COR.louca} rugosidade={0.2} />
      <Caixa p={[xMeio, piso + 0.55, -0.12]} s={[0.36, 0.36, 0.16]} cor={COR.louca} rugosidade={0.2} />

      {/* LED no forro junto ao fundo. */}
      <Caixa p={[xFundo + 0.06, TETO - 0.03, (zLat - 0.04) / 2]} s={[0.04, 0.02, -0.04 - zLat]} cor={COR.led} emissivo />
    </Entrada>
  );
}
