import { CONFIG_INICIAL } from "./estado";
import { normalizarEsquadria } from "./regras";
import { tabela, type Config, type Entrega, type Extras } from "./tipos";

/** Chave versionada: se o formato mudar, uma versão nova ignora o que ficou salvo da anterior. */
export const CHAVE = "velum:modulo-3x6:v1";

const um = <T extends string>(valor: unknown, aceitos: readonly T[], padrao: T): T =>
  typeof valor === "string" && (aceitos as readonly string[]).includes(valor) ? (valor as T) : padrao;
const bool = (valor: unknown, padrao: boolean) => (typeof valor === "boolean" ? valor : padrao);
const objeto = (valor: unknown): Record<string, unknown> =>
  valor && typeof valor === "object" ? (valor as Record<string, unknown>) : {};
const texto = (valor: unknown, max = 80) => (typeof valor === "string" ? valor.slice(0, max) : "");

/**
 * Reconstrói a configuração a partir do que estava salvo, aceitando só valores conhecidos.
 * Qualquer campo ausente, antigo ou adulterado volta para o padrão (o Cazita).
 */
export function validarConfig(bruto: unknown): Config {
  const base = CONFIG_INICIAL;
  if (!bruto || typeof bruto !== "object") return base;
  const c = objeto(bruto);
  const esquadria = objeto(c.esquadria);
  const fachada = objeto(c.fachada);
  const extras = objeto(c.extras);
  const entrega = objeto(c.entrega);

  const extrasValidos: Extras = {
    kitMobilia: bool(extras.kitMobilia, base.extras.kitMobilia),
    deck: bool(extras.deck, base.extras.deck),
    pergolado: bool(extras.pergolado, base.extras.pergolado) && bool(extras.deck, false),
    fundacao: bool(extras.fundacao, base.extras.fundacao),
    kitAirbnb: bool(extras.kitAirbnb, base.extras.kitAirbnb),
  };
  const km = typeof entrega.km === "number" && Number.isFinite(entrega.km) && entrega.km >= 0 && entrega.km < 5000 ? entrega.km : null;
  const entregaValida: Entrega = {
    modo: um(entrega.modo, ["regiao", "fora"] as const, "regiao"),
    cidade: texto(entrega.cidade),
    cep: texto(entrega.cep, 9),
    km,
  };

  return {
    // Comprimento e altura não vêm do navegador: são do produto (3x6).
    comprimento: base.comprimento,
    altura: base.altura,
    banheiro: um(c.banheiro, Object.keys(tabela.banheiro) as Config["banheiro"][], base.banheiro),
    cozinha: um(c.cozinha, Object.keys(tabela.cozinha) as Config["cozinha"][], base.cozinha),
    vivencia: um(c.vivencia, Object.keys(tabela.vivencia) as Config["vivencia"][], base.vivencia),
    esquadria: normalizarEsquadria(
      um(esquadria.face, ["testada", "ladoA", "ladoB"] as const, base.esquadria.face),
      um(esquadria.tamanho, ["padrao", "parcial", "fora"] as const, base.esquadria.tamanho),
    ),
    fachada: {
      tipo: um(fachada.tipo, ["textura", "ripadoFrontal", "ripadoCompleto"] as const, base.fachada.tipo),
      cor: um(fachada.cor, Object.keys(tabela.cores.textura) as Config["fachada"]["cor"][], base.fachada.cor),
      wpc: um(fachada.wpc, Object.keys(tabela.cores.wpc) as Config["fachada"]["wpc"][], base.fachada.wpc),
    },
    atalho: typeof c.atalho === "string" && tabela.atalhos.some((a) => a.id === c.atalho) ? c.atalho : null,
    extras: extrasValidos,
    entrega: entregaValida,
  };
}

/** Lê a configuração guardada. Sem armazenamento disponível (aba anônima, bloqueio), abre o Cazita. */
export function carregarConfig(armazenamento: Pick<Storage, "getItem"> | null = navegador()): Config {
  try {
    const salvo = armazenamento?.getItem(CHAVE);
    return salvo ? validarConfig(JSON.parse(salvo)) : CONFIG_INICIAL;
  } catch {
    return CONFIG_INICIAL;
  }
}

export function salvarConfig(config: Config, armazenamento: Pick<Storage, "setItem"> | null = navegador()) {
  try {
    armazenamento?.setItem(CHAVE, JSON.stringify(config));
  } catch {
    // Armazenamento cheio ou bloqueado: o simulador segue funcionando, só não lembra da configuração.
  }
}

function navegador(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}
