import { useMemo } from "react";
import * as THREE from "three";
import { CHASSI, LARGURA } from "@/lib/modulos-3x6/regras";
import type { Config } from "@/lib/modulos-3x6/tipos";
import { MOLDURA, PLATIBANDA } from "../Fachada";
import { MAT } from "../materiais";
import { texturaCasaStarlink, texturaPainelStarlink, texturaTeslink } from "./marcas";

const materiais = new Map<string, THREE.MeshBasicMaterial>();
/** Imagem acesa (letreiro, adesivo, painel): não escurece com a sombra, como letra caixa iluminada. */
function acesa(chave: string, map: THREE.Texture, transparente: boolean) {
  let m = materiais.get(chave);
  if (!m) {
    m = new THREE.MeshBasicMaterial({ map, transparent: transparente, toneMapped: false, depthWrite: !transparente });
    materiais.set(chave, m);
  }
  return m;
}

/**
 * Identidade da franquia na casca: letreiro "A CASA DA STARLINK" sobre a vitrine, logo TESLINK na frente,
 * painel STARLINK (o planeta) na lateral de trás e a seta branca na quina, como no quiosque da foto.
 * A vitrine é a lateral B (z positivo); a frente (testada) fica em x positivo.
 */
export function FachadaTeslink({ config }: { config: Config }) {
  const L = config.comprimento;
  const H = config.altura;
  const meio = L / 2;
  const topo = H + PLATIBANDA;

  const seta = useMemo(() => {
    // Triângulo vertical: lado reto na quina, ponta para fora, mais alto que o módulo.
    const base = CHASSI;
    const alto = topo + 0.8;
    const s = new THREE.Shape([
      new THREE.Vector2(0, base),
      new THREE.Vector2(0, alto),
      new THREE.Vector2(1.05, base + (alto - base) * 0.42),
    ]);
    return new THREE.ExtrudeGeometry(s, { depth: 0.07, bevelEnabled: false });
  }, [topo]);

  return (
    <group>
      {/* Letreiro em letras soltas sobre a platibanda da vitrine. */}
      <mesh position={[0.2, topo + 0.24, LARGURA / 2 - 0.05]} material={acesa("casa-starlink", texturaCasaStarlink(), true)}>
        <planeGeometry args={[3.6, 0.45]} />
      </mesh>
      {/* Logo TESLINK na frente, em branco sobre o grafite. */}
      <mesh position={[meio + 0.006, CHASSI + 1.95, 0]} rotation={[0, Math.PI / 2, 0]} material={acesa("teslink-fachada", texturaTeslink(), true)}>
        <planeGeometry args={[LARGURA - 2 * MOLDURA.lado - 0.3, (LARGURA - 2 * MOLDURA.lado - 0.3) / 4]} />
      </mesh>
      {/* Painel STARLINK na lateral de trás, com moldura preta. */}
      <group position={[0.3, CHASSI + 1.45, -LARGURA / 2]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0, 0.012]} material={MAT.perfil()} castShadow>
          <boxGeometry args={[4.36, 2.46, 0.02]} />
        </mesh>
        <mesh position={[0, 0, 0.024]} material={acesa("painel-starlink-fachada", texturaPainelStarlink(), false)}>
          <planeGeometry args={[4.2, 2.3]} />
        </mesh>
      </group>
      {/* Seta branca na quina da vitrine com a frente. */}
      <mesh geometry={seta} position={[meio + 0.02, 0, LARGURA / 2 - 0.035]} material={MAT.laca("#F6F6F4")} castShadow receiveShadow />
    </group>
  );
}
