import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";

interface Props {
  children: ReactNode;
  /** "cair": móveis descem no lugar. "subir": paredes e armários crescem a partir do piso. */
  modo?: "cair" | "subir";
  duracao?: number;
  atraso?: number;
}

const suave = (t: number) => 1 - Math.pow(1 - t, 3);

/** Anima a entrada do conteúdo quando ele monta. Use uma key para reanimar a cada troca. */
export function Entrada({ children, modo = "cair", duracao = 0.6, atraso = 0 }: Props) {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(-atraso);

  const aplicar = (g: THREE.Group, p: number) => {
    const e = suave(p);
    if (modo === "cair") {
      g.position.y = (1 - e) * 0.6;
      g.scale.setScalar(0.96 + 0.04 * e);
    } else {
      g.scale.set(1, Math.max(0.001, e), 1);
    }
  };

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g || t.current >= duracao) return;
    t.current = Math.min(duracao, t.current + Math.min(dt, 1 / 15));
    aplicar(g, Math.max(0, t.current) / duracao);
    state.invalidate();
  });

  return (
    <group ref={ref} scale={modo === "cair" ? 0.96 : [1, 0.001, 1]} position={[0, modo === "cair" ? 0.6 : 0, 0]}>
      {children}
    </group>
  );
}
