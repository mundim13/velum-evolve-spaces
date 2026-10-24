import { useMemo } from "react";
import { CHASSI, LARGURA } from "@/lib/modulos-3x6/regras";
import { tabela, type Config } from "@/lib/modulos-3x6/tipos";
import { Caixa } from "../Caixa";
import { Entrada } from "../Entrada";
import { MOLDURA } from "../Fachada";
import { quadroFace } from "../faces";
import { MAT, criarMaterialDeck } from "../materiais";

const DECK = { comprimento: 6, profundidade: 2, tabua: 0.14, junta: 0.008 };
const TOPO_DECK = CHASSI - 0.03;

/**
 * Opcionais externos no 3D: deck WPC de 6 x 2 m na frente da esquadria principal, pergolado sobre ele
 * e blocos de fundação sob o chassi. Tábuas perpendiculares à fachada, no tom de WPC escolhido.
 */
export function Externos({ config }: { config: Config }) {
  const { deck, pergolado, fundacao } = config.extras;
  const face = config.esquadria.face;
  const q = quadroFace(face, config.comprimento);
  // Na testada, o deck começa depois da moldura e da soleira.
  const inicio = face === "testada" ? MOLDURA.profundidade + 0.02 : 0.03;
  const wpc = tabela.cores.wpc[config.fachada.wpc].hex;
  const matDeck = useMemo(() => criarMaterialDeck(wpc), [wpc]);
  const perfil = MAT.perfil();

  const tabuas = Math.floor(DECK.comprimento / (DECK.tabua + DECK.junta));
  const zc = inicio + DECK.profundidade / 2;
  const meio = config.comprimento / 2;
  const blocos: [number, number][] = [-meio + 0.35, 0, meio - 0.35].flatMap((x) => [
    [x, -LARGURA / 2 + 0.2] as [number, number],
    [x, LARGURA / 2 - 0.2] as [number, number],
  ]);

  return (
    <>
      {fundacao && (
        <Entrada modo="subir" key="fundacao">
          {blocos.map(([x, z]) => (
            <Caixa key={`${x}${z}`} p={[x, 0.05, z + Math.sign(z) * 0.12]} s={[0.5, 0.1, 0.5]} cor="#9C9890" rugosidade={0.95} contato={false} />
          ))}
        </Entrada>
      )}

      {deck && (
        <group position={q.pos} rotation={[0, q.rotY, 0]}>
          <Entrada key={`deck-${face}`}>
            {/* Estrutura escura recuada e testeira em WPC nas bordas livres. */}
            <Caixa p={[0, TOPO_DECK / 2 - 0.02, zc]} s={[DECK.comprimento - 0.1, TOPO_DECK - 0.06, DECK.profundidade - 0.1]} mat={MAT.laca("#1E1E1E")} contato={false} />
            <Caixa p={[0, (TOPO_DECK - 0.03) / 2, inicio + DECK.profundidade - 0.01]} s={[DECK.comprimento, TOPO_DECK - 0.03, 0.02]} mat={matDeck} contato={false} />
            {[-1, 1].map((lado) => (
              <Caixa key={lado} p={[lado * (DECK.comprimento / 2 - 0.01), (TOPO_DECK - 0.03) / 2, zc]} s={[0.02, TOPO_DECK - 0.03, DECK.profundidade]} mat={matDeck} contato={false} />
            ))}
            {Array.from({ length: tabuas }, (_, i) => (
              <Caixa
                key={i}
                p={[-DECK.comprimento / 2 + (DECK.tabua + DECK.junta) * (i + 0.5), TOPO_DECK - 0.0125, zc]}
                s={[DECK.tabua, 0.025, DECK.profundidade]}
                mat={matDeck}
                raio={0.003}
                contato={false}
              />
            ))}
          </Entrada>

          {pergolado && (
            <Entrada key={`pergolado-${face}`} atraso={0.15}>
              {/* Pilares pretos na borda do deck, viga junto à fachada e na frente, e sarrafos de WPC por cima. */}
              {[-1, 1].map((lado) => (
                <Caixa key={lado} p={[lado * (DECK.comprimento / 2 - 0.1), TOPO_DECK + 1.25, inicio + DECK.profundidade - 0.1]} s={[0.1, 2.5, 0.1]} mat={perfil} contato={false} />
              ))}
              <Caixa p={[0, TOPO_DECK + 2.55, inicio + DECK.profundidade - 0.1]} s={[DECK.comprimento, 0.16, 0.08]} mat={perfil} contato={false} />
              <Caixa p={[0, TOPO_DECK + 2.55, inicio + 0.04]} s={[DECK.comprimento, 0.16, 0.08]} mat={perfil} contato={false} />
              {Array.from({ length: 20 }, (_, i) => (
                <Caixa
                  key={i}
                  p={[-DECK.comprimento / 2 + 0.15 + i * ((DECK.comprimento - 0.3) / 19), TOPO_DECK + 2.68, zc]}
                  s={[0.05, 0.1, DECK.profundidade + 0.1]}
                  mat={matDeck}
                  contato={false}
                />
              ))}
            </Entrada>
          )}
        </group>
      )}
    </>
  );
}
