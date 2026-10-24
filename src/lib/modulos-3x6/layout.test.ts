import { describe, expect, it } from "vitest";
import { CONFIG_INICIAL, aplicarAtalho, buscarAtalho, reduzir } from "./estado";
import { ARRANJOS, LIVRE_PORTA, ambienteDaConfig, cruzam, layoutVivencia, type Layout } from "./layout";
import { opcoesEsquadria } from "./regras";
import { tabela, type Banheiro, type Config, type Cozinha, type Vivencia } from "./tipos";

const VIVENCIAS: Vivencia[] = ["casal", "solteiro", "estar", "escritorio", "academia", "brinquedoteca", "loja"];
const BANHEIROS: Banheiro[] = ["nenhum", "lavabo", "completo"];
const COZINHAS: Cozinha[] = ["nenhuma", "copa", "completa"];

/** Todas as combinações de vivência × esquadria × banheiro × cozinha. */
function todas(): Config[] {
  const lista: Config[] = [];
  for (const vivencia of VIVENCIAS)
    for (const banheiro of BANHEIROS)
      for (const cozinha of COZINHAS) {
        const base: Config = { ...CONFIG_INICIAL, vivencia, banheiro, cozinha };
        for (const { face, tamanho } of opcoesEsquadria(base)) lista.push({ ...base, esquadria: { face, tamanho } });
      }
  return lista;
}

const nome = (c: Config) => `${c.vivencia}/${c.banheiro}/${c.cozinha}/${c.esquadria.face}-${c.esquadria.tamanho}`;

/** Confere as regras gerais num layout e devolve as violações encontradas. */
function violacoes(l: Layout): string[] {
  const erros: string[] = [];
  for (const p of l.pecas) {
    for (const z of l.zonas) if (cruzam(p.rect, z)) erros.push(`${p.id} na faixa livre de porta`);
    if (p.alto && p.parede) {
      const [u0, u1] = p.parede === "cabeceira" || p.parede === "lateral" ? [p.rect.x0, p.rect.x1] : [p.rect.z0, p.rect.z1];
      for (const v of l.vaos)
        if (v.tipo === "janela" && v.parede === p.parede && u0 < v.u1 && v.u0 < u1) erros.push(`${p.id} (alto) na frente da janela ${v.id}`);
    }
    for (const q of l.pecas) if (q !== p && cruzam(p.rect, q.rect)) erros.push(`${p.id} sobre ${q.id}`);
    const s = l.sala;
    if (p.rect.x0 < s.a - 1e-6 || p.rect.x1 > s.b + 1e-6 || p.rect.z0 < s.zA - 1e-6 || p.rect.z1 > s.zB + 1e-6) erros.push(`${p.id} fora da sala`);
  }
  return erros;
}

describe("layout da vivência: regra geral de aberturas", () => {
  const configs = todas();

  it("cobre todas as combinações (7 vivências × 3 banheiros × 3 cozinhas × 5 esquadrias)", () => {
    expect(configs).toHaveLength(7 * 3 * 3 * 5);
  });

  it.each(configs.map((c) => [nome(c), c] as const))("%s: nenhum móvel na frente de porta, vidro ou janela", (_, c) => {
    const l = layoutVivencia(c);
    expect(violacoes(l)).toEqual([]);
  });

  it.each(configs.map((c) => [nome(c), c] as const))("%s: o ambiente tem os móveis essenciais", (_, c) => {
    const l = layoutVivencia(c);
    const essenciais = ARRANJOS[l.ambiente][0].filter((p) => p.essencial).map((p) => p.id);
    const faltam = essenciais.filter((id) => !l.pecas.some((p) => p.id === id));
    expect(faltam, `faltam ${faltam.join(", ")}`).toEqual([]);
  });

  it.each(configs.map((c) => [nome(c), c] as const))("%s: espelho nunca sobre o painel amadeirado", (_, c) => {
    const l = layoutVivencia(c);
    const painel = c.esquadria.face !== "ladoA";
    const espelhos = l.pecas.filter((p) => p.tipo === "espelho" || p.tipo === "espelho-corpo");
    expect(espelhos.filter((p) => painel && p.parede === "cabeceira")).toEqual([]);
  });

  it("a faixa livre na frente da porta tem 80 cm", () => {
    const l = layoutVivencia(CONFIG_INICIAL);
    const porta = l.zonas.find((z) => z.x1 === l.sala.b)!;
    expect(porta.x1 - porta.x0).toBeCloseTo(LIVRE_PORTA);
  });
});

describe("atalhos", () => {
  const atalho = (id: string) => aplicarAtalho(CONFIG_INICIAL, buscarAtalho(id)!);

  it.each(tabela.atalhos.map((a) => a.id))("%s: todos os móveis declarados cabem", (id) => {
    const l = layoutVivencia(atalho(id));
    expect(l.fora.filter((f) => f !== "planta")).toEqual([]);
    expect(violacoes(l)).toEqual([]);
  });

  it("escritório: a estante não fica na frente da janela da lateral", () => {
    const l = layoutVivencia(atalho("escritorio"));
    const estante = l.pecas.find((p) => p.id === "estante")!;
    const janela = l.vaos.find((v) => v.id === "secundaria")!;
    expect(estante.parede === "lateral" && estante.rect.x0 < janela.u1 && janela.u0 < estante.rect.x1).toBe(false);
  });

  it("gourmet: bancada na parede em frente à porta de vidro lateral, sem sofá nem TV", () => {
    const l = layoutVivencia(atalho("gourmet"));
    expect(l.ambiente).toBe("gourmet");
    expect(l.pecas.find((p) => p.id === "bancada")?.parede).toBe("cabeceira");
    expect(l.pecas.map((p) => p.tipo)).toEqual(expect.arrayContaining(["bancada-gourmet", "frigobar", "mesa-alta"]));
    expect(l.pecas.some((p) => p.tipo === "sofa" || p.tipo === "rack-tv")).toBe(false);
  });

  it("gourmet: a bancada é a cozinha, e a vivência ocupa o módulo inteiro (sem a copa do fundo)", () => {
    const c = atalho("gourmet");
    const l = layoutVivencia(c);
    expect(l.sala.a).toBeCloseTo(-c.comprimento / 2 + 0.12);
    expect(l.vaos.some((v) => v.parede === "fundo" && v.tipo === "porta")).toBe(false);
  });

  it("academia: espelho, rack de anilhas e cardio", () => {
    const tipos = layoutVivencia(atalho("academia")).pecas.map((p) => p.tipo);
    expect(tipos).toEqual(expect.arrayContaining(["espelho", "rack-anilhas", "esteira"]));
  });

  it("loja: vitrine, balcão com caixa e prateleiras", () => {
    const tipos = layoutVivencia(atalho("loja")).pecas.map((p) => p.tipo);
    expect(tipos).toEqual(expect.arrayContaining(["vitrine", "balcao-caixa", "prateleira-loja"]));
  });

  it("começar do zero: módulo vazio de verdade", () => {
    const zero = reduzir(CONFIG_INICIAL, { tipo: "zerar" });
    expect(ambienteDaConfig(zero)).toBe("vazio");
    expect(layoutVivencia(zero).pecas).toEqual([]);
  });

  it("estúdio: rack da TV fora da janela, mesmo com o vidro na lateral", () => {
    for (const face of ["testada", "ladoA", "ladoB"] as const) {
      const c = reduzir(atalho("estudio"), { tipo: "esquadria", face, tamanho: "parcial" });
      const l = layoutVivencia(c);
      expect(l.pecas.map((p) => p.id)).toEqual(expect.arrayContaining(["sofa", "tv"]));
      expect(violacoes(l)).toEqual([]);
    }
  });
});
