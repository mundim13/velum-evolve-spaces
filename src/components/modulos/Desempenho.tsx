import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

/**
 * Medidor de desempenho do showroom, para conferir em celulares reais.
 *
 * - Tempo até o 3D aparecer: do início da navegação até o primeiro quadro desenhado.
 * - Fluidez ao girar: intervalos entre quadros seguidos (giro com o dedo ou giro automático). Com o
 *   frameloop "demand", só há quadros enquanto algo se move, então cada sequência contínua é um giro.
 *
 * Com ?medir=1 na URL, os números aparecem num painel no canto da tela. Sempre manda um evento
 * "modulos_desempenho" para o dataLayer (uma vez por visita), para acompanhar os aparelhos reais no GTM.
 */

const PAUSA_MS = 500; // intervalo acima disso encerra a sequência de quadros (o giro parou)
const MIN_QUADROS = 30; // sequências menores não contam como giro
const LENTO_MS = 1000 / 30; // quadro abaixo de 30 fps

interface Giro {
  quadros: number;
  fps: number;
  lentos: number;
  pior: number;
}

const mostrar = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("medir");

function painel() {
  let el = document.getElementById("modulos-medir");
  if (!el) {
    el = document.createElement("div");
    el.id = "modulos-medir";
    Object.assign(el.style, {
      position: "fixed",
      left: "8px",
      bottom: "84px",
      zIndex: "9999",
      padding: "8px 10px",
      borderRadius: "8px",
      background: "rgba(5,5,5,0.85)",
      color: "#22D3EE",
      font: "12px/1.45 ui-monospace, monospace",
      whiteSpace: "pre",
      pointerEvents: "none",
    });
    document.body.appendChild(el);
  }
  return el;
}

function resumo(intervalos: number[]): Giro {
  const total = intervalos.reduce((s, v) => s + v, 0);
  return {
    quadros: intervalos.length,
    fps: Math.round((intervalos.length / total) * 1000),
    lentos: Math.round((intervalos.filter((v) => v > LENTO_MS).length / intervalos.length) * 100),
    pior: Math.round(Math.max(...intervalos)),
  };
}

export function Desempenho() {
  const { gl, viewport } = useThree();
  const estado = useRef({ tempo3d: 0, ultimo: 0, intervalos: [] as number[], giros: [] as Giro[], enviado: false });
  const gpu = useRef("");

  useEffect(() => {
    const ctx = gl.getContext();
    const info = ctx.getExtension("WEBGL_debug_renderer_info");
    gpu.current = info ? String(ctx.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    return () => document.getElementById("modulos-medir")?.remove();
  }, [gl]);

  const atualizarPainel = () => {
    if (!mostrar) return;
    const e = estado.current;
    const g = e.giros[e.giros.length - 1];
    const linhas = [
      `3D visível: ${(e.tempo3d / 1000).toFixed(2)} s`,
      g ? `último giro: ${g.fps} fps · ${g.lentos}% lentos · pior ${g.pior} ms` : "gire o módulo para medir",
      e.giros.length > 1 ? `giros: ${e.giros.length} · média ${Math.round(e.giros.reduce((s, x) => s + x.fps, 0) / e.giros.length)} fps` : "",
      `dpr ${viewport.dpr.toFixed(2)} · ${gpu.current.slice(0, 40)}`,
    ].filter(Boolean);
    painel().textContent = linhas.join("\n");
  };

  const fecharGiro = () => {
    const e = estado.current;
    if (e.intervalos.length >= MIN_QUADROS) {
      const g = resumo(e.intervalos);
      e.giros.push(g);
      if (!e.enviado) {
        e.enviado = true;
        (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({
          event: "modulos_desempenho",
          tempo_3d_ms: Math.round(e.tempo3d),
          fps_giro: g.fps,
          quadros_lentos_pct: g.lentos,
          pior_quadro_ms: g.pior,
          dpr: window.devicePixelRatio,
        });
      }
    }
    e.intervalos = [];
    atualizarPainel();
  };

  useFrame(() => {
    const e = estado.current;
    const agora = performance.now();
    if (!e.tempo3d) {
      e.tempo3d = agora;
      atualizarPainel();
    } else if (agora - e.ultimo > PAUSA_MS) {
      fecharGiro();
    } else {
      e.intervalos.push(agora - e.ultimo);
    }
    e.ultimo = agora;
  });

  // Sem quadros novos (o giro parou), fecha a sequência.
  useEffect(() => {
    const id = window.setInterval(() => {
      const e = estado.current;
      if (e.intervalos.length && performance.now() - e.ultimo > PAUSA_MS) fecharGiro();
    }, PAUSA_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
