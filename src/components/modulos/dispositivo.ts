/** Celular e tablet: menos amostras de AO, sombra menor e sem MSAA (o DPR alto já suaviza). */
export const MOVEL = typeof window !== "undefined" && !!window.matchMedia?.("(pointer: coarse)").matches;
