import { CONFIG_INICIAL } from "./estado";
import type { Ambiente } from "./layout";
import type { Config } from "./tipos";

/**
 * Módulo franquia Teslink ("A Casa da Starlink"): o mesmo 3x6 da Velum, em grafite, com vitrine de vidro
 * fora a fora na lateral (a fachada que dá para a rua), lavabo e copa no fundo e a loja da marca na vivência.
 */
export const CONFIG_FRANQUIA: Config = {
  ...CONFIG_INICIAL,
  banheiro: "lavabo",
  cozinha: "copa",
  vivencia: "loja",
  esquadria: { face: "ladoB", tamanho: "fora" },
  fachada: { tipo: "textura", cor: "grafite", wpc: "cinza" },
  atalho: null,
};

export const AMBIENTE_FRANQUIA: Ambiente = "franquia";
