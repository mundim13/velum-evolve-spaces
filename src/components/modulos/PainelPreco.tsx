import { useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { formatarReais, type ResultadoPreco } from "@/lib/modulos-3x6/preco";

/** Número que corre até o novo valor, para o preço mudar "ao vivo". */
function useNumeroAnimado(valor: number, duracao = 450) {
  const [mostrado, setMostrado] = useState(valor);
  const atual = useRef(valor);
  useEffect(() => {
    const de = atual.current;
    if (de === valor) return;
    const inicio = performance.now();
    let id = 0;
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / duracao);
      const e = 1 - Math.pow(1 - t, 3);
      atual.current = Math.round(de + (valor - de) * e);
      setMostrado(atual.current);
      if (t < 1) id = requestAnimationFrame(passo);
    };
    id = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(id);
  }, [valor, duracao]);
  return mostrado;
}

/** Total sempre visível; o detalhamento abre com um toque. No celular fica fixo na base da tela. */
export function PainelPreco({ resultado }: { resultado: ResultadoPreco }) {
  const [aberto, setAberto] = useState(false);
  const total = useNumeroAnimado(resultado.total);

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 lg:static lg:z-auto lg:mt-auto"
      style={{
        background: "rgba(8,8,8,0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(34,211,238,0.18)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {aberto && (
        <div id="detalhe-preco" className="px-4 pt-4 max-h-[45vh] overflow-y-auto">
          <ul className="flex flex-col gap-2">
            {resultado.itens.map((i) => (
              <li key={i.id} className="flex items-start justify-between gap-3">
                <span className="font-dm" style={{ fontSize: 13, color: "rgba(249,250,251,0.85)" }}>
                  <span style={{ color: "rgba(249,250,251,0.4)", fontSize: 11, display: "block" }}>{i.grupo}</span>
                  {i.nome}
                  {i.nota && (
                    <span style={{ color: "rgba(249,250,251,0.4)", fontSize: 11, display: "block" }}>{i.nota}</span>
                  )}
                </span>
                <span className="font-dm tabular-nums shrink-0" style={{ fontSize: 13, color: "#F9FAFB" }}>
                  {i.venda === 0 ? "Incluso" : formatarReais(i.venda)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 flex flex-col gap-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {resultado.sobConsulta.map((s) => (
              <p key={s} className="flex justify-between font-dm" style={{ fontSize: 12, color: "rgba(249,250,251,0.5)" }}>
                <span>{s}</span>
                <span>Sob consulta</span>
              </p>
            ))}
            <p className="font-dm" style={{ fontSize: 11, color: "rgba(249,250,251,0.35)" }}>
              Fundação, kit mobília, opcionais externos e frete fora de Goiânia e região ficam fora deste total.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 px-4" style={{ minHeight: 68 }}>
        <div>
          <p className="font-dm uppercase" style={{ fontSize: 10, letterSpacing: 1.5, color: "rgba(249,250,251,0.45)" }}>
            Total do módulo
          </p>
          <p className="font-syncopate font-bold tabular-nums" style={{ fontSize: 22, color: "#F9FAFB", lineHeight: 1.2 }} aria-hidden>
            {formatarReais(total)}
          </p>
          <span className="sr-only" aria-live="polite">
            Total {formatarReais(resultado.total)}
          </span>
          {resultado.etiquetas.length > 0 && (
            <p className="font-dm" style={{ fontSize: 11, color: "#22D3EE" }}>
              {resultado.etiquetas.join(" · ")}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="detalhe-preco"
          className="flex items-center gap-1.5 font-dm font-medium shrink-0"
          style={{ minHeight: 44, padding: "0 14px", borderRadius: 6, fontSize: 13, color: "#22D3EE", border: "1px solid rgba(34,211,238,0.35)" }}
        >
          Detalhes
          <ChevronUp size={16} style={{ transform: aberto ? "none" : "rotate(180deg)", transition: "transform .2s" }} />
        </button>
      </div>
    </div>
  );
}
