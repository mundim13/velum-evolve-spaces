import { useCallback, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode, type EffectComposer as Compositor } from "postprocessing";
import * as THREE from "three";
import type { N8AOPostPass } from "n8ao";
import { MOVEL } from "./dispositivo";

/** Pós-processamento: oclusão de ambiente (N8AO), brilho dos LEDs, tone mapping neutro e vinheta leve. */
export default function Efeitos() {
  const { gl, size, viewport, invalidate } = useThree();
  const compositor = useRef<Compositor>(null);

  useEffect(() => {
    // O tone mapping passa para o efeito ToneMapping, para não ser aplicado duas vezes.
    gl.toneMapping = THREE.NoToneMapping;
    invalidate();
    return () => {
      gl.toneMapping = THREE.NeutralToneMapping;
    };
  }, [gl, invalidate]);

  // O compositor só se redimensiona quando muda o tamanho do canvas, não o DPR. Como o DPR sobe
  // quando a câmera para, os buffers (inclusive o da oclusão) ficariam desalinhados da imagem.
  useEffect(() => {
    compositor.current?.setSize(size.width, size.height);
    invalidate();
  }, [size.width, size.height, viewport.dpr, invalidate]);

  const configurarAO = useCallback((passe: N8AOPostPass | null) => {
    if (!passe) return;
    // O compositor já faz a conversão para sRGB no fim; com a correção de gama do N8AO ela seria dupla.
    passe.configuration.gammaCorrection = false;
    // Vidro não escreve profundidade, então o modo "consciente de transparência" não é necessário.
    passe.autoDetectTransparency = false;
    passe.configuration.transparencyAware = false;
  }, []);

  return (
    <EffectComposer ref={compositor} multisampling={MOVEL ? 0 : 4} enableNormalPass={false}>
      <N8AO
        ref={configurarAO}
        aoRadius={0.55}
        distanceFalloff={0.6}
        intensity={2.4}
        quality={MOVEL ? "low" : "high"}
        halfRes={MOVEL}
        depthAwareUpsampling
        color="#140F0A"
      />
      <Bloom mipmapBlur luminanceThreshold={0.95} luminanceSmoothing={0.2} intensity={0.55} radius={0.6} />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <Vignette offset={0.3} darkness={0.45} />
      {MOVEL ? <SMAA /> : <></>}
    </EffectComposer>
  );
}
