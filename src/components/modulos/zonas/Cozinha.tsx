import { CHASSI, ESPESSURA_PAREDE as T, FAIXA } from "@/lib/modulos-3x6/regras";
import type { Config } from "@/lib/modulos-3x6/tipos";
import { Caixa } from "../Caixa";
import { Entrada } from "../Entrada";
import { COR, MAT } from "../materiais";
import { TETO } from "./Divisorias";

const FOLGA = 0.004;

/**
 * Módulo de armário encostado no fundo, com a frente voltada para +x: caixa, portas com fresta
 * e puxador cava preto no topo (como o armário verde do Cazita).
 */
function Armario({ xFundo, prof, y0, alt, z0, z1, portas }: { xFundo: number; prof: number; y0: number; alt: number; z0: number; z1: number; portas: number }) {
  const verde = MAT.laca(COR.armarioVerde);
  const largura = (z1 - z0) / portas;
  const xFrente = xFundo + prof;
  return (
    <group>
      <Caixa p={[xFundo + (prof - 0.02) / 2, y0 + alt / 2, (z0 + z1) / 2]} s={[prof - 0.02, alt, z1 - z0]} mat={verde} />
      {Array.from({ length: portas }, (_, i) => (
        <Caixa
          key={i}
          p={[xFrente - 0.01, y0 + alt / 2, z0 + largura * (i + 0.5)]}
          s={[0.018, alt - 2 * FOLGA, largura - 2 * FOLGA]}
          mat={verde}
          raio={0.003}
        />
      ))}
      <Caixa p={[xFrente - 0.002, y0 + alt - 0.03, (z0 + z1) / 2]} s={[0.006, 0.02, z1 - z0 - 0.01]} mat={MAT.perfil()} sombra={false} />
    </group>
  );
}

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
  const zIni = completa ? 0.66 : 0.6;
  const zMeio = (zIni + zLat) / 2;
  const larg = zLat - zIni;
  const zCuba = zLat - 0.2;

  return (
    <Entrada key={config.cozinha}>
      {/* Base com portas, rodapé recuado e bancada de granito preto. */}
      <Caixa p={[xFundo + 0.25, piso + 0.05, zMeio]} s={[0.5, 0.1, larg]} mat={MAT.perfil()} />
      <Armario xFundo={xFundo} prof={prof} y0={piso + 0.1} alt={0.76} z0={zIni} z1={zLat} portas={completa ? 2 : 2} />
      <Caixa p={[xBancada + 0.01, piso + 0.88, (zLat + (completa ? zIni : 0.06)) / 2]} s={[prof + 0.02, 0.04, zLat - (completa ? zIni : 0.06)]} mat={MAT.granito()} raio={0.004} />
      {/* Backsplash em granito. */}
      <Caixa p={[xFundo + 0.01, piso + 0.98, (zLat + (completa ? zIni : 0.06)) / 2]} s={[0.02, 0.16, zLat - (completa ? zIni : 0.06)]} mat={MAT.granito()} />

      {/* Cuba de inox embutida e torneira preta. */}
      <Caixa p={[xBancada + 0.03, piso + 0.885, zCuba]} s={[0.4, 0.035, 0.32]} mat={MAT.inox()} raio={0.02} />
      <Caixa p={[xBancada + 0.03, piso + 0.895, zCuba]} s={[0.36, 0.02, 0.28]} cor="#8E9194" metal={1} rugosidade={0.3} raio={0.015} sombra={false} />
      <Caixa p={[xFundo + 0.08, piso + 1.05, zCuba]} s={[0.03, 0.32, 0.03]} mat={MAT.perfil()} raio={0.012} />
      <Caixa p={[xFundo + 0.17, piso + 1.2, zCuba]} s={[0.2, 0.025, 0.025]} mat={MAT.perfil()} raio={0.01} />

      {/* Armários superiores verdes e LED sob eles. */}
      <Armario xFundo={xFundo} prof={0.35} y0={piso + 1.55} alt={0.85} z0={completa ? zIni : 0.06} z1={zLat} portas={completa ? 2 : 3} />
      <Caixa p={[xFundo + 0.3, piso + 1.545, (zLat + (completa ? zIni : 0.06)) / 2]} s={[0.02, 0.008, zLat - (completa ? zIni : 0.06) - 0.06]} mat={MAT.led()} sombra={false} />

      {completa ? (
        <>
          {/* Cooktop de vidro preto com duas bocas e coluna de geladeira/despensa. */}
          <Caixa p={[xBancada + 0.03, piso + 0.904, zIni + 0.18]} s={[0.5, 0.008, 0.3]} cor="#0A0A0A" rugosidade={0.05} raio={0.004} />
          {[-0.12, 0.12].map((d) => (
            <Caixa key={d} p={[xBancada + 0.03 + d, piso + 0.909, zIni + 0.18]} s={[0.18, 0.002, 0.18]} cor="#2A2A2A" rugosidade={0.3} cilindro sombra={false} />
          ))}
          <Armario xFundo={xFundo} prof={prof} y0={piso} alt={TETO - piso - 0.02} z0={0.05} z1={0.64} portas={1} />
          <Caixa p={[xFundo + prof + 0.005, piso + 1.1, 0.12]} s={[0.012, 0.6, 0.02]} mat={MAT.perfil()} raio={0.004} />
        </>
      ) : (
        <>
          {/* Frigobar embutido sob a bancada, com o vão aberto. */}
          <Caixa p={[xFundo + 0.27, piso + 0.43, 0.33]} s={[0.54, 0.84, 0.5]} cor="#1A1A1B" metal={0.4} rugosidade={0.35} raio={0.01} />
          <Caixa p={[xFundo + 0.545, piso + 0.6, 0.12]} s={[0.012, 0.3, 0.02]} mat={MAT.inox()} raio={0.004} />
        </>
      )}

      {/* Um vaso com planta na copa, para dar escala. */}
      {!completa && (
        <>
          <Caixa p={[xBancada - 0.05, piso + 0.95, zCuba - 0.5]} s={[0.12, 0.1, 0.12]} mat={MAT.louca()} cilindro />
          <Caixa p={[xBancada - 0.05, piso + 1.03, zCuba - 0.5]} s={[0.16, 0.12, 0.16]} cor="#5E7F4E" rugosidade={0.9} raio={0.06} />
        </>
      )}

      {/* Trilho de spots no forro. */}
      <Caixa p={[(xFundo + xF) / 2 + 0.2, TETO - 0.015, 0.75]} s={[0.9, 0.025, 0.03]} mat={MAT.perfil()} />
      {[-0.25, 0.05, 0.35].map((dx) => (
        <group key={dx}>
          <Caixa p={[(xFundo + xF) / 2 + 0.2 + dx, TETO - 0.09, 0.75]} s={[0.06, 0.12, 0.06]} mat={MAT.perfil()} cilindro />
          <Caixa p={[(xFundo + xF) / 2 + 0.2 + dx, TETO - 0.151, 0.75]} s={[0.045, 0.002, 0.045]} mat={MAT.led("#FFF1DC", 3)} cilindro sombra={false} />
        </group>
      ))}
    </Entrada>
  );
}
