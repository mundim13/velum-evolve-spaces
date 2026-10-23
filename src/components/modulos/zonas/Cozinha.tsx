import { CHASSI, ESPESSURA_PAREDE as T, FAIXA } from "@/lib/modulos-3x6/regras";
import type { Config } from "@/lib/modulos-3x6/tipos";
import { Caixa } from "../Caixa";
import { Entrada } from "../Entrada";
import { COR } from "../materiais";
import { TETO } from "./Divisorias";

/**
 * Cozinha no fundo, lado da cozinha (z > 0), colada ao banheiro na mesma parede hidráulica.
 * Copa: armário verde, bancada preta, cuba e frigobar embutido. Completa: cooktop, armários altos e coluna.
 */
export function Cozinha({ config }: { config: Config }) {
  if (config.cozinha === "nenhuma") return null;
  const completa = config.cozinha === "completa";
  const meio = config.comprimento / 2;
  const xFundo = -meio + T;
  const xF = -meio + FAIXA;
  const zLat = 1.5 - T;
  const piso = CHASSI;
  const prof = 0.6;
  const xBancada = xFundo + prof / 2;
  const zIni = completa ? 0.66 : 0.06;
  const zMeio = (zIni + zLat) / 2;
  const larg = zLat - zIni;

  return (
    <Entrada key={config.cozinha}>
      {/* Armário verde e bancada preta ao longo do fundo. */}
      <Caixa p={[xBancada, piso + 0.43, zMeio]} s={[prof - 0.02, 0.86, larg]} cor={COR.armarioVerde} rugosidade={0.55} />
      <Caixa p={[xBancada + 0.01, piso + 0.88, zMeio]} s={[prof, 0.04, larg]} cor={COR.granitoPreto} rugosidade={0.3} />
      <mesh position={[xBancada + 0.02, piso + 0.902, zLat - 0.35]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.006, 24]} />
        <meshStandardMaterial color={COR.inox} metalness={0.8} roughness={0.25} />
      </mesh>
      <Caixa p={[xFundo + 0.08, piso + 1.02, zLat - 0.35]} s={[0.03, 0.26, 0.03]} cor={COR.inox} metal={0.8} rugosidade={0.25} />

      {/* Armários superiores verdes. */}
      <Caixa p={[xFundo + 0.18, piso + 1.95, zMeio]} s={[0.35, 0.8, larg]} cor={COR.armarioVerde} rugosidade={0.55} />

      {completa ? (
        <>
          {/* Cooktop e coluna de geladeira/despensa. */}
          <Caixa p={[xBancada + 0.02, piso + 0.905, zIni + 0.32]} s={[0.5, 0.008, 0.52]} cor="#0A0A0A" rugosidade={0.1} />
          <Caixa p={[xBancada, piso + (TETO - piso - 0.15) / 2, 0.35]} s={[prof - 0.02, TETO - piso - 0.15, 0.58]} cor={COR.armarioVerde} rugosidade={0.55} />
          <Caixa p={[xBancada + prof / 2 - 0.005, piso + 1.1, 0.12]} s={[0.012, 0.5, 0.02]} cor={COR.perfil} />
        </>
      ) : (
        /* Frigobar embutido sob a bancada. */
        <Caixa p={[xBancada + 0.02, piso + 0.42, zIni + 0.27]} s={[prof - 0.02, 0.82, 0.48]} cor="#121212" rugosidade={0.3} />
      )}

      {/* Trilho de spots no forro. */}
      <Caixa p={[(xFundo + xF) / 2 + 0.2, TETO - 0.015, 0.75]} s={[0.9, 0.025, 0.03]} cor={COR.perfil} />
      {[-0.25, 0.05, 0.35].map((dx) => (
        <Caixa key={dx} p={[(xFundo + xF) / 2 + 0.2 + dx, TETO - 0.09, 0.75]} s={[0.06, 0.12, 0.06]} cor={COR.perfil} cilindro />
      ))}
    </Entrada>
  );
}
