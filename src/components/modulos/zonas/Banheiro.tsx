import { CHASSI, ESPESSURA_PAREDE as T, FAIXA, aberturas } from "@/lib/modulos-3x6/regras";
import type { Config } from "@/lib/modulos-3x6/tipos";
import { Caixa } from "../Caixa";
import { Entrada } from "../Entrada";
import { MAT } from "../materiais";
import { SombraContato } from "../sombra";
import { PainelComFuro, TETO } from "./Divisorias";

/** Bacia com caixa acoplada, virada para -z, encostada na parede da cozinha. */
function Bacia({ x, z }: { x: number; z: number }) {
  const louca = MAT.louca();
  const p = CHASSI;
  return (
    <group position={[x, p, z]}>
      <SombraContato x={0} z={-0.2} w={0.34} d={0.42} y={0} />
      <Caixa p={[0, 0.17, -0.2]} s={[0.26, 0.34, 0.36]} mat={louca} raio={0.06} />
      <Caixa p={[0, 0.37, -0.26]} s={[0.36, 0.08, 0.5]} mat={louca} raio={0.035} />
      <Caixa p={[0, 0.425, -0.27]} s={[0.35, 0.025, 0.47]} mat={louca} raio={0.012} />
      <Caixa p={[0, 0.58, 0.05]} s={[0.36, 0.36, 0.16]} mat={louca} raio={0.03} />
      <Caixa p={[0.08, 0.765, 0.05]} s={[0.05, 0.012, 0.03]} mat={MAT.inox()} raio={0.004} />
    </group>
  );
}

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
  const porcelanato = MAT.paredeBanheiro();
  const perfil = MAT.perfil();

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
        mat={porcelanato}
      />
      <PainelComFuro eixo="x" plano={zLat + 0.008} de={xFundo} ate={xF} y0={piso} y1={TETO} mat={porcelanato} />

      {completo && (
        <>
          {/* Box: piso de seixo, faixa de seixo na parede, vidro fixo com perfil preto e ducha preta. */}
          <Caixa p={[(xFundo + xBox) / 2, piso + 0.006, (zLat - 0.04) / 2]} s={[xBox - xFundo, 0.012, -0.04 - zLat]} mat={MAT.seixo()} />
          <Caixa p={[xFundo + 0.42, piso + (TETO - piso) / 2, -0.052]} s={[0.16, TETO - piso, 0.01]} mat={MAT.seixo()} />
          <mesh position={[xBox, piso + 1.0, -0.42]} material={MAT.vidro()}>
            <boxGeometry args={[0.01, 2.0, 0.76]} />
          </mesh>
          <Caixa p={[xBox, piso + 1.0, -0.8]} s={[0.02, 2.0, 0.02]} mat={perfil} />
          <Caixa p={[xBox, piso + 0.01, -0.42]} s={[0.02, 0.02, 0.76]} mat={perfil} />
          <Caixa p={[xFundo + 0.42, piso + 2.05, -0.17]} s={[0.24, 0.025, 0.24]} mat={perfil} raio={0.006} />
          <Caixa p={[xFundo + 0.42, piso + 2.1, -0.08]} s={[0.025, 0.025, 0.16]} mat={perfil} raio={0.008} />
          <Caixa p={[xFundo + 0.42, piso + 1.45, -0.065]} s={[0.02, 0.9, 0.02]} mat={perfil} raio={0.008} />
          <Caixa p={[xFundo + 0.42, piso + 1.1, -0.07]} s={[0.06, 0.1, 0.04]} mat={perfil} raio={0.01} />
          {/* Ralo linear. */}
          <Caixa p={[xFundo + 0.15, piso + 0.014, (zLat - 0.04) / 2]} s={[0.05, 0.004, 1.0]} mat={MAT.inox()} sombra={false} />
        </>
      )}

      {/* Bancada flutuante e cuba quadrada, presas na lateral. */}
      <Caixa p={[xMeio, piso + 0.78, zLat + 0.24]} s={[0.55, 0.14, 0.46]} mat={MAT.granito()} raio={0.006} />
      <Caixa p={[xMeio, piso + 0.92, zLat + 0.25]} s={[0.32, 0.13, 0.32]} mat={MAT.louca()} raio={0.02} />
      <Caixa p={[xMeio, piso + 0.975, zLat + 0.25]} s={[0.27, 0.02, 0.27]} cor="#E9E9E6" rugosidade={0.1} raio={0.008} sombra={false} />
      <Caixa p={[xMeio, piso + 1.05, zLat + 0.07]} s={[0.025, 0.18, 0.025]} mat={MAT.inox()} raio={0.01} />
      <Caixa p={[xMeio, piso + 1.13, zLat + 0.12]} s={[0.025, 0.025, 0.12]} mat={MAT.inox()} raio={0.01} />
      {/* Toalha de rosto e porta-sabonete. */}
      <Caixa p={[xMeio + 0.2, piso + 0.88, zLat + 0.47]} s={[0.12, 0.04, 0.02]} mat={MAT.inox()} raio={0.005} />
      <Caixa p={[xMeio - 0.12, piso + 0.88, zLat + 0.4]} s={[0.07, 0.05, 0.07]} mat={MAT.laca("#2D2B28")} raio={0.01} />

      <Bacia x={xMeio} z={-0.17} />

      {/* LED no forro junto ao fundo e plafon. */}
      <Caixa p={[xFundo + 0.06, TETO - 0.03, (zLat - 0.04) / 2]} s={[0.04, 0.02, -0.04 - zLat]} mat={MAT.led()} sombra={false} />
      <Caixa p={[xMeio, TETO - 0.012, (zLat - 0.04) / 2]} s={[0.24, 0.02, 0.24]} mat={MAT.led("#FFF1DC", 2)} sombra={false} />
      <Caixa p={[xMeio, TETO - 0.01, (zLat - 0.04) / 2]} s={[0.27, 0.016, 0.27]} mat={MAT.madeira()} sombra={false} />
    </Entrada>
  );
}
