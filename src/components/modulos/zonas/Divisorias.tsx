import type * as THREE from "three";
import { CHASSI, ESPESSURA_PAREDE as T, FAIXA } from "@/lib/modulos-3x6/regras";
import type { Config } from "@/lib/modulos-3x6/tipos";
import { Caixa } from "../Caixa";
import { Entrada } from "../Entrada";
import { COR, MAT } from "../materiais";

export const TETO = 2.78;
export const ALTURA_PORTA_INTERNA = 2.15;
export const VAO_BANHEIRO: [number, number] = [-1.05, -0.35];
export const VAO_COZINHA: [number, number] = [0.4, 1.2];

/** Retângulo vertical com um furo, montado com até quatro caixas finas (para revestir paredes com janela). */
export function PainelComFuro({
  eixo,
  plano,
  de,
  ate,
  y0,
  y1,
  furo,
  mat,
  espessura = 0.012,
}: {
  eixo: "x" | "z";
  plano: number;
  de: number;
  ate: number;
  y0: number;
  y1: number;
  furo?: { de: number; ate: number; y0: number; y1: number };
  mat: THREE.Material;
  espessura?: number;
}) {
  const pecas: { a: number; b: number; ya: number; yb: number }[] = [];
  if (!furo) pecas.push({ a: de, b: ate, ya: y0, yb: y1 });
  else {
    pecas.push({ a: de, b: furo.de, ya: y0, yb: y1 });
    pecas.push({ a: furo.ate, b: ate, ya: y0, yb: y1 });
    pecas.push({ a: furo.de, b: furo.ate, ya: y0, yb: furo.y0 });
    pecas.push({ a: furo.de, b: furo.ate, ya: furo.y1, yb: y1 });
  }
  return (
    <>
      {pecas
        .filter((p) => p.b - p.a > 0.005 && p.yb - p.ya > 0.005)
        .map((p, i) => {
          const centro = (p.a + p.b) / 2;
          const yc = (p.ya + p.yb) / 2;
          const pos: [number, number, number] = eixo === "x" ? [centro, yc, plano] : [plano, yc, centro];
          const tam: [number, number, number] =
            eixo === "x" ? [p.b - p.a, p.yb - p.ya, espessura] : [espessura, p.yb - p.ya, p.b - p.a];
          return <Caixa key={i} p={pos} s={tam} mat={mat} />;
        })}
    </>
  );
}

/**
 * Painel amadeirado que separa a faixa hidráulica da vivência, com as duas portas de correr embutidas,
 * e a parede entre banheiro e cozinha. Tudo depende de existir banheiro e/ou cozinha.
 */
export function Divisorias({ config }: { config: Config }) {
  const meio = config.comprimento / 2;
  const xF = -meio + FAIXA;
  const zMin = -1.5 + T;
  const zMax = 1.5 - T;
  const temBanheiro = config.banheiro !== "nenhum";
  const temCozinha = config.cozinha !== "nenhuma";
  if (!temBanheiro && !temCozinha) return null;

  const madeira = MAT.madeira();
  const perfil = MAT.perfil();
  const piso = CHASSI;
  const espessura = 0.06;

  // Trechos cheios da divisória, de ponta a ponta, menos os vãos das portas.
  const trechos: [number, number][] = [];
  if (temBanheiro) trechos.push([zMin, VAO_BANHEIRO[0]], [VAO_BANHEIRO[1], 0]);
  if (temCozinha) trechos.push([0, VAO_COZINHA[0]], [VAO_COZINHA[1], zMax]);
  const zIni = temBanheiro ? zMin : 0;
  const zFim = temCozinha ? zMax : 0;
  const alturaTotal = TETO - piso;

  return (
    <Entrada modo="subir" duracao={0.7} key={`${temBanheiro}-${temCozinha}`}>
      {trechos.map(([a, b]) => (
        <Caixa key={`${a}`} p={[xF, piso + alturaTotal / 2, (a + b) / 2]} s={[espessura, alturaTotal, b - a]} mat={madeira} />
      ))}
      {/* Bandeira acima dos vãos e bandô do trilho, como no Cazita. */}
      <Caixa
        p={[xF, (piso + ALTURA_PORTA_INTERNA + TETO) / 2, (zIni + zFim) / 2]}
        s={[espessura, TETO - piso - ALTURA_PORTA_INTERNA, zFim - zIni]}
        mat={madeira}
      />
      <Caixa p={[xF + 0.07, TETO - 0.06, (zIni + zFim) / 2]} s={[0.08, 0.12, zFim - zIni]} mat={madeira} raio={0.004} />
      {/* Rodapé preto fino, como nas fotos. */}
      <Caixa p={[xF + 0.032, piso + 0.025, (zIni + zFim) / 2]} s={[0.004, 0.05, zFim - zIni]} mat={perfil} sombra={false} />

      {/* As duas folhas ficam estacionadas no meio, deixando banheiro e cozinha abertos. */}
      {temBanheiro && temCozinha && (
        <>
          {[0.05, 0.1].map((dx, i) => (
            <group key={dx}>
              <Caixa p={[xF + dx, piso + 1.11, i === 0 ? -0.02 : 0.03]} s={[0.035, 2.2, 0.82]} mat={madeira} raio={0.004} />
              <Caixa p={[xF + dx + 0.02, piso + 1.05, i === 0 ? -0.36 : 0.37]} s={[0.012, 0.2, 0.03]} mat={perfil} raio={0.004} />
            </group>
          ))}
        </>
      )}

      {/* Parede entre banheiro e cozinha: porcelanato do lado do banheiro, branca do lado da cozinha. */}
      {temBanheiro && (
        <>
          <Caixa p={[(-meio + T + xF) / 2, piso + alturaTotal / 2, -0.02]} s={[xF - (-meio + T), alturaTotal, 0.04]} mat={MAT.paredeBanheiro()} />
          <Caixa p={[(-meio + T + xF) / 2, piso + alturaTotal / 2, 0.02]} s={[xF - (-meio + T), alturaTotal, 0.04]} mat={MAT.pintura(COR.paredeInterna)} />
        </>
      )}
    </Entrada>
  );
}
